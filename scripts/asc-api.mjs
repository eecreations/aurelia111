/**
 * Shared App Store Connect API helpers.
 *
 * Credentials come from the environment (never the repo):
 *   ASC_KEY_ID     — App Store Connect API key id
 *   ASC_ISSUER_ID  — issuer id shown above the key list
 *   ASC_KEY_PATH   — path to the downloaded AuthKey_XXXX.p8
 *   ASC_TEAM_ID    — optional; Apple Developer team id used for export
 */
import { createSign } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";

const CREDENTIAL_HELP = `
Missing App Store Connect API credentials.

  1. App Store Connect -> Users and Access -> Integrations ->
     App Store Connect API -> generate a key with "App Manager" access.
  2. Download the .p8 file (only possible once) and keep it somewhere safe,
     e.g. ~/.appstoreconnect/private_keys/AuthKey_XXXXXXXXXX.p8
  3. Export these in your shell profile (or a gitignored .env.local):

       export ASC_KEY_ID=XXXXXXXXXX
       export ASC_ISSUER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
       export ASC_KEY_PATH=~/.appstoreconnect/private_keys/AuthKey_XXXXXXXXXX.p8
       # optional, otherwise read from the built archive
       export ASC_TEAM_ID=YOURTEAMID
`;

export function expandHome(p) {
  return p.startsWith("~") ? resolve(homedir(), p.slice(1).replace(/^[/\\]/, "")) : resolve(p);
}

/** Reads and validates credentials, exiting with instructions when incomplete. */
export function loadCredentials({ requireKeyFile = true } = {}) {
  const keyId = process.env.ASC_KEY_ID;
  const issuerId = process.env.ASC_ISSUER_ID;
  const rawPath = process.env.ASC_KEY_PATH ?? process.env.ASC_PRIVATE_KEY_PATH;
  const inlineKey = process.env.ASC_PRIVATE_KEY; // convenient for CI secrets

  const missing = [];
  if (!keyId) missing.push("ASC_KEY_ID");
  if (!issuerId) missing.push("ASC_ISSUER_ID");
  if (!rawPath && !inlineKey) missing.push("ASC_KEY_PATH");

  if (missing.length) {
    console.error(`\nNot set: ${missing.join(", ")}`);
    console.error(CREDENTIAL_HELP);
    process.exit(1);
  }

  let keyPath = rawPath ? expandHome(rawPath) : undefined;
  let privateKey = inlineKey?.replace(/\\n/g, "\n");

  if (!privateKey && requireKeyFile) {
    if (!existsSync(keyPath)) {
      console.error(`\nASC_KEY_PATH does not exist: ${keyPath}`);
      console.error(CREDENTIAL_HELP);
      process.exit(1);
    }
    privateKey = readFileSync(keyPath, "utf8");
  }

  return { keyId, issuerId, keyPath, privateKey, teamId: process.env.ASC_TEAM_ID };
}

const b64url = (input) =>
  Buffer.from(input).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

/** ES256 JWT for the App Store Connect API — no external dependencies. */
export function createToken({ keyId, issuerId, privateKey }, ttlSeconds = 900) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "ES256", kid: keyId, typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      iss: issuerId,
      iat: now,
      exp: now + ttlSeconds,
      aud: "appstoreconnect-v1",
    }),
  );
  const signer = createSign("SHA256");
  signer.update(`${header}.${payload}`);
  const der = signer.sign(privateKey);
  // DER -> raw r||s, which is what JWS ES256 expects.
  let offset = 2;
  if (der[1] & 0x80) offset += der[1] & 0x7f;
  const readInt = () => {
    const len = der[offset + 1];
    let start = offset + 2;
    let end = start + len;
    while (der[start] === 0x00 && end - start > 32) start += 1;
    offset = end;
    const buf = Buffer.alloc(32);
    der.copy(buf, 32 - (end - start), start, end);
    return buf;
  };
  const r = readInt();
  const s = readInt();
  return `${header}.${payload}.${b64url(Buffer.concat([r, s]))}`;
}

export async function ascFetch(path, credentials, init = {}) {
  const token = createToken(credentials);
  const url = path.startsWith("http") ? path : `https://api.appstoreconnect.apple.com${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const detail = body?.errors?.map((e) => `${e.title}: ${e.detail}`).join("; ") || text;
    throw new Error(`App Store Connect ${response.status} on ${url} — ${detail}`);
  }
  return body;
}

export async function findApp(credentials, bundleId) {
  const { data } = await ascFetch(
    `/v1/apps?filter[bundleId]=${encodeURIComponent(bundleId)}&limit=1`,
    credentials,
  );
  return data?.[0] ?? null;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
