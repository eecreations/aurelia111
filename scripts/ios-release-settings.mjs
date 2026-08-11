#!/usr/bin/env node
/**
 * Applies the App Store Release build settings and required Info.plist keys to
 * the generated (uncommitted) native iOS project, so archiving never depends on
 * manual Xcode edits.
 *
 *   node scripts/ios-release-settings.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pbxproj = resolve(root, "ios/App/App.xcodeproj/project.pbxproj");
const plistPath = resolve(root, "ios/App/App/Info.plist");
const additionsPath = resolve(root, "ios-template/Info.additions.plist");

if (!existsSync(pbxproj)) {
  console.log("ios/ not generated yet — run `bun run ios:add` first (skipped).");
  process.exit(0);
}

/** Settings that App Store review / symbolicated crash reports require. */
const RELEASE_SETTINGS = {
  SWIFT_OPTIMIZATION_LEVEL: '"-O -whole-module-optimization"',
  GCC_OPTIMIZATION_LEVEL: "s",
  DEBUG_INFORMATION_FORMAT: '"dwarf-with-dsym"',
  COPY_PHASE_STRIP: "YES",
  VALIDATE_PRODUCT: "YES",
  ENABLE_BITCODE: "NO",
  IPHONEOS_DEPLOYMENT_TARGET: "14.0",
  TARGETED_DEVICE_FAMILY: '"1"',
  ENABLE_USER_SCRIPT_SANDBOXING: "NO",
};

const original = readFileSync(pbxproj, "utf8");
let next = original;
let touchedBlocks = 0;

// Rewrite every Release XCBuildConfiguration buildSettings block.
next = next.replace(
  /(\/\* Release \*\/ = \{\n\s*isa = XCBuildConfiguration;\n(?:.*\n)*?\s*buildSettings = \{\n)([\s\S]*?)(\n(\s*)\};)/g,
  (match, head, bodyRaw, tail, indent) => {
    touchedBlocks += 1;
    const itemIndent = `${indent}\t`;
    let body = bodyRaw;
    for (const [key, value] of Object.entries(RELEASE_SETTINGS)) {
      const re = new RegExp(`^(\\s*)${key} = [^;]*;$`, "m");
      if (re.test(body)) {
        body = body.replace(re, `$1${key} = ${value};`);
      } else {
        body += `\n${itemIndent}${key} = ${value};`;
      }
    }
    return `${head}${body}${tail}`;
  },
);

if (!touchedBlocks) {
  console.warn("No Release build configurations found in the Xcode project.");
} else if (next !== original) {
  writeFileSync(pbxproj, next);
  console.log(`Release build settings applied to ${touchedBlocks} configuration(s).`);
} else {
  console.log("Release build settings already up to date.");
}

// Merge the checked-in Info.plist additions into the generated Info.plist.
if (existsSync(plistPath) && existsSync(additionsPath)) {
  const additions = readFileSync(additionsPath, "utf8");
  const inner = additions.match(/<dict>([\s\S]*)<\/dict>/);
  if (!inner) {
    console.warn("ios-template/Info.additions.plist has no <dict> body — skipped.");
  } else {
    // Split the additions into <key>...</key> + value pairs.
    const entries = [];
    const keyRe = /<key>([^<]+)<\/key>/g;
    const bodyText = inner[1];
    const positions = [];
    let m;
    while ((m = keyRe.exec(bodyText)) !== null) positions.push({ key: m[1], start: m.index });
    positions.forEach((p, i) => {
      const end = i + 1 < positions.length ? positions[i + 1].start : bodyText.length;
      entries.push({ key: p.key, xml: bodyText.slice(p.start, end).replace(/\s+$/, "") });
    });

    let plist = readFileSync(plistPath, "utf8");
    let added = 0;
    let replaced = 0;
    for (const entry of entries) {
      const existing = new RegExp(
        `\\n[ \\t]*<key>${entry.key}<\\/key>[\\s\\S]*?(?=\\n[ \\t]*<key>|\\n[ \\t]*<\\/dict>)`,
      );
      const block = `\n${entry.xml.replace(/^\s+/, "").replace(/\n\s*/g, "\n\t")}`;
      if (existing.test(plist)) {
        plist = plist.replace(existing, block);
        replaced += 1;
      } else {
        plist = plist.replace(/(\n[ \t]*<\/dict>)/, `${block}$1`);
        added += 1;
      }
    }
    writeFileSync(plistPath, plist);
    console.log(`Info.plist: ${added} key(s) added, ${replaced} updated.`);
  }
} else if (!existsSync(plistPath)) {
  console.log("ios/App/App/Info.plist not found — skipped plist merge.");
}
