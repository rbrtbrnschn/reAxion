import { ISettings } from '@reaxion/common';
import { DefaultColoring, EasyDifficulty } from '@reaxion/core';

export const useSettings = () => {
  const setSettings = (settings: ISettings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
  };
  // get from SST
  const defaultSettings: ISettings = {
    difficulty: new EasyDifficulty(),
    coloring: new DefaultColoring(),
  };

  const getSettingsString = () => localStorage.getItem('settings') || '';
  if (!getSettingsString()) {
    localStorage.setItem('settings', JSON.stringify(defaultSettings));
  }
  const parsedSettings = JSON.parse(getSettingsString());
  if (!(parsedSettings as ISettings).coloring)
    setSettings({ ...parsedSettings, coloring: defaultSettings.coloring });

  return [parsedSettings, setSettings];
};
