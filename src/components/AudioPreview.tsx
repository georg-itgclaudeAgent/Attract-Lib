import React from "react";

interface AudioPreviewProps {
  audioSize: number;
  onPreview: () => void;
  onAddToTimeline: () => void;
  onRegenerate: () => void;
  previewing: boolean;
  addingToTimeline: boolean;
}

export const AudioPreview: React.FC<AudioPreviewProps> = ({
  audioSize,
  onPreview,
  onAddToTimeline,
  onRegenerate,
  previewing,
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

      <button
        className="btn-secondary"
        onClick={onPreview}
        disabled={previewing}
        style={{ width: "100%" }}
      >
        {previewing ? "Importing..." : "▶ Preview in Premiere"}
      </button>

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
