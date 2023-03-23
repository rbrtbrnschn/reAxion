import { IColor, IDifficulty, ISettings } from '@reaxion/common';
import { Persistor } from '../persistor/persistor';
import { SettingsManager } from '../settings-manager/settings-manager';

export class PersistedSettingsManagerDecorator extends SettingsManager {
  private persistor: Persistor;

  constructor(settingsManager: SettingsManager, persistor: Persistor) {
    super(settingsManager.getState());
    this.persistor = persistor;
  }

  setState(state: Partial<ISettings>) {
    super.setState(state);

    if (!this.persistor.hasStrategy()) throw new PersistorHasNoStrategyError();
    this.persistor.setItem('settings', this.getState());
  }

  setColoring(coloring: IColor): ISettings {
    const updatedSettings = super.setColoring(coloring);

    if (!this.persistor.hasStrategy()) throw new PersistorHasNoStrategyError();
    this.persistor.setItem('settings', updatedSettings);
    return updatedSettings;
  }

  setDifficulty(difficulty: IDifficulty): ISettings {
    const updatedSettings = super.setDifficulty(difficulty);

    if (!this.persistor.hasStrategy()) throw new PersistorHasNoStrategyError();
    this.persistor.setItem('settings', updatedSettings);
    return updatedSettings;
  }

  setUserId(userId: string): ISettings {
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
