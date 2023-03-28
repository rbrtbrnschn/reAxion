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

  context.difficulty =
    difficulties[context.difficulty?.id] || new DifficultyBuilder().buildEasy();
  return next();
};
