import { IColor, IDifficulty } from '@reaxion/common';
import { SettingsManager } from '../../settings-manager/settings-manager';

export class GameManagerMediator {
  constructor(protected settingsManager: SettingsManager) {}

  getDifficulty(): IDifficulty {
    return this.settingsManager.getDifficulty();
  }
  getUserId(): string {
    return this.settingsManager.getUserId();
  }
  getColoring(): IColor {
    return this.settingsManager.getColoring();
  }
}
