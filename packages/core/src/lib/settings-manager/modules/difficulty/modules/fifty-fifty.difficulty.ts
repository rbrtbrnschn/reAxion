import { v4 as uuid } from 'uuid';
import {
  AddGuessStatus,
  GameManager,
  GameManagerEvent,
  GameManagerResponse,
  Reaction,
  SetExtraPayload,
  SetExtraPayloadTypes,
} from '../../../../game-manager';
import { DifficultyBuilder, DifficultyStrategy } from '../difficulty';
import {
  DeviationDurationDifficultyArgs,
  StandardDifficulty,
} from './standard.difficulty';

export class UnlimitedLivesBut5050ChanceOfGameOverDifficulty
  extends StandardDifficulty
  implements DifficultyStrategy
{
  constructor(args: DeviationDurationDifficultyArgs) {
    super({ ...args, maxFailedAttempts: Infinity });
  }

  handleAddGuess(gameManager: GameManager, guess: number) {
    const handleAddGuess = new DifficultyBuilder().buildEasy().handleAddGuess;
    const boundHandleAddGuess = handleAddGuess.bind(this);
    boundHandleAddGuess(gameManager, guess);
  }
  isGameOver(gameManager: GameManager): boolean {
    const lastGuess = gameManager.getCurrentReaction().guesses.pop();
    if (!lastGuess) throw new NoLastGuessError();
    if (this.guessIsValid(gameManager, lastGuess.guess) === 'GUESS_VALID')
      return false;
    const isGameOver = !!Math.round(Math.random());
    const extraMessage = 'You got lucky.';
    if (!isGameOver) {
      gameManager.notify(
        GameManagerEvent.DISPATCH_SET_EXTRA,
        new GameManagerResponse(
          gameManager.getState(),
          GameManagerEvent.DISPATCH_SET_EXTRA,
          new SetExtraPayload({
            message: extraMessage,
            type: SetExtraPayloadTypes.MESSAGE,
          })
        )
      );
      setTimeout(() => {
        gameManager.notify(
          GameManagerEvent.DISPATCH_SET_EXTRA,
          new GameManagerResponse(
            gameManager.getState(),
            GameManagerEvent.DISPATCH_SET_EXTRA,
            new SetExtraPayload({
              message: '',
              type: SetExtraPayloadTypes.MESSAGE,
            })
          )
        );
      }, 1000);
    }
    return isGameOver;
  }
  guessIsValid(gameManager: GameManager, guess: number): AddGuessStatus {
    const deviation = Math.abs(
      gameManager.getCurrentGame().getCurrentReaction().duration - guess
    );
    const isValid = deviation <= this.maxDeviation;
    const isTooLow =
      !isValid && guess < gameManager.getCurrentReaction().duration;
    return isValid
      ? 'GUESS_VALID'
      : isTooLow
      ? 'GUESS_INVALID_LOW'
      : 'GUESS_INVALID_HIGH';
  }
  generateReaction(): Reaction {
    const duration = Math.ceil(Math.random() * this.maxDuration);
    const id = uuid();

    return new Reaction(id, duration, this.maxDeviation, [], false);
  }
  getLifeCount(gameManager: GameManager): number {
    return '?' as unknown as number;
  }
}

class NoLastGuessError extends Error {
  constructor() {
    super('No Last Guess Found.');
  }
}
