"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TTSStatus = "idle" | "loading" | "playing" | "paused" | "error";

export function useElevenLabsTTS(chapterId: string) {
  const [status, setStatus] = useState<TTSStatus>("idle");
  const [progress, setProgress] = useState(0); // 0-1
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  // Reset when chapter changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setStatus("idle");
    setProgress(0);
    setError(null);
  }, [chapterId]);

  const ensureAudio = useCallback(async (): Promise<HTMLAudioElement> => {
    // Already loaded
    if (audioRef.current) return audioRef.current;

    setStatus("loading");
    setError(null);

    const res = await fetch(`/api/tts/${chapterId}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(body.error ?? `HTTP ${res.status}`);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    blobUrlRef.current = url;

    const audio = new Audio(url);

    // Wire up events
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
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
      const audio = await ensureAudio();
      await audio.play();
      setStatus("playing");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to play audio");
    }
  }, [ensureAudio]);

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
    if (status === "playing") {
      pause();
    } else {
      play();
    }
  }, [status, play, pause]);

  return { status, progress, error, play, pause, stop, toggle };
}
