#!/usr/bin/env node
/**
 * Pre-submission preflight. Verifies the web bundle and iOS assets/settings
 * that App Store Connect rejects builds for, before you archive in Xcode.
 *
 *   node scripts/ios-preflight.mjs
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const problems = [];
const notes = [];
const ok = [];

const check = (label, condition, hint) =>
  condition ? ok.push(label) : problems.push(`${label} — ${hint}`);

// Web bundle
const dist = resolve(root, "dist/client");
check(
  "Web bundle built (dist/client)",
  existsSync(resolve(dist, "index.html")),
  "run `bun run build` before `bunx cap sync ios`",
);

// Icons
for (const icon of ["public/icon-512.png", "public/icon-192.png", "public/favicon.png"]) {
  const p = resolve(root, icon);
  check(`Icon present: ${icon}`, existsSync(p) && statSync(p).size > 1000, "regenerate the app icon");
}

// Capacitor config
const capConfig = readFileSync(resolve(root, "capacitor.config.ts"), "utf8");
check("Capacitor appId set", /appId:\s*"[a-z0-9.]+\.[a-z0-9.]+"/i.test(capConfig), "set a reverse-DNS bundle id");
check("Capacitor webDir is dist/client", /webDir:\s*"dist\/client"/.test(capConfig), "TanStack Start emits dist/client");

// Version
const version = JSON.parse(readFileSync(resolve(root, "app.version.json"), "utf8"));
check(
  "Version + build number valid",
  /^\d+\.\d+\.\d+$/.test(version.version) && Number.isInteger(version.build) && version.build >= 1,
  "fix app.version.json",
);
notes.push(`Version to ship: ${version.version} (${version.build})`);

// Native project
const pbxproj = resolve(root, "ios/App/App.xcodeproj/project.pbxproj");
if (existsSync(pbxproj)) {
  const proj = readFileSync(pbxproj, "utf8");
  check(
    "Xcode MARKETING_VERSION matches app.version.json",
    proj.includes(`MARKETING_VERSION = ${version.version};`),
    "run `bun run ios:version:sync`",
  );
  check(
    "Xcode CURRENT_PROJECT_VERSION matches app.version.json",
    proj.includes(`CURRENT_PROJECT_VERSION = ${version.build};`),
    "run `bun run ios:version:sync`",
  );

  const plist = resolve(root, "ios/App/App/Info.plist");
  if (existsSync(plist)) {
    const info = readFileSync(plist, "utf8");
    check(
      "Microphone usage description present",
      info.includes("NSMicrophoneUsageDescription"),
      "copy the keys from ios-template/Info.additions.plist (voice recording requires it)",
    );
    check(
      "Encryption exemption declared",
      info.includes("ITSAppUsesNonExemptEncryption"),
      "add ITSAppUsesNonExemptEncryption=false to skip the export-compliance prompt",
    );
    check(
      "Portrait-only orientation set",
      info.includes("UIInterfaceOrientationPortrait"),
      "set supported orientations in Info.plist",
    );
  } else {
    notes.push("ios/App/App/Info.plist not found — regenerate with `bunx cap add ios`.");
  }
} else {
  notes.push("ios/ not generated yet — run `bunx cap add ios` on your Mac (native project is not committed).");
}

console.log("\nAurelia — iOS submission preflight\n");
for (const line of ok) console.log(`  PASS  ${line}`);
for (const line of notes) console.log(`  INFO  ${line}`);
for (const line of problems) console.log(`  FAIL  ${line}`);
console.log("");

if (problems.length) {
  console.log(`${problems.length} item(s) need attention before submitting.\n`);
  process.exit(1);
}
console.log("Ready to archive and upload to TestFlight.\n");
