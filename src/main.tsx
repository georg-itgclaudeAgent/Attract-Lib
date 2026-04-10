import React, { useState } from "react";
import { useSettings } from "./hooks/useSettings";
import { Settings } from "./components/Settings";
import { MainPanel } from "./components/MainPanel";

export const App = () => {
  const { settings, updateSettings, isConfigured } = useSettings();
  const [showSettings, setShowSettings] = useState(!isConfigured);

  if (showSettings || !isConfigured) {
    return (
      <Settings
        settings={settings}
        onUpdate={updateSettings}
        onBack={() => setShowSettings(false)}
      />
    );
  }

  return (
    <MainPanel
      settings={settings}
      onUpdate={updateSettings}
      onOpenSettings={() => setShowSettings(true)}
    />
  );
};
