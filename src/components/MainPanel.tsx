import React, { useState, useEffect, useCallback } from "react";
import { AppSettings, Voice, DEFAULT_VOICE_SETTINGS } from "../types";
import { listClonedVoices, generateSpeech } from "../api/elevenlabs";
import { saveAudioFile, importAndInsertAtPlayhead, previewAudioInPremiere } from "../utils/premiere";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { VoiceSelector } from "./VoiceSelector";
import { VoiceSettings } from "./VoiceSettings";
import { TextInput } from "./TextInput";
import { AudioPreview } from "./AudioPreview";

interface MainPanelProps {
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => void;
  onOpenSettings: () => void;
}

export const MainPanel: React.FC<MainPanelProps> = ({
  settings,
  onUpdate,
  onOpenSettings,
}) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [text, setText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [audioData, setAudioData] = useState<ArrayBuffer | null>(null);
  const [addingToTimeline, setAddingToTimeline] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { audioSize, loadAudio, cleanup } = useAudioPlayer();

  useEffect(() => {
    const fetchVoices = async () => {
      setVoicesLoading(true);
      try {
        const v = await listClonedVoices(settings.apiKey);
        setVoices(v);
        if (v.length > 0 && !settings.lastVoiceId) {
          onUpdate({ lastVoiceId: v[0].voice_id });
        }
      } catch (err: any) {
        setError(`Failed to load voices: ${err.message}`);
      }
      setVoicesLoading(false);
    };
    fetchVoices();
  }, [settings.apiKey]);

  const handleGenerate = useCallback(async () => {
    if (!text.trim() || !settings.lastVoiceId) return;

    setGenerating(true);
    setError(null);
    cleanup();
    setAudioData(null);

    try {
      const voiceSettings = settings.overrideEnabled
        ? settings.voiceSettings
        : DEFAULT_VOICE_SETTINGS;

      const audio = await generateSpeech(
        settings.apiKey,
        settings.lastVoiceId,
        text.trim(),
        voiceSettings
      );

      setAudioData(audio);
      loadAudio(audio);
    } catch (err: any) {
      setError(err.message || "Failed to generate speech.");
    }
    setGenerating(false);
  }, [text, settings, cleanup, loadAudio]);

  const handleAddToTimeline = useCallback(async () => {
    if (!audioData) return;

    if (!settings.outputDirectoryToken) {
      setError("No output directory set. Please configure in Settings.");
      return;
    }

    setAddingToTimeline(true);
    setError(null);

    try {
      const filePath = await saveAudioFile(audioData, settings.outputDirectoryToken);
      await importAndInsertAtPlayhead(filePath);
      cleanup();
      setAudioData(null);
    } catch (err: any) {
      setError(err.message || "Failed to add audio to timeline.");
    }
    setAddingToTimeline(false);
  }, [audioData, settings.outputDirectoryToken, cleanup]);

  const handlePreview = useCallback(async () => {
    if (!audioData) return;
    setPreviewing(true);
    setError(null);
    try {
      await previewAudioInPremiere(audioData);
    } catch (err: any) {
      setError(err.message || "Failed to preview audio.");
    }
    setPreviewing(false);
  }, [audioData]);

  const handleRegenerate = useCallback(() => {
    cleanup();
    setAudioData(null);
    handleGenerate();
  }, [cleanup, handleGenerate]);

  return (
    <div className="main-panel">
      <div className="panel-header">
        <h2>Attract Lib</h2>
        <button className="btn-icon" onClick={onOpenSettings} title="Settings">
          ⚙
        </button>
      </div>

      <VoiceSelector
        voices={voices}
        selectedVoiceId={settings.lastVoiceId}
        onSelect={(id) => onUpdate({ lastVoiceId: id })}
        loading={voicesLoading}
      />

      <VoiceSettings
        enabled={settings.overrideEnabled}
        onToggle={(enabled) => onUpdate({ overrideEnabled: enabled })}
        settings={settings.voiceSettings}
        onChange={(voiceSettings) => onUpdate({ voiceSettings })}
      />

      <TextInput text={text} onChange={setText} />

      <button
        className="btn-primary btn-generate"
        onClick={handleGenerate}
        disabled={generating || !text.trim() || !settings.lastVoiceId}
      >
        {generating ? "Generating..." : "Generate"}
      </button>

      {audioData && (
        <AudioPreview
          audioSize={audioSize}
          onPreview={handlePreview}
          onAddToTimeline={handleAddToTimeline}
          onRegenerate={handleRegenerate}
          previewing={previewing}
          addingToTimeline={addingToTimeline}
        />
      )}

      {error && <div className="error-banner">{error}</div>}
    </div>
  );
};
