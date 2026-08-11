#!/usr/bin/env node
/**
 * One command from source to App Store Connect.
 *
 *   bun run ios:ship                      # new TestFlight build of this version
 *   bun run ios:ship -- --version 1.1.0   # new App Store version, build -> 1
 *   bun run ios:ship -- --dry-run         # build + archive + export, no upload
 *   bun run ios:ship -- --no-bump         # re-upload attempt without bumping
 *   bun run ios:ship -- --skip-build      # reuse dist/ and the synced ios/
 *   bun run ios:ship -- --no-wait         # don't poll for processing state
 *
 * Optional distribution flags (run after processing completes):
 *   --testflight                          # add to internal beta groups, submit
 *                                         #   for beta review if any is external
 *   --beta-group "Name,Other"             # target specific groups (repeatable)
 *   --what-to-test "Fixed the ritual"     # TestFlight tester notes
 *   --app-store                           # create/attach the App Store version
 *                                         #   and submit it for review
 *   --release auto|manual|2026-09-01T10:00Z
 *                                         # release strategy for --app-store
 *   --phased                              # 7-day phased rollout
 *
 * Requires macOS + Xcode and the ASC_* credentials (see scripts/asc-api.mjs).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCredentials, ascFetch, findApp, sleep } from "./asc-api.mjs";
import { submitToTestFlight, submitToAppStore, parseReleaseDate } from "./asc-submit.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = resolve(root, "build");
const archivePath = resolve(buildDir, "Aurelia.xcarchive");
const ipaDir = resolve(buildDir, "ipa");
const logDir = resolve(buildDir, "logs");

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const value = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const values = (name) =>
  argv.reduce((acc, arg, i) => (arg === `--${name}` && argv[i + 1] ? [...acc, argv[i + 1]] : acc), []);

const opts = {
  version: value("version"),
  bump: !flag("no-bump"),
  dryRun: flag("dry-run"),
  skipBuild: flag("skip-build"),
  wait: !flag("no-wait"),
  testflight: flag("testflight") || values("beta-group").length > 0,
  betaGroups: values("beta-group")
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter(Boolean),
  whatToTest: value("what-to-test"),
  appStore: flag("app-store"),
  release: value("release") ?? "auto",
  phased: flag("phased"),
};


const step = (msg) => console.log(`\n\u2192 ${msg}`);
const fail = (msg) => {
  console.error(`\nFAILED: ${msg}\n`);
  process.exit(1);
};

// Distribution needs a processed build, so it implies waiting.
const distributing = opts.testflight || opts.appStore;
if (distributing) opts.wait = true;

const releaseStrategy = (() => {
  if (!opts.appStore) return null;
  const raw = String(opts.release).toLowerCase();
  if (raw === "auto" || raw === "after-approval") return { type: "AFTER_APPROVAL", phased: opts.phased };
  if (raw === "manual") return { type: "MANUAL", phased: opts.phased };
  try {
    return { type: "SCHEDULED", date: parseReleaseDate(opts.release), phased: opts.phased };
  } catch (error) {
    fail(error.message);
  }
})();


function run(cmd, args, { logFile, ...options } = {}) {
  const pretty = `${cmd} ${args.join(" ")}`;
  console.log(`  $ ${pretty}`);
  if (logFile) {
    mkdirSync(logDir, { recursive: true });
    const result = spawnSync("bash", ["-o", "pipefail", "-c", `${shellQuote([cmd, ...args])} 2>&1 | tee ${shellQuote([logFile])}`], {
      cwd: root,
      stdio: "inherit",
      ...options,
    });
    if (result.status !== 0) fail(`${cmd} exited with code ${result.status}. Log: ${logFile}`);
    return;
  }
  const result = spawnSync(cmd, args, { cwd: root, stdio: "inherit", ...options });
  if (result.status !== 0) fail(`${cmd} exited with code ${result.status}`);
}

const shellQuote = (parts) => parts.map((p) => `'${String(p).replace(/'/g, `'\\''`)}'`).join(" ");

function capture(cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "";
}

// ---------------------------------------------------------------- preconditions
if (process.platform !== "darwin") {
  fail("Archiving an iOS app requires macOS with Xcode. Use the GitHub Actions workflow (.github/workflows/ios-release.yml) if you don't have a Mac.");
}
if (!capture("which", ["xcodebuild"])) {
  fail("xcodebuild not found — install Xcode and run `sudo xcode-select --switch /Applications/Xcode.app`.");
}

const credentials = loadCredentials();

const appId = (() => {
  const cap = readFileSync(resolve(root, "capacitor.config.ts"), "utf8");
  const match = cap.match(/appId:\s*"([^"]+)"/);
  if (!match) fail("Could not read appId from capacitor.config.ts");
  return match[1];
})();

// -------------------------------------------------------------------- versioning
if (opts.version) {
  step(`Setting marketing version to ${opts.version}`);
  run("node", ["scripts/version.mjs", "set", opts.version]);
} else if (opts.bump) {
  step("Bumping build number");
  run("node", ["scripts/version.mjs", "bump-build"]);
}
const version = JSON.parse(readFileSync(resolve(root, "app.version.json"), "utf8"));
console.log(`  Shipping ${version.version} (${version.build}) as ${appId}`);

// ------------------------------------------------------------------ web + native
if (!opts.skipBuild) {
  step("Building the web bundle and syncing Capacitor");
  run("bun", ["run", "build"]);
  if (!existsSync(resolve(root, "ios/App/App.xcworkspace"))) {
    run("bunx", ["cap", "add", "ios"]);
  }
  run("bunx", ["cap", "sync", "ios"]);
  run("node", ["scripts/version.mjs", "sync-ios"]);
  run("node", ["scripts/ios-release-settings.mjs"]);
}

step("Preflight");
run("node", ["scripts/ios-preflight.mjs"]);

// ---------------------------------------------------------------------- archive
const authArgs = [
  "-authenticationKeyPath",
  credentials.keyPath,
  "-authenticationKeyID",
  credentials.keyId,
  "-authenticationKeyIssuerID",
  credentials.issuerId,
  "-allowProvisioningUpdates",
];

step("Archiving (Release)");
rmSync(archivePath, { recursive: true, force: true });
mkdirSync(buildDir, { recursive: true });
run(
  "xcodebuild",
  [
    "-workspace",
    "ios/App/App.xcworkspace",
    "-scheme",
    "App",
    "-configuration",
    "Release",
    "-destination",
    "generic/platform=iOS",
    "-archivePath",
    archivePath,
    ...authArgs,
    "archive",
  ],
  { logFile: resolve(logDir, "archive.log") },
);

// --------------------------------------------------------------------- teamID
function resolveTeamId() {
  if (credentials.teamId) return credentials.teamId;
  const plist = resolve(archivePath, "Info.plist");
  const fromArchive = capture("/usr/libexec/PlistBuddy", [
    "-c",
    "Print :ApplicationProperties:Team",
    plist,
  ]);
  if (fromArchive) return fromArchive;
  const embedded = capture("bash", [
    "-c",
    `security cms -D -i "${archivePath}/Products/Applications/App.app/embedded.mobileprovision" 2>/dev/null | plutil -extract TeamIdentifier.0 raw -o - -`,
  ]);
  if (embedded) return embedded;
  fail("Could not determine the Apple Developer team id — set ASC_TEAM_ID.");
}
const teamId = resolveTeamId();
console.log(`  Team: ${teamId}`);

// ----------------------------------------------------------------------- export
step("Exporting a signed IPA");
const exportOptions = readFileSync(resolve(root, "ios-template/ExportOptions.plist"), "utf8").replace(
  "<string>TEAMID</string>",
  `<string>${teamId}</string>`,
);
const exportOptionsPath = resolve(buildDir, "ExportOptions.generated.plist");
writeFileSync(exportOptionsPath, exportOptions);
rmSync(ipaDir, { recursive: true, force: true });
run(
  "xcodebuild",
  [
    "-exportArchive",
    "-archivePath",
    archivePath,
    "-exportOptionsPlist",
    exportOptionsPath,
    "-exportPath",
    ipaDir,
    ...authArgs,
  ],
  { logFile: resolve(logDir, "export.log") },
);

const ipaPath = capture("bash", ["-c", `ls ${shellQuote([ipaDir])}/*.ipa 2>/dev/null | head -1`]);
if (!ipaPath) fail(`No .ipa produced in ${ipaDir}. See ${resolve(logDir, "export.log")}`);
console.log(`  IPA: ${ipaPath}`);

if (opts.dryRun) {
  console.log("\nDry run complete — archive and signed IPA verified, nothing uploaded.\n");
  process.exit(0);
}

// ----------------------------------------------------------------------- upload
step("Uploading to App Store Connect");
let uploaded = false;
for (let attempt = 1; attempt <= 3 && !uploaded; attempt += 1) {
  const result = spawnSync(
    "xcrun",
    [
      "altool",
      "--upload-app",
      "-f",
      ipaPath,
      "-t",
      "ios",
      "--apiKey",
      credentials.keyId,
      "--apiIssuer",
      credentials.issuerId,
    ],
    { cwd: root, encoding: "utf8", env: process.env },
  );
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  process.stdout.write(output);
  if (result.status === 0) {
    uploaded = true;
    break;
  }
  const transient = /(5\d\d|timed out|try again|temporarily unavailable|connection)/i.test(output);
  if (!transient || attempt === 3) {
    fail(`altool upload failed (attempt ${attempt}). See the output above.`);
  }
  console.log(`  Transient failure — retrying in ${attempt * 15}s…`);
  await sleep(attempt * 15000);
}

// ------------------------------------------------------------------ wait for ASC
if (!opts.wait) {
  console.log(`\nUploaded ${version.version} (${version.build}). Processing continues in App Store Connect.\n`);
  process.exit(0);
}

step("Waiting for App Store Connect to finish processing");
const app = await findApp(credentials, appId).catch((error) => fail(error.message));
if (!app) {
  console.log(`  No app record found for ${appId} yet — check App Store Connect manually.`);
  process.exit(0);
}

const deadline = Date.now() + 45 * 60 * 1000;
let state = "PENDING";
let validBuild = null;
while (Date.now() < deadline && !validBuild) {
  const { data } = await ascFetch(
    `/v1/builds?filter[app]=${app.id}&filter[version]=${version.build}&limit=1`,
    credentials,
  ).catch((error) => {
    console.log(`  Poll failed (${error.message}) — retrying.`);
    return { data: [] };
  });
  const build = data?.[0];
  if (build) {
    state = build.attributes.processingState;
    console.log(`  Build ${version.version} (${version.build}): ${state}`);
    if (state === "VALID") {
      validBuild = build;
      break;
    }
    if (state === "FAILED" || state === "INVALID") {
      fail(`App Store Connect rejected the build (${state}). Check the email/Activity tab for details.`);
    }
  } else {
    console.log("  Build not visible yet…");
  }
  await sleep(30000);
}

if (!validBuild) {
  console.log(`\nStill processing after 45 minutes (last state: ${state}). Check App Store Connect.\n`);
  process.exit(0);
}

console.log(`\nReady for TestFlight: https://appstoreconnect.apple.com/apps/${app.id}/testflight/ios`);

if (opts.testflight) {
  step("Distributing to TestFlight");
  await submitToTestFlight(credentials, {
    app,
    build: validBuild,
    names: opts.betaGroups,
    whatToTest: opts.whatToTest,
  }).catch((error) => fail(error.message));
}

if (opts.appStore) {
  step("Submitting to the App Store");
  await submitToAppStore(credentials, {
    app,
    build: validBuild,
    versionString: version.version,
    release: releaseStrategy,
  }).catch((error) => fail(error.message));
  console.log(
    `\nApp Store submission: https://appstoreconnect.apple.com/apps/${app.id}/distribution/ios/version/inflight\n`,
  );
} else {
  console.log("");
}

