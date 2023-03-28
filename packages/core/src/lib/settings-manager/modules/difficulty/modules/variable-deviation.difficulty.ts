import { v4 as uuid } from 'uuid';
import {
  GameManager,
  GameManagerEvent,
  GameManagerResponse,
  Reaction,
  SetExtraPayload,
  SetExtraPayloadTypes,
} from '../../../../game-manager';
import { DifficultyStrategy } from '../difficulty';
import {
  StandardDifficulty,
  StandardDifficultyArgs,
} from './standard.difficulty';

export interface MinMaxDeviationDurationDifficultyArgs
  extends StandardDifficultyArgs {
  minDeviation: number;
}

export class VariableDeviationDifficulty
  extends StandardDifficulty
  implements DifficultyStrategy
{
  public readonly minDeviation: number;
  public currentMaxDeviation = this.maxDeviation;

  constructor({
    minDeviation,
    ...args
  }: MinMaxDeviationDurationDifficultyArgs) {
    super({ ...args });
    this.minDeviation = minDeviation;
  }

  generateReaction(): Reaction {
    // todo refactor to service to make it testable.
    const getCurrentMaxDeviation = (): number => {
      const deviation = Math.ceil(Math.random() * this.maxDeviation);
      if (deviation < this.minDeviation) return getCurrentMaxDeviation();
      return deviation;
    };
    const duration = Math.ceil(Math.random() * this.maxDuration);
    const id = uuid();
    const currentMaxDeviation = getCurrentMaxDeviation();
    this.currentMaxDeviation = currentMaxDeviation;
    return new Reaction(id, duration, currentMaxDeviation, [], false);
  }
  onReactionStartingSequence(gameManager: GameManager): void {
    gameManager.notify(
      GameManagerEvent.DISPATCH_SET_EXTRA,
      new GameManagerResponse(
        gameManager.getState(),
        GameManagerEvent.DISPATCH_SET_EXTRA,
        new SetExtraPayload({
          message: `${this.currentMaxDeviation}`,
          type: SetExtraPayloadTypes.DEVIATION,
        })
      )
    );
  }
  onGameEnd(gameManager: GameManager): void {
    gameManager.notify(
      GameManagerEvent.DISPATCH_SET_EXTRA,
      new GameManagerResponse(
        gameManager.getState(),
        GameManagerEvent.DISPATCH_SET_EXTRA,
        new SetExtraPayload({
          message: ``,
          type: SetExtraPayloadTypes.MESSAGE,
        })
      )
    );
  }
}
