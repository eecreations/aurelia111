#!/usr/bin/env node
/**
 * Single source of truth for the app's marketing version and build number.
 *
 *   node scripts/version.mjs                 # print current version
 *   node scripts/version.mjs bump-build      # 1.0.0 (1) -> 1.0.0 (2)
 *   node scripts/version.mjs set 1.2.0       # set marketing version, build -> 1
 *   node scripts/version.mjs sync-ios        # stamp into ios/ Xcode project
 *
 * Keeps app.version.json, package.json and (when present) the generated
 * native iOS project in lockstep. App Store Connect requires the build number
 * to increase for every TestFlight upload of the same version.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const versionFile = resolve(root, "app.version.json");
const pkgFile = resolve(root, "package.json");
const pbxproj = resolve(root, "ios/App/App.xcodeproj/project.pbxproj");
const tsVersionFile = resolve(root, "src/lib/app-version.ts");

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const writeJson = (p, v) => writeFileSync(p, `${JSON.stringify(v, null, 2)}\n`);

function load() {
  const v = readJson(versionFile);
  if (!/^\d+\.\d+\.\d+$/.test(v.version)) {
    throw new Error(`app.version.json: version must be x.y.z, got "${v.version}"`);
  }
  if (!Number.isInteger(v.build) || v.build < 1) {
    throw new Error(`app.version.json: build must be a positive integer`);
  }
  return v;
}

function save(v) {
  writeJson(versionFile, v);
  const pkg = readJson(pkgFile);
  pkg.version = v.version;
  writeJson(pkgFile, pkg);
  writeFileSync(
    tsVersionFile,
    [
      "// Kept in sync with app.version.json by `bun run ios:version:*`.",
      "// Displayed in Settings so testers can report the exact TestFlight build.",
      `export const APP_VERSION = "${v.version}";`,
      `export const APP_BUILD = ${v.build};`,
      "export const APP_VERSION_LABEL = `Version ${APP_VERSION} (${APP_BUILD})`;",
      "",
    ].join("\n"),
  );
}

function syncIos(v) {
  if (!existsSync(pbxproj)) {
    console.log("ios/ not generated yet — run `bunx cap add ios` first (skipped).");
    return;
  }
  const original = readFileSync(pbxproj, "utf8");
  const next = original
    .replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${v.version};`)
    .replace(/CURRENT_PROJECT_VERSION = [^;]+;/g, `CURRENT_PROJECT_VERSION = ${v.build};`);
  if (next === original) {
    console.warn("No MARKETING_VERSION/CURRENT_PROJECT_VERSION found in Xcode project.");
    return;
  }
  writeFileSync(pbxproj, next);
  console.log(`Xcode project stamped: ${v.version} (${v.build})`);
}

const [cmd, arg] = process.argv.slice(2);
const current = load();

switch (cmd) {
  case undefined:
  case "print":
    console.log(`${current.version} (${current.build})`);
    break;
  case "bump-build": {
    const next = { ...current, build: current.build + 1 };
    save(next);
    syncIos(next);
    console.log(`Build bumped to ${next.version} (${next.build})`);
    break;
  }
  case "set": {
    if (!arg) throw new Error("Usage: node scripts/version.mjs set <x.y.z>");
    const next = { version: arg, build: 1 };
    save(next);
    syncIos(next);
    console.log(`Version set to ${next.version} (${next.build})`);
    break;
  }
  case "sync-ios":
    syncIos(current);
    break;
  default:
    throw new Error(`Unknown command "${cmd}"`);
}
