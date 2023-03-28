import { v4 as uuid } from 'uuid';
import { Settings } from '../interfaces';
import { ConcretePersistorImpl } from '../persistor/persistor';
import { LocalStoragePersistorImpl } from '../persistor/strategies/local-storage.strategy';
import {
  Alternate2Coloring,
  DifficultyBuilder,
  SettingsManager,
} from '../settings-manager';
import { PersistedSettingsManagerDecorator } from './persisted-settings-manager';

describe('persisted settings manager', () => {
  let persistedSettingsManager: PersistedSettingsManagerDecorator;
  const mockUserId = uuid();
  const mockDifficulty = new DifficultyBuilder().buildBaseTimer();
  const mockColoring = new Alternate2Coloring();
  beforeEach(() => {
    const persistor = new ConcretePersistorImpl();
    persistor.setStrategy(new LocalStoragePersistorImpl());
    persistedSettingsManager = new PersistedSettingsManagerDecorator(
      new SettingsManager(),
      persistor
    );
    new LocalStoragePersistorImpl().removeItem('settings');
  });
  it('should set User Id', () => {
    expect(
      new LocalStoragePersistorImpl().getItem<Settings>('settings')?.userId
    ).toBeUndefined();
    persistedSettingsManager.setUserId(mockUserId);
    const persistedSettings = new LocalStoragePersistorImpl().getItem<Settings>(
      'settings'
    );
    expect(persistedSettings?.userId).toEqual(mockUserId);
  });

  it('should set Coloring', () => {
    expect(
      new LocalStoragePersistorImpl().getItem<Settings>('settings')?.coloring
    ).toBeUndefined();
    persistedSettingsManager.setColoring(mockColoring);
    const persistedSettings = new LocalStoragePersistorImpl().getItem<Settings>(
      'settings'
    );
    expect(persistedSettings?.coloring).toEqual(mockColoring);
  });

  it('should set Difficulty', () => {
    expect(
      new LocalStoragePersistorImpl().getItem<Settings>('settings')?.difficulty
    ).toBeUndefined();
    persistedSettingsManager.setDifficulty(mockDifficulty);
    const persistedSettings = new LocalStoragePersistorImpl().getItem<Settings>(
      'settings'
    );
    expect(persistedSettings?.difficulty).toEqual(mockDifficulty);
  });
});
