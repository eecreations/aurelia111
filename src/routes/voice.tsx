import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AudioPlayer } from "@/components/audio-player";
import { BottomNav } from "@/components/bottom-nav";
import { Ornament, SilkBackdrop } from "@/components/silk";
import { useAuth } from "@/hooks/useAuth";
import { useRecorder } from "@/hooks/useRecorder";
import {
  useDeleteVoiceAffirmation,
  useTranscribeVoiceAffirmation,
  useUploadVoiceAffirmation,
  useVoiceAffirmations,
} from "@/lib/voice";

export const Route = createFileRoute("/voice")({
  head: () => ({
    meta: [
      { title: "Record Your Own Affirmations — Aurelia" },
      {
        name: "description",
        content:
          "Record affirmations in your own voice and hear them with your morning reminder.",
      },
      { property: "og:title", content: "Record Your Own Affirmations — Aurelia" },
      {
        property: "og:description",
        content:
          "Record affirmations in your own voice and hear them with your morning reminder.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VoicePage,
});

function formatDuration(total: number) {
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function VoicePage() {
  const { user, loading } = useAuth();
  const recorder = useRecorder();
  const { data: recordings } = useVoiceAffirmations(user?.id);
  const upload = useUploadVoiceAffirmation(user?.id);
  const remove = useDeleteVoiceAffirmation(user?.id);
  const transcribe = useTranscribeVoiceAffirmation(user?.id);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const visible = (recordings ?? []).filter((item) =>
    query
      ? `${item.title} ${item.transcript ?? ""}`.toLowerCase().includes(query)
      : true,
  );

  const save = () => {
    if (!recorder.result) return;
    upload.mutate(
      {
        blob: recorder.result.blob,
        title,
        duration: recorder.result.duration,
      },
      {
        onSuccess: (id) => {
          toast.success("Saved — transcribing your words.");
          setTitle("");
          recorder.reset();
          transcribe.mutate(id, {
            onSuccess: () => toast.success("Transcript ready."),
            onError: (error) => toast.error((error as Error).message),
          });
        },
        onError: (error) => toast.error((error as Error).message),
      },
    );
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-obsidian text-ivory">
      <SilkBackdrop />
      <main className="relative z-10 mx-auto w-full max-w-xl px-8 pb-36 pt-16">
        <div className="animate-silk text-center">
          <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-gold/80">
            In your own voice
          </span>
          <Ornament className="mt-4" />
          <h1 className="mt-6 font-display text-3xl italic">Your recordings</h1>
          <p className="mt-4 font-body-serif text-base italic leading-relaxed text-ivory/70">
            Speak your affirmations aloud. Your morning reminder will play the most
            recent one.
          </p>
        </div>

        {!loading && !user ? (
          <div className="mt-16 text-center">
            <p className="font-body-serif text-lg italic text-ivory/80">
              Sign in to record and save your affirmations.
            </p>
            <Link
              to="/auth"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-sm border border-gold/50 bg-gold/10 px-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/20"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <div className="mt-14 space-y-12">
            <section className="space-y-6 border-t border-gold/20 pt-8">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                New recording
              </h2>

              <div className="flex flex-col items-center gap-5 rounded-sm border border-gold/10 bg-ivory/5 p-8 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => (recorder.recording ? recorder.stop() : void recorder.start())}
                  aria-label={recorder.recording ? "Stop recording" : "Start recording"}
                  className={`flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border transition-all ${
                    recorder.recording
                      ? "animate-pulse border-gold bg-gold/30"
                      : "border-gold/50 bg-gold/10 hover:bg-gold/20"
                  }`}
                >
                  <span
                    className={
                      recorder.recording
                        ? "h-5 w-5 bg-gold"
                        : "h-6 w-6 rounded-full bg-gold"
                    }
                  />
                </button>
                <span className="font-body-serif text-lg italic text-ivory/80">
                  {recorder.recording
                    ? formatDuration(recorder.seconds)
                    : recorder.result
                      ? "Listen back below"
                      : "Tap to record"}
                </span>
                {recorder.error ? (
                  <p className="text-xs text-ivory/60">{recorder.error}</p>
                ) : null}
              </div>

              {recorder.result ? (
                <div className="space-y-4 rounded-sm border border-gold/10 bg-ivory/5 p-5 backdrop-blur-sm">
                  <AudioPlayer
                    src={recorder.result.url}
                    fallbackDuration={recorder.result.duration}
                    label="new recording"
                  />
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Name this affirmation"
                    className="w-full rounded-sm border border-gold/20 bg-transparent px-4 py-3 font-body-serif text-base italic text-ivory outline-none placeholder:text-ivory/40 focus:border-gold/50"
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={save}
                      disabled={upload.isPending}
                      className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-sm border border-gold/50 bg-gold/10 px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/20 disabled:opacity-50"
                    >
                      {upload.isPending ? "Saving" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={recorder.reset}
                      className="inline-flex h-11 cursor-pointer items-center justify-center rounded-sm border border-gold/20 px-6 text-[10px] uppercase tracking-[0.18em] text-ivory/70 transition-colors hover:bg-ivory/5"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              ) : null}
            </section>

            <section className="space-y-5 border-t border-gold/20 pt-8">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                Saved affirmations
              </h2>
              {(recordings ?? []).length > 0 ? (
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by words you spoke"
                  aria-label="Search your recordings"
                  className="w-full rounded-sm border border-gold/20 bg-transparent px-4 py-3 font-body-serif text-base italic text-ivory outline-none placeholder:text-ivory/40 focus:border-gold/50"
                />
              ) : null}
              {visible.length === 0 ? (
                <p className="font-body-serif text-base italic text-ivory/60">
                  {(recordings ?? []).length === 0
                    ? "Nothing recorded yet."
                    : "No recording matches those words."}
                </p>
              ) : (
                <ul className="space-y-4">
                  {visible.map((item) => (
                    <li
                      key={item.id}
                      className="space-y-3 rounded-sm border border-gold/10 bg-ivory/5 p-5 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-body-serif text-lg italic text-ivory/90">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-gold/70">
                            {formatDuration(item.duration_seconds)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            remove.mutate(
                              { id: item.id, storage_path: item.storage_path },
                              { onSuccess: () => toast.success("Recording removed.") },
                            )
                          }
                          className="cursor-pointer text-[10px] uppercase tracking-[0.18em] text-ivory/50 transition-colors hover:text-gold"
                        >
                          Delete
                        </button>
                      </div>
                      {item.url ? (
                        <AudioPlayer
                          src={item.url}
                          fallbackDuration={item.duration_seconds}
                          label={item.title}
                        />
                      ) : null}
                      {item.transcript ? (
                        <p className="font-body-serif text-base italic leading-relaxed text-ivory/70">
                          &ldquo;{item.transcript}&rdquo;
                        </p>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] uppercase tracking-[0.18em] text-ivory/40">
                            {transcribe.isPending && transcribe.variables === item.id
                              ? "Transcribing"
                              : item.transcript_status === "failed"
                                ? "Transcript unavailable"
                                : "No transcript yet"}
                          </span>
                          <button
                            type="button"
                            disabled={transcribe.isPending}
                            onClick={() =>
                              transcribe.mutate(item.id, {
                                onSuccess: () => toast.success("Transcript ready."),
                                onError: (error) => toast.error((error as Error).message),
                              })
                            }
                            className="cursor-pointer text-[10px] uppercase tracking-[0.18em] text-gold transition-colors hover:text-ivory disabled:opacity-40"
                          >
                            Transcribe
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs leading-relaxed text-ivory/50">
                Your newest recording plays with your daily reminder — set the time on
                the Ritual page.
              </p>
            </section>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
