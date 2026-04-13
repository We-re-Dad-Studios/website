"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TTSStatus = "idle" | "loading" | "playing" | "paused" | "error";

export function useElevenLabsTTS(chapterId: string) {
  const [status, setStatus] = useState<TTSStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cleanup = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  // Reset on chapter change or unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [chapterId, cleanup]);

  // Pre-fetch audio as soon as the chapter loads so it's ready on play
  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    fetch(`/api/tts/${chapterId}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) return;
        return res.blob();
      })
      .then((blob) => {
        if (!blob || controller.signal.aborted) return;
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;

        const audio = new Audio(url);
        audio.addEventListener("timeupdate", () => {
          if (audio.duration) setProgress(audio.currentTime / audio.duration);
        });
        audio.addEventListener("ended", () => {
          setStatus("idle");
          setProgress(1);
        });
        audio.addEventListener("error", () => {
          setStatus("error");
          setError("Audio playback failed");
        });
        audioRef.current = audio;
      })
      .catch(() => {});

    return () => controller.abort();
  }, [chapterId]);

  const loadAudio = useCallback(async (): Promise<HTMLAudioElement> => {
    if (audioRef.current) return audioRef.current;

    const controller = new AbortController();
    abortRef.current = controller;

    const res = await fetch(`/api/tts/${chapterId}`, {
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(body.error ?? `HTTP ${res.status}`);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    blobUrlRef.current = url;

    const audio = new Audio(url);

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    });
    audio.addEventListener("ended", () => {
      setStatus("idle");
      setProgress(1);
    });
    audio.addEventListener("error", () => {
      setStatus("error");
      setError("Audio playback failed");
    });

    audioRef.current = audio;
    return audio;
  }, [chapterId]);

  const play = useCallback(async () => {
    try {
      setStatus("loading");
      setError(null);
      const audio = await loadAudio();
      await audio.play();
      setStatus("playing");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to play audio");
    }
  }, [loadAudio]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setStatus("paused");
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setStatus("idle");
      setProgress(0);
    }
  }, []);

  const toggle = useCallback(() => {
    if (status === "playing") pause();
    else play();
  }, [status, play, pause]);

  return { status, progress, error, play, pause, stop, toggle };
}
