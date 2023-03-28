import {
  AddGuessStatus,
  GameManager,
} from '../../../game-manager/game-manager';
import { Reaction } from '../../../game-manager/reaction/reaction';
import { UnlimitedLivesBut5050ChanceOfGameOverDifficulty } from './modules/fifty-fifty.difficulty';
import { StandardDifficulty } from './modules/standard.difficulty';
import { TimerOnGuessDifficulty } from './modules/timer.difficulty';
import { VariableDeviationDifficulty } from './modules/variable-deviation.difficulty';

export interface DifficultyStrategy {
  key: string;
  name: string;
  id: string;
  description: string;

  handleAddGuess(gameManager: GameManager, guess: number): void;
  getLifeCount(gameManager: GameManager): number;

  isGameOver(gameManager: GameManager): boolean;
  guessIsValid(gameManager: GameManager, guess: number): AddGuessStatus;
  generateReaction(gameManager: GameManager): Reaction;

  onReactionStartingSequence: (gameManager: GameManager) => void;
  onReactionStart: (gameManager: GameManager) => void;
  onReactionEnd: (gameManager: GameManager) => void;
  onReactionComplete: (gameManager: GameManager) => void;
  onGameEnd: (gameManager: GameManager) => void;
}

export enum DifficultyVersionTag {
  V001 = 'V001',
}

export interface DifficultyArgs {
  name: string;
  description: string;
  version: DifficultyVersionTag;
  id: string;
}

export class DifficultyBuilder {
  buildEasy() {
    return new StandardDifficulty({
      maxDuration: 3000,
      maxDeviation: 300,
      maxFailedAttempts: 5,
      name: 'Easy',
      description: '5 Lives. Duration: 3000. Devation: 300.',
      id: 'EASY_STANDARD_DIFFICULTY',
      version: DifficultyVersionTag.V001,
    });
  }
  buildMedium() {
    return new StandardDifficulty({
      maxDuration: 2250,
      maxDeviation: 175,
      maxFailedAttempts: 3,
      name: 'Medium',
      description: '3 Lives. Duration: 2250. Devation: 175.',
      version: DifficultyVersionTag.V001,
      id: 'MEDIUM_STANDARD_DIFFICULTY',
    });
  }
  buildHard() {
    return new StandardDifficulty({
      maxDuration: 1500,
      maxDeviation: 100,
      maxFailedAttempts: 1,
      name: 'Hard',
      description: '1 Life. Duration: 2000. Devation: 100.',
      version: DifficultyVersionTag.V001,
      id: 'HARD_STANDARD_DIFFICULTY',
    });
  }
  buildInsane() {
    return new StandardDifficulty({
      maxDuration: 1000,
      maxDeviation: 50,
      maxFailedAttempts: 1,
      name: 'Insane',
      description: '1 Life. Duration: 1000. Devation: 50.',
      version: DifficultyVersionTag.V001,
      id: 'INSANE_STANDARD_DIFFICULTY',
    });
  }
  buildBaseFiftyFifty() {
    return new UnlimitedLivesBut5050ChanceOfGameOverDifficulty({
      name: '50/50',
      description:
        "A game of chance. Deviation 200. You guess incorrectly, either you can guess again or it's game over.",
      maxDuration: 1000,
      maxDeviation: 200,
      version: DifficultyVersionTag.V001,
      id: 'BASE_FIFTY_FIFTY_DIFFICULTY',
    });
  }
  buildBaseVariableDeviation() {
    return new VariableDeviationDifficulty({
      name: 'Variable Deviation',
      description: 'New Deviation Per Reaction ranging from 50ms to 300ms',
      maxFailedAttempts: 3,
      maxDuration: 2000,
      minDeviation: 50,
      maxDeviation: 300,
      version: DifficultyVersionTag.V001,
      id: 'BASE_VARIABLE_DEVIATION_DIFFICULTY',
    });
  }
  buildBaseTimer() {
    return new TimerOnGuessDifficulty({
      name: '3s Timer On Guess',
      description:
        '3 seconds on the clock, once the animation finishes. Deviation 200ms.',
      maxFailedAttempts: 3,
      maxDeviation: 200,
      maxDuration: 1000,
      version: DifficultyVersionTag.V001,
      id: 'BASE_TIMER_ON_GUESS_DIFFICULTY',
    });
  }
}

const builder = new DifficultyBuilder();
const _difficulties: DifficultyStrategy[] = [
  builder.buildEasy(),
  builder.buildMedium(),
  builder.buildHard(),
  builder.buildInsane(),
  builder.buildBaseFiftyFifty(),
  builder.buildBaseVariableDeviation(),
  builder.buildBaseTimer(),
];

export const difficulties: Record<string, DifficultyStrategy> =
  _difficulties.reduce(
    (
      accumulator: Record<string, DifficultyStrategy>,
      currentValue: DifficultyStrategy
    ) => {
      accumulator[currentValue.id] = currentValue;
      return accumulator;
    },
    {}
  );
