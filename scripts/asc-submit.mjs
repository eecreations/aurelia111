/**
 * App Store Connect submission helpers: TestFlight distribution and
 * App Store version creation / release scheduling / review submission.
 *
 * Used by scripts/ios-ship.mjs once a build has finished processing.
 */
import { ascFetch } from "./asc-api.mjs";

const PLATFORM = "IOS";

/** Apple requires an export-compliance answer before a build can be distributed. */
export async function ensureEncryptionDeclaration(credentials, build) {
  if (build.attributes?.usesNonExemptEncryption !== null) return;
  console.log("  Answering export compliance (uses non-exempt encryption: no)");
  await ascFetch(`/v1/builds/${build.id}`, credentials, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "builds",
        id: build.id,
        attributes: { usesNonExemptEncryption: false },
      },
    }),
  });
}

async function listBetaGroups(credentials, appId) {
  const { data } = await ascFetch(`/v1/apps/${appId}/betaGroups?limit=200`, credentials);
  return data ?? [];
}

/**
 * Adds the build to beta groups and, when any of them is external,
 * submits it for Beta App Review.
 *
 * @param names group names; empty means every internal group.
 */
export async function submitToTestFlight(credentials, { app, build, names, whatToTest }) {
  await ensureEncryptionDeclaration(credentials, build);

  const groups = await listBetaGroups(credentials, app.id);
  if (!groups.length) {
    console.log(
      "  No TestFlight beta groups exist yet — create one in App Store Connect -> TestFlight, then re-run with --testflight.",
    );
    return;
  }

  const wanted = names.length
    ? groups.filter((g) => names.some((n) => n.toLowerCase() === g.attributes.name.toLowerCase()))
    : groups.filter((g) => g.attributes.isInternalGroup);

  if (!wanted.length) {
    const available = groups.map((g) => g.attributes.name).join(", ");
    throw new Error(
      `None of the requested beta groups exist (${names.join(", ")}). Available: ${available}`,
    );
  }

  if (whatToTest) {
    const { data: localizations } = await ascFetch(
      `/v1/builds/${build.id}/betaBuildLocalizations?limit=50`,
      credentials,
    );
    const existing = localizations?.find((l) => l.attributes.locale === "en-US") ?? localizations?.[0];
    if (existing) {
      await ascFetch(`/v1/betaBuildLocalizations/${existing.id}`, credentials, {
        method: "PATCH",
        body: JSON.stringify({
          data: {
            type: "betaBuildLocalizations",
            id: existing.id,
            attributes: { whatsNew: whatToTest },
          },
        }),
      });
    } else {
      await ascFetch(`/v1/betaBuildLocalizations`, credentials, {
        method: "POST",
        body: JSON.stringify({
          data: {
            type: "betaBuildLocalizations",
            attributes: { locale: "en-US", whatsNew: whatToTest },
            relationships: { build: { data: { type: "builds", id: build.id } } },
          },
        }),
      });
    }
    console.log('  Set TestFlight "What to Test" notes');
  }

  await ascFetch(`/v1/builds/${build.id}/relationships/betaGroups`, credentials, {
    method: "POST",
    body: JSON.stringify({
      data: wanted.map((g) => ({ type: "betaGroups", id: g.id })),
    }),
  });
  console.log(`  Added to beta groups: ${wanted.map((g) => g.attributes.name).join(", ")}`);

  if (wanted.some((g) => !g.attributes.isInternalGroup)) {
    try {
      await ascFetch(`/v1/betaAppReviewSubmissions`, credentials, {
        method: "POST",
        body: JSON.stringify({
          data: {
            type: "betaAppReviewSubmissions",
            relationships: { build: { data: { type: "builds", id: build.id } } },
          },
        }),
      });
      console.log("  Submitted for Beta App Review (external testers)");
    } catch (error) {
      if (/already/i.test(error.message)) {
        console.log("  Beta App Review submission already exists");
      } else {
        throw error;
      }
    }
  }
}

async function findEditableVersion(credentials, appId, versionString) {
  const { data } = await ascFetch(
    `/v1/apps/${appId}/appStoreVersions?filter[platform]=${PLATFORM}&limit=20`,
    credentials,
  );
  return (data ?? []).find((v) => v.attributes.versionString === versionString) ?? null;
}

const EDITABLE_STATES = new Set([
  "PREPARE_FOR_SUBMISSION",
  "DEVELOPER_REJECTED",
  "REJECTED",
  "METADATA_REJECTED",
  "INVALID_BINARY",
]);

/**
 * Ensures an editable App Store version exists for `versionString`, attaches the
 * build, applies the release strategy, and submits it for review.
 *
 * release: { type: "AFTER_APPROVAL" | "MANUAL" | "SCHEDULED", date?: ISO string, phased?: boolean }
 */
export async function submitToAppStore(credentials, { app, build, versionString, release }) {
  await ensureEncryptionDeclaration(credentials, build);

  const attributes = {
    releaseType: release.type,
    ...(release.type === "SCHEDULED" ? { earliestReleaseDate: release.date } : {}),
  };

  let version = await findEditableVersion(credentials, app.id, versionString);
  if (version && !EDITABLE_STATES.has(version.attributes.appStoreState)) {
    throw new Error(
      `App Store version ${versionString} is in state ${version.attributes.appStoreState} and cannot be edited. Ship a new marketing version with --version.`,
    );
  }

  if (version) {
    console.log(`  Reusing App Store version ${versionString} (${version.attributes.appStoreState})`);
    await ascFetch(`/v1/appStoreVersions/${version.id}`, credentials, {
      method: "PATCH",
      body: JSON.stringify({ data: { type: "appStoreVersions", id: version.id, attributes } }),
    });
  } else {
    console.log(`  Creating App Store version ${versionString}`);
    const created = await ascFetch(`/v1/appStoreVersions`, credentials, {
      method: "POST",
      body: JSON.stringify({
        data: {
          type: "appStoreVersions",
          attributes: { platform: PLATFORM, versionString, ...attributes },
          relationships: { app: { data: { type: "apps", id: app.id } } },
        },
      }),
    });
    version = created.data;
  }

  await ascFetch(`/v1/appStoreVersions/${version.id}/relationships/build`, credentials, {
    method: "PATCH",
    body: JSON.stringify({ data: { type: "builds", id: build.id } }),
  });
  console.log(`  Attached build ${build.attributes.version} to ${versionString}`);

  if (release.phased) {
    try {
      await ascFetch(`/v1/appStoreVersionPhasedReleases`, credentials, {
        method: "POST",
        body: JSON.stringify({
          data: {
            type: "appStoreVersionPhasedReleases",
            attributes: { phasedReleaseState: "INACTIVE" },
            relationships: {
              appStoreVersion: { data: { type: "appStoreVersions", id: version.id } },
            },
          },
        }),
      });
      console.log("  Enabled phased release");
    } catch (error) {
      if (/already|exists/i.test(error.message)) console.log("  Phased release already enabled");
      else throw error;
    }
  }

  if (release.type === "SCHEDULED") {
    console.log(`  Release scheduled for ${release.date}`);
  } else if (release.type === "MANUAL") {
    console.log("  Release set to manual (you press Release after approval)");
  } else {
    console.log("  Release set to automatic after approval");
  }

  // Review submission: create -> add the version as an item -> submit.
  const { data: openSubmissions } = await ascFetch(
    `/v1/reviewSubmissions?filter[app]=${app.id}&filter[state]=READY_FOR_REVIEW,UNRESOLVED_ISSUES&limit=10`,
    credentials,
  ).catch(() => ({ data: [] }));

  let submission = openSubmissions?.[0];
  if (!submission) {
    const created = await ascFetch(`/v1/reviewSubmissions`, credentials, {
      method: "POST",
      body: JSON.stringify({
        data: {
          type: "reviewSubmissions",
          attributes: { platform: PLATFORM },
          relationships: { app: { data: { type: "apps", id: app.id } } },
        },
      }),
    });
    submission = created.data;
  }

  try {
    await ascFetch(`/v1/reviewSubmissionItems`, credentials, {
      method: "POST",
      body: JSON.stringify({
        data: {
          type: "reviewSubmissionItems",
          relationships: {
            reviewSubmission: { data: { type: "reviewSubmissions", id: submission.id } },
            appStoreVersion: { data: { type: "appStoreVersions", id: version.id } },
          },
        },
      }),
    });
  } catch (error) {
    if (!/already|exists/i.test(error.message)) throw error;
  }

  await ascFetch(`/v1/reviewSubmissions/${submission.id}`, credentials, {
    method: "PATCH",
    body: JSON.stringify({
      data: { type: "reviewSubmissions", id: submission.id, attributes: { submitted: true } },
    }),
  });
  console.log("  Submitted for App Store review");
}

/** Parses --release-date input into an ISO instant Apple accepts. */
export function parseReleaseDate(input) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `--release-date could not be parsed: "${input}". Use e.g. 2026-09-01 or 2026-09-01T10:00:00Z.`,
    );
  }
  if (date.getTime() < Date.now()) {
    throw new Error(`--release-date is in the past: ${date.toISOString()}`);
  }
  // Apple expects second precision without milliseconds.
  return `${date.toISOString().split(".")[0]}Z`;
}
