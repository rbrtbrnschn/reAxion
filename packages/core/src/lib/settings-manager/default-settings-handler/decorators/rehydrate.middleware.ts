import { Settings } from '../../../interfaces';
import { Middleware } from '../../../middleware';
import { difficulties } from '../../modules/difficulty/difficulty';

export const RehydrateSettingsMiddleware: Middleware<Settings> = (
  context,
  next
) => {
  const hasDifficultyStrategy =
    context.difficulty.key === 'DIFFICULTY_STRATEGY';
  if (hasDifficultyStrategy) {
    context.difficulty = difficulties[context.difficulty.id];
  }
  return next();
};
