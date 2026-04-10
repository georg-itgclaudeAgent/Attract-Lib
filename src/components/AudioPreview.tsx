import React from "react";

interface AudioPreviewProps {
  isPlaying: boolean;
  progress: number;
  duration: number;
  onTogglePlay: () => void;
  onAddToTimeline: () => void;
  onRegenerate: () => void;
  addingToTimeline: boolean;
}

export const AudioPreview: React.FC<AudioPreviewProps> = ({
  isPlaying,
  progress,
  duration,
  onTogglePlay,
  onAddToTimeline,
  onRegenerate,
  addingToTimeline,
}) => {
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="audio-preview">
      <div className="audio-player">
        <button className="btn-play" onClick={onTogglePlay}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="audio-time">
          {formatTime(progress * duration)} / {formatTime(duration)}
        </span>
      </div>

      <div className="audio-actions">
        <button
          className="btn-primary"
          onClick={onAddToTimeline}
          disabled={addingToTimeline}
        >
          {addingToTimeline ? "Adding..." : "Add to Timeline"}
        </button>
        <button className="btn-secondary" onClick={onRegenerate}>
          Re-generate
        </button>
      </div>
    </div>
  );
};
