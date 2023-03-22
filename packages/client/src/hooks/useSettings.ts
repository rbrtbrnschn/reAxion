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

  const missingSettings = Object.entries(defaultSettings).reduce(
    (acc, [key, value]) => {
      if (!(parsedSettings as Partial<ISettings>)[key as keyof ISettings]) {
        return {
          ...acc,
          [key]: value,
        };
      }
      return acc;
    },
    {} as Partial<ISettings>
  );

  if (missingSettings) setSettings({ ...parsedSettings, ...missingSettings });

  return [parsedSettings, setSettings];
};
