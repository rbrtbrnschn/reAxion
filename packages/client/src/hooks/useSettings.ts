import { ISettings } from '@reaxion/common';
import { defaultSettings } from '@reaxion/core';
import { useCookies } from 'react-cookie';
import { v4 as uuid4 } from 'uuid';

export const useSettings = (): [
  ISettings,
  (newSettings: ISettings) => void
] => {
  const [cookie] = useCookies(['userId']);
  const setSettings = (settings: ISettings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
  };
  // strategy to incorperate setting old cookies as userId
  const myDefaultSettings: ISettings = {
    ...defaultSettings,
    userId: cookie.userId || uuid4(),
  };

  const getSettingsString = () => localStorage.getItem('settings') || '';
  if (!getSettingsString()) {
    localStorage.setItem('settings', JSON.stringify(myDefaultSettings));
  }
  const parsedSettings: ISettings = JSON.parse(getSettingsString());

  const missingSettings = Object.entries(myDefaultSettings).reduce(
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
