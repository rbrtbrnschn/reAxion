import { Settings } from '../../../interfaces';
import { Middleware } from '../../../middleware';
import { DifficultyBuilder } from '../../modules';
import { difficulties } from '../../modules/difficulty/difficulty';

export const RehydrateSettingsMiddleware: Middleware<Settings> = (
  context,
  next
) => {
  const hasDehydratedDifficulty = context.difficulty;
  if (!hasDehydratedDifficulty) return next();

  const hasDifficultyStrategy = context.difficulty.key === 'DIFFICULTY';
  if (hasDifficultyStrategy) {
    const hasId = context.difficulty.id;
    if (hasId) {
      const difficultyFromId = difficulties[context.difficulty.id];
      if (difficultyFromId) {
        context.difficulty = difficulties[context.difficulty.id];
      } else {
        context.difficulty = new DifficultyBuilder().buildEasy();
      }
    }
  } else {
    context.difficulty = new DifficultyBuilder().buildEasy();
  }
  return next();
};
