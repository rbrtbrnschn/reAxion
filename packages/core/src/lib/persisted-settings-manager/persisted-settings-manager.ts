import { IColor, IDifficulty, ISettings } from '@reaxion/common';
import { PersistorStrategy } from '../persistor/strategies/strategy.interface';
import { SettingsManager } from '../settings-manager/settings-manager';

export class PersistedSettingsManagerDecorator extends SettingsManager {
  private persistor: PersistorStrategy;

  constructor(settingsManager: SettingsManager, persistor: PersistorStrategy) {
    super(settingsManager.getState());
    this.persistor = persistor;
  }

  setState(state: Partial<ISettings>) {
    super.setState(state);
    this.persistor.setItem('settings', this.getState());
  }

  setColoring(coloring: IColor): ISettings {
    const updatedSettings = super.setColoring(coloring);
    this.persistor.setItem('settings', updatedSettings);
    return updatedSettings;
  }

  setDifficulty(difficulty: IDifficulty): ISettings {
    const updatedSettings = super.setDifficulty(difficulty);
    this.persistor.setItem('settings', updatedSettings);
    return updatedSettings;
  }

  setUserId(userId: string): ISettings {
    const updatedSettings = super.setUserId(userId);
    this.persistor.setItem('settings', updatedSettings);
    return updatedSettings;
  }
}
