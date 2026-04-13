"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TTSStatus = "idle" | "loading" | "playing" | "paused" | "error";
type PlaybackMode = "audio" | "speech" | null;

type TTSFetchError = Error & {
  code?: string;
};

export function useElevenLabsTTS(chapterId: string, text: string) {
  const [status, setStatus] = useState<TTSStatus>("idle");
  const [progress, setProgress] = useState(0); // 0-1
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const playbackModeRef = useRef<PlaybackMode>(null);
  // Deduplicates concurrent loadAudio calls; a new promise is set on each load.
  const loadPromiseRef = useRef<Promise<HTMLAudioElement> | null>(null);
  // Aborts the in-flight fetch when the chapter changes or the component unmounts.
  const abortControllerRef = useRef<AbortController | null>(null);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  const cleanupSpeech = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      utteranceRef.current = null;
      return;
    }

    window.speechSynthesis.cancel();
    utteranceRef.current = null;
  }, []);

  const canUseBrowserSpeech = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      typeof SpeechSynthesisUtterance !== "undefined" &&
      text.trim().length > 0
    );
  }, [text]);

  const startBrowserSpeech = useCallback(() => {
    if (!canUseBrowserSpeech()) {
      throw new Error("Text-to-speech is unavailable on this device");
    }

    cleanupAudio();

    if (
      playbackModeRef.current === "speech" &&
      window.speechSynthesis.paused
    ) {
      window.speechSynthesis.resume();
      setStatus("playing");
      setError(null);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    playbackModeRef.current = "speech";

    utterance.onend = () => {
      playbackModeRef.current = null;
      utteranceRef.current = null;
      setStatus("idle");
      setProgress(1);
    };

    utterance.onerror = () => {
      playbackModeRef.current = null;
      utteranceRef.current = null;
      setStatus("error");
      setError("Browser text-to-speech failed");
    };

    setProgress(0);
    setStatus("playing");
    setError(null);
    window.speechSynthesis.speak(utterance);
  }, [canUseBrowserSpeech, cleanupAudio, text]);

  // Core loader — no status side-effects so it can be called silently on mount.
  // Deduplicates: if a load is already in-flight, returns the same promise.
  const loadAudio = useCallback(async (): Promise<HTMLAudioElement> => {
    if (audioRef.current) return audioRef.current;
    if (loadPromiseRef.current) return loadPromiseRef.current;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const promise = (async () => {
      const res = await fetch(`/api/tts/${chapterId}`, {
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res
          .json()
          .catch(() => ({ error: "Unknown error", code: undefined }));
        const err = new Error(
          body.error ?? `HTTP ${res.status}`
        ) as TTSFetchError;
        err.code = body.code;
        throw err;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      const audio = new Audio(url);

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
        playbackModeRef.current = null;
        setStatus("error");
        setError("Audio playback failed");
      });

      audioRef.current = audio;
      return audio;
    })().finally(() => {
      loadPromiseRef.current = null;
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    });

    loadPromiseRef.current = promise;
    return promise;
  }, [chapterId]);

  // Pre-fetch audio as soon as the chapter is known. Errors are surfaced only
  // when the user tries to play, not as an upfront error state.
  useEffect(() => {
    loadAudio().catch(() => {});
  }, [loadAudio]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      loadPromiseRef.current = null;
      cleanupAudio();
      cleanupSpeech();
      playbackModeRef.current = null;
    };
  }, [cleanupAudio, cleanupSpeech]);

  // Reset when chapter changes — abort any in-flight fetch for the old chapter.
  useEffect(() => {
    abortControllerRef.current?.abort();
    loadPromiseRef.current = null;
    cleanupAudio();
    cleanupSpeech();
    playbackModeRef.current = null;
    setStatus("idle");
    setProgress(0);
    setError(null);
  }, [chapterId, cleanupAudio, cleanupSpeech]);

  const play = useCallback(async () => {
    // Resume paused speech synthesis if that's the active mode.
    if (
      playbackModeRef.current === "speech" &&
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      window.speechSynthesis.paused
    ) {
      window.speechSynthesis.resume();
      setStatus("playing");
      setError(null);
      return;
    }

    // --- Phase 1: ensure audio is loaded ---
    // If the pre-fetch is still in-flight this awaits it rather than starting
    // a second request. If already loaded, resolves immediately.
    let audio: HTMLAudioElement;
    try {
      setStatus("loading");
      setError(null);
      audio = await loadAudio();
    } catch (err) {
      // Audio fetch failed — fall back to browser speech synthesis as a last resort.
      if (canUseBrowserSpeech()) {
        try {
          startBrowserSpeech();
          return;
        } catch {
          // fall through to error state
        }
      }
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to load audio");
      return;
    }

    // --- Phase 2: play the loaded audio ---
    // Do NOT fall back to browser speech here. If play() fails (e.g. autoplay
    // policy), we already have the ElevenLabs audio buffered — show an error so
    // the user can tap/click again rather than silently switching to the robotic
    // browser voice.
    cleanupSpeech();
    playbackModeRef.current = "audio";
    try {
      await audio.play();
      setStatus("playing");
      setError(null);
    } catch {
      setStatus("error");
      setError("Playback was blocked. Please try again.");
    }
  }, [canUseBrowserSpeech, cleanupSpeech, loadAudio, startBrowserSpeech]);

  const pause = useCallback(() => {
    if (playbackModeRef.current === "speech") {
      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        window.speechSynthesis.speaking &&
        !window.speechSynthesis.paused
      ) {
        window.speechSynthesis.pause();
        setStatus("paused");
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      setStatus("paused");
    }
  }, []);

  const stop = useCallback(() => {
    if (playbackModeRef.current === "speech") {
      cleanupSpeech();
      playbackModeRef.current = null;
      setStatus("idle");
      setProgress(0);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setStatus("idle");
      setProgress(0);
    }
    playbackModeRef.current = null;
  }, [cleanupSpeech]);

  const toggle = useCallback(() => {
    if (status === "playing") {
      pause();
    } else {
      play();
    }
  }, [status, play, pause]);

  return { status, progress, error, play, pause, stop, toggle };
}
