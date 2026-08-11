#!/usr/bin/env node
/**
 * App Store Connect submission checklist.
 *
 *   bun run ios:checklist
 *
 * Reports what the API can verify (metadata, screenshots, privacy policy, age
 * rating, TestFlight notes) and prints the items that must be checked by hand.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCredentials, ascFetch, findApp } from "./asc-api.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const credentials = loadCredentials();

const appId = (() => {
  const cap = readFileSync(resolve(root, "capacitor.config.ts"), "utf8");
  return cap.match(/appId:\s*"([^"]+)"/)?.[1];
})();

const pass = [];
const warn = [];
const info = [];
const check = (label, ok, hint) => (ok ? pass.push(label) : warn.push(`${label} — ${hint}`));

const REQUIRED_SCREENSHOT_SETS = [
  "APP_IPHONE_67", // 1290 x 2796
  "APP_IPHONE_65", // 1242 x 2688
];

const app = await findApp(credentials, appId);
if (!app) {
  console.error(
    `\nNo App Store Connect app found for bundle id ${appId}.\n` +
      `Create the app record in App Store Connect (My Apps -> +) first.\n`,
  );
  process.exit(1);
}
info.push(`App: ${app.attributes.name} (${appId}), app id ${app.id}`);

// ---- version + localisation metadata
const { data: versions } = await ascFetch(
  `/v1/apps/${app.id}/appStoreVersions?limit=1&sort=-createdDate`,
  credentials,
);
const version = versions?.[0];
if (!version) {
  warn.push("No App Store version — create one in App Store Connect to fill metadata.");
} else {
  info.push(`Latest version: ${version.attributes.versionString} (${version.attributes.appStoreState})`);

  const { data: locs } = await ascFetch(
    `/v1/appStoreVersions/${version.id}/appStoreVersionLocalizations`,
    credentials,
  );
  const primary = locs?.[0];
  if (!primary) {
    warn.push("No version localisation — add description, keywords and URLs.");
  } else {
    const a = primary.attributes;
    check("Description", Boolean(a.description?.trim()), "add the App Store description");
    check("Keywords", Boolean(a.keywords?.trim()), "add keywords (100 characters max)");
    check("Promotional text", Boolean(a.promotionalText?.trim()), "optional but recommended");
    check("Support URL", Boolean(a.supportUrl?.trim()), "required by review");
    check("Marketing URL", Boolean(a.marketingUrl?.trim()), "optional");
    check("What's new", Boolean(a.whatsNew?.trim()) || version.attributes.versionString === "1.0.0", "add release notes");

    // ---- screenshots
    const { data: sets } = await ascFetch(
      `/v1/appStoreVersionLocalizations/${primary.id}/appScreenshotSets`,
      credentials,
    );
    const present = new Set((sets ?? []).map((s) => s.attributes.screenshotDisplayType));
    for (const type of REQUIRED_SCREENSHOT_SETS) {
      check(`Screenshots ${type}`, present.has(type), "upload portrait screenshots for this size");
    }
  }
}

// ---- app info: privacy policy, age rating, category
const { data: infos } = await ascFetch(`/v1/apps/${app.id}/appInfos?limit=1`, credentials);
const appInfo = infos?.[0];
if (appInfo) {
  const rels = appInfo.relationships ?? {};
  check("Primary category set", Boolean(rels.primaryCategory?.data), "pick Health & Fitness or Lifestyle");

  const { data: infoLocs } = await ascFetch(
    `/v1/appInfos/${appInfo.id}/appInfoLocalizations`,
    credentials,
  );
  const infoLoc = infoLocs?.[0];
  check("App name", Boolean(infoLoc?.attributes?.name?.trim()), "set the App Store name");
  check("Subtitle", Boolean(infoLoc?.attributes?.subtitle?.trim()), "add a subtitle");
  check(
    "Privacy policy URL",
    Boolean(infoLoc?.attributes?.privacyPolicyUrl?.trim()),
    "required — the app stores account data",
  );

  const ageId = rels.ageRatingDeclaration?.data?.id;
  if (ageId) {
    const { data: age } = await ascFetch(`/v1/ageRatingDeclarations/${ageId}`, credentials);
    check("Age rating questionnaire", Boolean(age?.attributes), "complete the age rating questionnaire");
  } else {
    warn.push("Age rating declaration missing — complete the questionnaire.");
  }
}

// ---- TestFlight beta notes on the newest build
const { data: builds } = await ascFetch(
  `/v1/builds?filter[app]=${app.id}&limit=1&sort=-uploadedDate`,
  credentials,
);
const build = builds?.[0];
if (build) {
  info.push(
    `Newest build: ${build.attributes.version} — ${build.attributes.processingState}` +
      (build.attributes.expired ? " (expired)" : ""),
  );
  const { data: betaLocs } = await ascFetch(
    `/v1/builds/${build.id}/betaBuildLocalizations`,
    credentials,
  ).catch(() => ({ data: [] }));
  check(
    'TestFlight "What to Test"',
    Boolean(betaLocs?.[0]?.attributes?.whatsNew?.trim()),
    "add tester notes for this build",
  );
  const compliance = build.attributes.usesNonExemptEncryption;
  check(
    "Export compliance answered",
    compliance === false || compliance === true,
    "ITSAppUsesNonExemptEncryption should answer this automatically",
  );
} else {
  warn.push("No build uploaded yet — run `bun run ios:ship`.");
}

console.log("\nAurelia — App Store Connect checklist\n");
for (const line of info) console.log(`  INFO  ${line}`);
for (const line of pass) console.log(`  PASS  ${line}`);
for (const line of warn) console.log(`  TODO  ${line}`);
console.log("\n  Manual checks (not exposed by the API):");
for (const line of [
  "App Privacy answers: Contact Info (email), User Content (journal, gratitude, voice), Identifiers — linked to user, not used for tracking",
  "Screenshots show real content, portrait, no device frames with status-bar mismatches",
  "Demo account / review notes if the reviewer needs to sign in",
  "Pricing and availability set, and the build attached to the version",
]) {
  console.log(`        - ${line}`);
}
console.log("");

if (warn.length) {
  console.log(`${warn.length} item(s) still to do before submitting.\n`);
  process.exit(1);
}
console.log("Everything the API can see is ready for submission.\n");
