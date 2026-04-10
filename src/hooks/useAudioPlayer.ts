import { useState, useCallback, useRef } from "react";

/**
 * Audio player hook for UXP.
 * Uses Blob URLs — the <audio> HTML element in JSX handles playback.
 */
export function useAudioPlayer() {
  const [audioSize, setAudioSize] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  const loadAudio = useCallback((audioData: ArrayBuffer) => {
    // Clean up previous Blob URL
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
    }

    const blob = new Blob([audioData], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    prevUrlRef.current = url;

    setBlobUrl(url);
    setAudioSize(audioData.byteLength);
  }, []);

  const cleanup = useCallback(() => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    setBlobUrl(null);
    setAudioSize(0);
  }, []);

  return {
    audioSize,
    blobUrl,
    loadAudio,
    cleanup,
  };
}
