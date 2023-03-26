import { Coloring } from '../../interfaces';
import { DifficultyStrategy } from '../../settings-manager/modules/difficulty/difficulty';
import { SettingsManager } from '../../settings-manager/settings-manager';

export class GameManagerMediator {
  constructor(protected settingsManager: SettingsManager) {}

  getDifficulty(): DifficultyStrategy {
    return this.settingsManager.getDifficulty();
  }
  getUserId(): string {
    return this.settingsManager.getUserId();
  }
  getColoring(): Coloring {
    return this.settingsManager.getColoring();
  }
}
