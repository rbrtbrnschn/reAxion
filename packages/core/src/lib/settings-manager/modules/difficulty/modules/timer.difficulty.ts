import { v4 as uuid } from 'uuid';
import {
  GameManager,
  GameManagerEvent,
  GameManagerResponse,
  Reaction,
  SetExtraPayload,
  SetExtraPayloadTypes,
} from '../../../../game-manager';
import { DifficultyBuilder, DifficultyStrategy } from '../difficulty';
import {
  StandardDifficulty,
  StandardDifficultyArgs,
} from './standard.difficulty';

export class TimerOnGuessDifficulty
  extends StandardDifficulty
  implements DifficultyStrategy
{
  private timeout?: ReturnType<typeof setTimeout>;

  constructor(args: StandardDifficultyArgs) {
    super(args);
  }

  getLifeCount(gameManager: GameManager): number {
    return (
      this.maxFailedAttempts - gameManager.getCurrentGame().getFailedAttempts()
    );
  }

  isGameOver(): boolean {
    return !!Math.round(Math.random());
  }

  getMessageFromGuessStatus(gameManager: GameManager, guess: number): string {
    const status = this.guessIsValid(gameManager, guess);
    return status === 'GUESS_VALID'
      ? 'Correct'
      : status === 'GUESS_INVALID_LOW'
      ? 'Too low.'
      : status === 'GUESS_INVALID_HIGH'
      ? 'Too High.'
      : status === 'GUESS_TIMEOUT'
      ? 'Took too long.'
      : '';
  }
  generateReaction(): Reaction {
    const duration = Math.ceil(Math.random() * this.maxDuration);
    const id = uuid();

    return new Reaction(id, duration, this.maxDeviation, [], false);
  }

  onGameStart(gameManager: GameManager) {
    return;
  }
  onReactionEnd(gameManager: GameManager) {
    const notfiyWithCount = (count: number) => {
      gameManager.notify(
        GameManagerEvent.DISPATCH_SET_EXTRA,
        new GameManagerResponse(
          gameManager.getState(),
          GameManagerEvent.DISPATCH_SET_EXTRA,
          new SetExtraPayload({
            message: count + '',
            type: SetExtraPayloadTypes.COUNTDOWN,
          })
        )
      );
    };

    const currentReaction = gameManager.getCurrentReaction();

    notfiyWithCount(3);
    this.timeout = setTimeout(() => {
      notfiyWithCount(2);
      this.timeout = setTimeout(() => {
        notfiyWithCount(1);
        this.timeout = setTimeout(() => {
          notfiyWithCount(0);
          this.timeout = setTimeout(() => {
            notfiyWithCount(-1);
            if (!currentReaction.isGuessed) {
              gameManager.dispatchFailGame();
            }
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);

    return;
  }

  onReactionComplete(gameManager: GameManager): void {
    const boundOnReactionComplete = new DifficultyBuilder()
      .buildEasy()
      .onReactionComplete.bind(this);
    boundOnReactionComplete(gameManager);
    clearTimeout(this.timeout);
    gameManager.notify(
      GameManagerEvent.DISPATCH_SET_EXTRA,
      new GameManagerResponse(
        gameManager.getState(),
        GameManagerEvent.DISPATCH_SET_EXTRA,
        new SetExtraPayload({
          message: -1 + '',
          type: SetExtraPayloadTypes.COUNTDOWN,
        })
      )
    );
  }
}
