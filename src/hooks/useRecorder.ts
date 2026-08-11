import { useCallback, useEffect, useRef, useState } from "react";

type Recording = { blob: Blob; url: string; duration: number };

export function useRecorder() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<Recording | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => () => stopTimer(), []);

  const start = useCallback(async () => {
    setError(null);
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("This browser can't record audio.");
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Microphone access is needed to record.");
      return;
    }

    const mimeType = MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "audio/mp4";
    const recorder = new MediaRecorder(stream, { mimeType });
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const duration = (Date.now() - startedAtRef.current) / 1000;
      if (blob.size < 1024) {
        setError("That recording was empty — try again.");
        setResult(null);
      } else {
        setResult({ blob, url: URL.createObjectURL(blob), duration });
      }
    };

    recorderRef.current = recorder;
    startedAtRef.current = Date.now();
    setSeconds(0);
    setResult(null);
    recorder.start();
    setRecording(true);
    timerRef.current = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 250);
  }, []);

  const stop = useCallback(() => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    stopTimer();
    setRecording(false);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setSeconds(0);
    setError(null);
  }, []);

  return { recording, seconds, result, error, start, stop, reset };
}
