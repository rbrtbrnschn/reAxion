import { Settings } from '../../../interfaces';
import {
  EasyDifficultyStrategy,
  Middleware,
  TimerOnGuessDifficulty,
  UnlimitedLivesBut5050ChanceOfGameOverDifficulty,
  VariableDeviationDifficulty,
} from '../default-settings.handler';

export const RehydrateSettingsMiddleware: Middleware<Settings> = (
  context,
  next
) => {
  const hasDifficultyStrategy =
    context.difficulty.key === 'DIFFICULTY_STRATEGY';
  if (hasDifficultyStrategy) {
    switch (context.difficulty.id) {
      case 'EASY_DIFFICULTY':
        context.difficulty = new EasyDifficultyStrategy();
        break;
      case 'UNLIMITED_LIVES_BUT_50_50_CHANCE_OF_GAME_OVER_DIFFICULTY':
        context.difficulty =
          new UnlimitedLivesBut5050ChanceOfGameOverDifficulty();
        break;
      case 'TIMER_ON_GUESS_DIFFICULTY':
        context.difficulty = new TimerOnGuessDifficulty();
        break;
      case 'VARIABLE_DEVIATION_DIFFICULTY':
        context.difficulty = new VariableDeviationDifficulty();
    }
  }
  return next();
};
