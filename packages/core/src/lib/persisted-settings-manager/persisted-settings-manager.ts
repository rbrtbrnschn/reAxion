import { Coloring, Settings } from '../interfaces';
import { Persistor } from '../persistor/persistor';
import { DifficultyStrategy } from '../settings-manager/modules/difficulty/difficulty';
import { SettingsManager } from '../settings-manager/settings-manager';

export class PersistedSettingsManagerDecorator extends SettingsManager {
  private persistor: Persistor;

  constructor(settingsManager: SettingsManager, persistor: Persistor) {
    super(settingsManager.getState());
    this.persistor = persistor;
    this.setState(settingsManager.getState());
  }

  setState(state: Partial<Settings>) {
    super.setState(state);

    if (!this.persistor.hasStrategy()) throw new PersistorHasNoStrategyError();
    this.persistor.setItem('settings', this.getState());
  }

  setColoring(coloring: Coloring): Settings {
    const updatedSettings = super.setColoring(coloring);

    if (!this.persistor.hasStrategy()) throw new PersistorHasNoStrategyError();
    this.persistor.setItem('settings', updatedSettings);
    return updatedSettings;
  }

  setDifficulty(difficulty: DifficultyStrategy): Settings {
    const updatedSettings = super.setDifficulty(difficulty);

    if (!this.persistor.hasStrategy()) throw new PersistorHasNoStrategyError();
    this.persistor.setItem('settings', updatedSettings);
    return updatedSettings;
  }

  setUserId(userId: string): Settings {
    const updatedSettings = super.setUserId(userId);

    if (!this.persistor.hasStrategy()) throw new PersistorHasNoStrategyError();
    this.persistor.setItem('settings', updatedSettings);
    return updatedSettings;
  }
}
class PersistorHasNoStrategyError extends Error {
  constructor() {
    super('Persistor Has No Strategy.');
  }
}
