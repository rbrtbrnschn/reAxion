import { IFinishedReaction } from '../../../interfaces/reaction.interface';

export interface IDeviationCalculator {
  calculateDeviation(reactions: IFinishedReaction[]): number;
}

export class PrimitiveDeviationCalculator implements IDeviationCalculator {
  calculateDeviation(reactions: IFinishedReaction[]): number {
    const filteredReactions = reactions.filter((r) => r.isGuessed);
    const totalDeviation = filteredReactions
      .map((r) => Math.abs(r.duration - r.guesses[r.guesses.length - 1]))
      .reduce(toSum, 0);
    return totalDeviation / filteredReactions.filter((r) => r.isGuessed).length;
  }
}

export class ReactionGuessDeviationCalculator implements IDeviationCalculator {
  calculateDeviation(reactions: IFinishedReaction[]): number {
    const filteredReactions = reactions.filter((r) => r.isGuessed);
    const totalDeviation = filteredReactions
      .map((r) => Math.abs(r.duration - r.guesses[r.guesses.length - 1].guess))
      .reduce(toSum, 0);
    return totalDeviation / filteredReactions.filter((r) => r.isGuessed).length;
  }
}

const toSum = (prev: number, curr: number) => prev + curr;
