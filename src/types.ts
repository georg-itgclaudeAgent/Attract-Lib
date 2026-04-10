export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  preview_url: string | null;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  speed: number;
  use_speaker_boost: boolean;
}

export interface GenerateRequest {
  text: string;
  model_id: string;
  voice_settings: VoiceSettings;
}

export interface AppSettings {
  apiKey: string;
  outputDirectory: string;
  outputDirectoryToken: string;
  lastVoiceId: string;
  overrideEnabled: boolean;
  voiceSettings: VoiceSettings;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.0,
  speed: 1.0,
  use_speaker_boost: true,
};

export const DEFAULT_SETTINGS: AppSettings = {
  apiKey: "",
  outputDirectory: "",
  outputDirectoryToken: "",
  lastVoiceId: "",
  overrideEnabled: false,
  voiceSettings: { ...DEFAULT_VOICE_SETTINGS },
};
