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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
      cleanupSpeech();
      playbackModeRef.current = null;
    };
  }, [cleanupAudio, cleanupSpeech]);

  // Reset when chapter changes
  useEffect(() => {
    cleanupAudio();
    cleanupSpeech();
    playbackModeRef.current = null;
    setStatus("idle");
    setProgress(0);
    setError(null);
  }, [chapterId, cleanupAudio, cleanupSpeech]);

  const ensureAudio = useCallback(async (): Promise<HTMLAudioElement> => {
    // Already loaded
    if (audioRef.current) {
      cleanupSpeech();
      playbackModeRef.current = "audio";
      return audioRef.current;
    }

    setStatus("loading");
    setError(null);

    const res = await fetch(`/api/tts/${chapterId}`);
    if (!res.ok) {
      const body = await res
        .json()
        .catch(() => ({ error: "Unknown error", code: undefined }));
      const err = new Error(body.error ?? `HTTP ${res.status}`) as TTSFetchError;
      err.code = body.code;
      throw err;
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
      playbackModeRef.current = null;
      setStatus("error");
      setError("Audio playback failed");
    });

    audioRef.current = audio;
    playbackModeRef.current = "audio";
    return audio;
  }, [chapterId, cleanupSpeech]);

  const play = useCallback(async () => {
    try {
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

      const audio = await ensureAudio();
      await audio.play();
      setStatus("playing");
      setError(null);
    } catch (err) {
      if (canUseBrowserSpeech()) {
        try {
          startBrowserSpeech();
          return;
        } catch {
          // fall through to error state
        }
      }

      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to play audio");
    }
  }, [canUseBrowserSpeech, ensureAudio, startBrowserSpeech]);

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
