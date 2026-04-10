import React from "react";

interface AudioPreviewProps {
  audioSize: number;
  onAddToTimeline: () => void;
  onRegenerate: () => void;
  addingToTimeline: boolean;
}

export const AudioPreview: React.FC<AudioPreviewProps> = ({
  audioSize,
  onAddToTimeline,
  onRegenerate,
  addingToTimeline,
}) => {
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="audio-preview">
      <div className="audio-ready">
        <span className="audio-ready-icon">✓</span>
        <span>Audio generated ({formatSize(audioSize)})</span>
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
