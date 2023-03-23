import { ISettings } from '@reaxion/common';
import { v4 as uuid } from 'uuid';
import { LocalStoragePersistorImpl } from '../persistor/strategies/local-storage.strategy';
import {
  Alternate2Coloring,
  MediumDifficulty,
  SettingsManager,
} from '../settings-manager';
import { PersistedSettingsManagerDecorator } from './persisted-settings-manager';

describe('persisted settings manager', () => {
  let persistedSettingsManager: PersistedSettingsManagerDecorator;
  const mockUserId = uuid();
  const mockDifficulty = new MediumDifficulty();
  const mockColoring = new Alternate2Coloring();
  beforeEach(() => {
    persistedSettingsManager = new PersistedSettingsManagerDecorator(
      new SettingsManager(),
      new LocalStoragePersistorImpl()
    );
    new LocalStoragePersistorImpl().removeItem('settings');
  });
  it('should set User Id', () => {
    expect(
      new LocalStoragePersistorImpl().getItem<ISettings>('settings')?.userId
    ).toBeUndefined();
    persistedSettingsManager.setUserId(mockUserId);
    const persistedSettings =
      new LocalStoragePersistorImpl().getItem<ISettings>('settings');
    expect(persistedSettings?.userId).toEqual(mockUserId);
  });

  it('should set Coloring', () => {
    expect(
      new LocalStoragePersistorImpl().getItem<ISettings>('settings')?.coloring
    ).toBeUndefined();
    persistedSettingsManager.setColoring(mockColoring);
    const persistedSettings =
      new LocalStoragePersistorImpl().getItem<ISettings>('settings');
    expect(persistedSettings?.coloring).toEqual(mockColoring);
  });

  it('should set Difficulty', () => {
    expect(
      new LocalStoragePersistorImpl().getItem<ISettings>('settings')?.difficulty
    ).toBeUndefined();
    persistedSettingsManager.setDifficulty(mockDifficulty);
    const persistedSettings =
      new LocalStoragePersistorImpl().getItem<ISettings>('settings');
    expect(persistedSettings?.difficulty).toEqual(mockDifficulty);
  });
});
