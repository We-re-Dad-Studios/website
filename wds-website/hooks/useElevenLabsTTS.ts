"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TTSStatus = "idle" | "playing" | "paused";

/**
 * Simple audio player hook. Pass the URL of a pre-generated audio file
 * (e.g. a Contentful asset). If no URL is provided the hook is inert.
 */
export function useAudioPlayer(audioUrl: string | undefined) {
  const [status, setStatus] = useState<TTSStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create / swap audio element when URL changes
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);

    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    });
    audio.addEventListener("ended", () => {
      setStatus("idle");
      setProgress(1);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audioRef.current = null;
    };
  }, [audioUrl]);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    await audioRef.current.play();
    setStatus("playing");
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setStatus("paused");
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
    hasAudio: !!audioUrl,
    play,
    pause,
    stop,
    seek,
    toggle,
  };
}
