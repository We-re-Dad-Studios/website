"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TTSStatus = "idle" | "loading" | "playing" | "paused" | "error";

export function useElevenLabsTTS(chapterId: string) {
  const [status, setStatus] = useState<TTSStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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

  useEffect(() => {
    return () => cleanup();
  }, [chapterId, cleanup]);

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

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
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
    }
    setStatus("idle");
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const seek = useCallback((fraction: number) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = fraction * audioRef.current.duration;
    }
  }, []);

  const toggle = useCallback(() => {
    if (status === "playing") pause();
    else play();
  }, [status, play, pause]);

  return {
    status,
    progress,
    currentTime,
    duration,
    error,
    play,
    pause,
    stop,
    seek,
    toggle,
  };
}
