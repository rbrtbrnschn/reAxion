import { v4 as uuid, validate } from 'uuid';
import { AlternateColoring, MediumDifficulty } from '../game-manager';
import { defaultSettings, SettingsManager } from './settings-manager';

describe('settingsManager', () => {
  let settingsManager: SettingsManager;
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
  });
});
