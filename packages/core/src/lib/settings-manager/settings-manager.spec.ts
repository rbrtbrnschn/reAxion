import { v4 as uuid, validate } from 'uuid';
import { DefaultSettingsHandlerImpl } from './default-settings-handler';
import { AlternateColoring } from './modules/coloring';
import { MediumDifficulty } from './modules/difficulty';
import { SettingsManager } from './settings-manager';

describe('settingsManager', () => {
  let settingsManager: SettingsManager;
  const defaultSettings = DefaultSettingsHandlerImpl.defaultSettings;
  beforeEach(() => {
    settingsManager = new SettingsManager();
  });
  it('getters & setters should work', () => {
    expect(settingsManager.getColoring()).toEqual(defaultSettings.coloring);
    expect(settingsManager.getDifficulty()).toEqual(defaultSettings.difficulty);
    expect(
      validate(settingsManager.getUserId()) &&
        settingsManager.getUserId().length === 36
    ).toEqual(true);

    settingsManager.setColoring(new AlternateColoring());
    expect(settingsManager.getColoring()).toEqual(new AlternateColoring());
    settingsManager.setDifficulty(new MediumDifficulty());
    expect(settingsManager.getDifficulty()).toEqual(new MediumDifficulty());
    settingsManager.setUserId(uuid());
    expect(
      validate(settingsManager.getUserId()) &&
        settingsManager.getUserId().length === 36
    ).toEqual(true);
    const shouldThrow = () => settingsManager.setUserId('bad');
    expect(shouldThrow).toThrowError();

    settingsManager.setUsername('abc');
    expect(settingsManager.setUsername('abc'));
    const shouldThrow2 = () => settingsManager.setUsername('asdasda');
    expect(shouldThrow2).toThrowError();
  });
});
