import { useState, useCallback } from "react";

/**
 * Simplified audio state hook for UXP (no HTMLAudioElement).
 * Tracks whether audio data exists and its size.
 * Playback preview is not available in UXP — user previews via timeline.
 */
export function useAudioPlayer() {
  const [audioSize, setAudioSize] = useState(0);

  const loadAudio = useCallback((audioData: ArrayBuffer) => {
    setAudioSize(audioData.byteLength);
  }, []);

  const cleanup = useCallback(() => {
    setAudioSize(0);
  }, []);

  return {
    audioSize,
    loadAudio,
    cleanup,
  };
}
