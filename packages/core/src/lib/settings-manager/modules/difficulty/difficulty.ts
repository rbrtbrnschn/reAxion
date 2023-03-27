import { v4 as uuid } from 'uuid';
import {
  AddGuessResponsePayload,
  AddGuessStatus,
  GameManager,
  GameManagerEvent,
  SetExtraPayload,
  SetExtraPayloadTypes,
} from '../../../game-manager/game-manager';
import { Reaction } from '../../../game-manager/reaction/reaction';
import { GameManagerResponse } from '../../../game-manager/util/response.util';

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

enum DifficultyVersionTag {
  V001 = 'V001',
}

interface DifficultyArgs {
  name: string;
  description: string;
  version: DifficultyVersionTag;
}

interface DeviationDurationDifficultyArgs extends DifficultyArgs {
  maxDuration: number;
  maxDeviation: number;
}

interface StandardDifficultyArgs extends DeviationDurationDifficultyArgs {
  maxFailedAttempts: number;
}
interface MinMaxDeviationDurationDifficultyArgs extends StandardDifficultyArgs {
  minDeviation: number;
}
export class Difficulty implements DifficultyStrategy {
  public key = 'DIFFICULTY';
  public name: string;
  public description: string;
  public version: DifficultyVersionTag;
  public id: string;
  constructor({ name, description, version }: DifficultyArgs) {
    this.name = name;
    this.description = description;
    this.version = version;
    this.id = uuid();
  }
  handleAddGuess(gameManager: GameManager, guess: number): void {
    throw new Error('Method not implemented.');
  }
  getLifeCount(gameManager: GameManager): number {
    throw new Error('Method not implemented.');
  }
  isGameOver(gameManager: GameManager): boolean {
    throw new Error('Method not implemented.');
  }
  guessIsValid(gameManager: GameManager, guess: number): AddGuessStatus {
    throw new Error('Method not implemented.');
  }
  generateReaction(gameManager: GameManager): Reaction {
    throw new Error('Method not implemented.');
  }
  onReactionStartingSequence(gameManager: GameManager) {
    return;
  }
  onReactionStart(gameManager: GameManager) {
    return;
  }
  onReactionEnd(gameManager: GameManager) {
    return;
  }
  onReactionComplete(gameManager: GameManager) {
    return;
  }
  onGameEnd(gameManager: GameManager) {
    return;
  }
}
export class StandardDifficulty
  extends Difficulty
  implements DifficultyStrategy
{
  public maxFailedAttempts: number;
  public maxDeviation: number;
  public maxDuration: number;

  constructor({
    maxDeviation,
    maxDuration,
    maxFailedAttempts,
    ...base
  }: StandardDifficultyArgs) {
    super(base);
    this.maxDeviation = maxDeviation;
    this.maxDuration = maxDuration;
    this.maxFailedAttempts = maxFailedAttempts;
  }

  handleAddGuess(gameManager: GameManager, guess: number) {
    gameManager.getCurrentReaction().addGuess(guess);

    const guessStatus = this.guessIsValid(gameManager, guess);
    const response = new GameManagerResponse(
      gameManager.getState(),
      gameManager.getCurrentEvent(),
      new AddGuessResponsePayload({
        status: guessStatus,
        message: this.getMessageFromGuessStatus(gameManager, guess),
      })
    );

    const isValid = guessStatus === 'GUESS_VALID';
    if (isValid) {
      gameManager.notify(gameManager.getCurrentEvent(), response);
      return gameManager.dispatchCompleteReaction();
    }

    gameManager
      .getCurrentGame()
      .setFailedAttempts(gameManager.getCurrentGame().getFailedAttempts() + 1);
    gameManager.notify(gameManager.getCurrentEvent(), response);

    const isGameOver = this.isGameOver(gameManager);
    if (isGameOver) return gameManager.dispatchFailGame();
  }

  getMessageFromGuessStatus(gameManager: GameManager, guess: number): string {
    const status = this.guessIsValid(gameManager, guess);
    return status === 'GUESS_VALID'
      ? 'Correct'
      : status === 'GUESS_INVALID_LOW'
      ? 'Too low.'
      : 'Too High.';
  }

  getLifeCount(gameManager: GameManager): number {
    return (
      this.maxFailedAttempts - gameManager.getCurrentGame().getFailedAttempts()
    );
  }

  isGameOver(gameManager: GameManager): boolean {
    return (
      gameManager.getCurrentGame().getFailedAttempts() >= this.maxFailedAttempts
    );
  }
  guessIsValid(gameManager: GameManager, guess: number): AddGuessStatus {
    const deviation = Math.abs(
      gameManager.getCurrentGame().getCurrentReaction().duration - guess
    );
    const isValid = deviation <= gameManager.getCurrentReaction().deviation;
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
  onReactionComplete(gameManager: GameManager) {
    gameManager
      .getCurrentGame()
      .setScore(gameManager.getCurrentGame().getScore() + 1);
    return;
  }
}

export class UnlimitedLivesBut5050ChanceOfGameOverDifficulty
  extends StandardDifficulty
  implements DifficultyStrategy
{
  constructor(args: DeviationDurationDifficultyArgs) {
    super({ ...args, maxFailedAttempts: Infinity });
  }

  handleAddGuess(gameManager: GameManager, guess: number) {
    const handleAddGuess = easyDifficulty.handleAddGuess;
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
    const boundOnReactionComplete =
      easyDifficulty.onReactionComplete.bind(this);
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

export const easyDifficulty = new StandardDifficulty({
  maxDuration: 3000,
  maxDeviation: 300,
  maxFailedAttempts: 5,
  name: 'Easy',
  description: '5 Lives. Duration: 3000. Devation: 300.',
  version: DifficultyVersionTag.V001,
});
export const mediumDifficulty = new StandardDifficulty({
  maxDuration: 2250,
  maxDeviation: 175,
  maxFailedAttempts: 3,
  name: 'Medium',
  description: '3 Lives. Duration: 2250. Devation: 175.',
  version: DifficultyVersionTag.V001,
});
export const hardDifficulty = new StandardDifficulty({
  maxDuration: 1500,
  maxDeviation: 100,
  maxFailedAttempts: 1,
  name: 'Hard',
  description: '1 Life. Duration: 2000. Devation: 100.',
  version: DifficultyVersionTag.V001,
});
export const insaneDifficulty = new StandardDifficulty({
  maxDuration: 1000,
  maxDeviation: 50,
  maxFailedAttempts: 1,
  name: 'Insane',
  description: '1 Life. Duration: 1000. Devation: 50.',
  version: DifficultyVersionTag.V001,
});

export const fiftyFiftyDifficulty =
  new UnlimitedLivesBut5050ChanceOfGameOverDifficulty({
    name: '50/50',
    description:
      "A game of chance. Deviation 500. You guess incorrectly, either you can guess again or it's game over.",
    maxDuration: 1000,
    maxDeviation: 200,
    version: DifficultyVersionTag.V001,
  });

export const variableDifficulty = new VariableDeviationDifficulty({
  name: 'Variable Deviation',
  description: 'New Deviation Per Reaction ranging from 50ms to 300ms',
  maxFailedAttempts: 3,
  maxDuration: 2000,
  minDeviation: 50,
  maxDeviation: 300,
  version: DifficultyVersionTag.V001,
});

export const timerDifficulty = new TimerOnGuessDifficulty({
  name: '3s Timer On Guess',
  description:
    '3 seconds on the clock, once the animation finishes. Deviation 200ms.',
  maxFailedAttempts: 3,
  maxDeviation: 200,
  maxDuration: 1000,
  version: DifficultyVersionTag.V001,
});

const _difficulties: DifficultyStrategy[] = [
  easyDifficulty,
  mediumDifficulty,
  hardDifficulty,
  insaneDifficulty,
  fiftyFiftyDifficulty,
  variableDifficulty,
  timerDifficulty,
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

class NoLastGuessError extends Error {
  constructor() {
    super('No Last Guess Found.');
  }
}
