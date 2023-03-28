import { IFinishedReaction, IGame } from '../interfaces';
import {
  difficulties,
  DifficultyStrategy,
} from '../settings-manager/modules/difficulty/difficulty';
import {
  IDeviationCalculator,
  ReactionGuessDeviationCalculator,
} from './caclulator/deviation-calculator/deviation-calculator';

export class GameProcessingService {
  private reactions: IFinishedReaction[];
  private guessedReactions: IFinishedReaction[];
  private difficulty: DifficultyStrategy;
  private failedAttempts: number;
  private name: string;
  private score: number;
  constructor(
    game: IGame,
    private deviationCalculator: IDeviationCalculator = new ReactionGuessDeviationCalculator()
  ) {
    this.reactions = game.reactions as IFinishedReaction[];
    this.guessedReactions = this.reactions?.filter(
      (r) => r.isGuessed
    ) as IFinishedReaction[];
    this.difficulty = difficulties[game.difficulty.id];
    this.score = game.score;
    this.name = game.name || '';
    this.failedAttempts = game.failedAttempts;
  }

  getGameTime() {
    return this.guessedReactions.map(toReactionDuration).reduce(toSum, 0);
  }

  getAverageDeviation() {
    return this.deviationCalculator.calculateDeviation(this.reactions);
  }

  getAverageTimeForCorrectGuess() {
    return this.getGameTime() / this.guessedReactions.length;
  }
}

const toSum = (prev: number, curr: number) => prev + curr;
const toReactionDuration = (r: IFinishedReaction) =>
  r.completedAt - r.startedAt;
const toReactionDeviation = (r: IFinishedReaction) =>
  Math.abs(r.duration - r.guesses[r.guesses.length - 1].guess);
