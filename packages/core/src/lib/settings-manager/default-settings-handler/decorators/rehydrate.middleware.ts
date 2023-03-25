import { Settings } from '../../../interfaces';
import {
  EasyDifficultyStrategy,
  UnlimitedLivesBut5050ChanceOfGameOverDifficulty,
} from '../../modules';
import { Middleware } from '../default-settings.handler';

export const RehydrateSettingsMiddleware: Middleware<Settings> = (
  context,
  next
) => {
  const hasDifficultyStrategy =
    context.difficulty.key === 'DIFFICULTY_STRATEGY';
  if (hasDifficultyStrategy) {
    if (context.difficulty.id === 'EASY_DIFFICULTY') {
      context.difficulty = new EasyDifficultyStrategy();
    } else if (
      context.difficulty.id ===
      'UNLIMITED_LIVES_BUT_50_50_CHANCE_OF_GAME_OVER_DIFFICULTY'
    ) {
      context.difficulty =
        new UnlimitedLivesBut5050ChanceOfGameOverDifficulty();
    }
  }
  return next();
};
