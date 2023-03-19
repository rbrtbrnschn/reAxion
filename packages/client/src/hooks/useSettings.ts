import { ISettings } from '@reaxion/common';
import { EasyDifficulty } from '@reaxion/core';

export const useSettings = () => {
  // get from SST
  const defaultSettings: ISettings = {
    difficulty: new EasyDifficulty(),
  };

  const getSettingsString = () => localStorage.getItem('settings') || '';
  if (!getSettingsString()) {
    localStorage.setItem('settings', JSON.stringify(defaultSettings));
  }
  const parsedSettings = JSON.parse(getSettingsString());

  const setSettings = (settings: ISettings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
  };

  return [parsedSettings, setSettings];
};
