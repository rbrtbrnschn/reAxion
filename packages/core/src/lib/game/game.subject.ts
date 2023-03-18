import { GuessStatus, IReaction, ReactionStatus } from '@reaxion/common';
import { Observer, ObserverSubject } from '../observer';
import { HasEvent } from './decorators/has-event.decorator';
import { ReactionService } from './services/reaction.service';
import { isAddGuessResponse } from './util/response.util';
export enum GameSubjectEvent {
  DISPATCH_STARTING_SEQUENCE = 'DISPATCH_STARTING_SEQUENCE',

  DISPATCH_REACTION_START = 'DISPATCH_REACTION_START',
  DISPATCH_REACTION_END = 'DISPATCH_REACTION_END',
  DISPATCH_ADD_GUESS = 'DISPATCH_ADD_GUESS',
  DISPATCH_COMPLETE_REACTION = 'DISPATCH_COMPLETE_REACTION',
  DISPATCH_FAIL_REACTION = 'DISPATCH_FAIL_REACTION',
  DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION = 'DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION',

  DISPATCH_FAIL_GAME = 'DISPATCH_FAIL_GAME',
}

class NoCurrentReactionError extends Error {
  constructor() {
    super('No Current Reaction Found.');
  }
}
class NoCurrentGameError extends Error {
  constructor() {
    super('No Current Game Found.');
  }
}
class NoCurrentGameEventError extends Error {
  constructor() {
    super('No Current Event Found.');
  }
}

export class UndefinedReactionError extends Error {
  constructor() {
    super('Reaction is undefined.');
  }
}

export class EasyDifficulty implements IDifficulty {
  public readonly id = 'EASY_DIFFICULTY';
  public readonly deviation = 500;
  public readonly maxFailedAttempts = 5;
  public readonly maxDuration = 3000;
}
export class MediumDifficulty implements IDifficulty {
  public readonly id = 'MEDIUM_DIFFICULTY';
  public readonly deviation = 300;
  public readonly maxFailedAttempts = 3;
  public readonly maxDuration = 2000;
}
export class HardDifficulty implements IDifficulty {
  public readonly id = 'HARD_DIFFICULTY';
  public readonly deviation = 100;
  public readonly maxFailedAttempts = 1;
  public readonly maxDuration = 1000;
}
export class ExtremeDifficulty implements IDifficulty {
  public readonly id = 'EXTREME_DIFFICULTY';
  public readonly deviation = 50;
  public readonly maxFailedAttempts = 1;
  public readonly maxDuration = 500;
}

export class Game {
  public readonly key = 'GAME_CLASS';
  public isOver: boolean;
  constructor(
    public readonly difficulty: IDifficulty,
    private failedAttempts: number,
    private score: number,
    public readonly _id: string,
    public reactions: Reaction[],
    public events: GameSubjectEvent[]
  ) {
    this.isOver = false;
  }
  public setCurrentReaction(reaction: Reaction): Game {
    if (!reaction) throw new UndefinedReactionError();
    this.reactions.push(reaction);
    return this;
  }
  public getCurrentReaction() {
    const reactions = [...this.reactions];
    const currentReaction = reactions.pop();
    if (!currentReaction) throw new NoCurrentReactionError();

    return currentReaction;
  }

  public getFailedAttempts() {
    return this.failedAttempts;
  }
  public setFailedAttempts(failedAttempts: number): Game {
    this.failedAttempts = failedAttempts;
    return this;
  }
  public getScore() {
    return this.score;
  }
  public setScore(score: number): Game {
    this.score = score;
    return this;
  }
  public getIsOver() {
    return this.isOver;
  }
  public setIsOver() {
    this.isOver = true;
  }
  public getEvents() {
    return this.events;
  }
  public setEvents(events: GameSubjectEvent[]) {
    this.events = events;
  }
}

export class Reaction implements IReaction {
  public readonly key = 'REACTION_CLASS';
  constructor(
    public readonly _id: string,
    public readonly duration: number,
    public guesses: number[],
    public isGuessed: boolean,
    public guessStatus: GuessStatus,
    public reactionStatus: ReactionStatus,
    public startedAt?: number,
    public completedAt?: number
  ) {}

  public addGuess(guess: number) {
    this.guesses = [...this.guesses, guess];
  }
  public setIsGuessed() {
    this.isGuessed = true;
  }
  public setGuessStatus(guessStatus: GuessStatus) {
    this.guessStatus = guessStatus;
  }
  public setReactionStatus(reactionStatus: ReactionStatus) {
    this.reactionStatus = reactionStatus;
  }
  public setStartedAt(startedAt: number) {
    this.startedAt = startedAt;
  }
  public setCompletedAt(completedAt: number) {
    this.completedAt = completedAt;
  }
}

export class Settings implements ISettings {
  constructor(public difficulty: IDifficulty) {}
  public getDifficulty(): IDifficulty {
    return this.difficulty;
  }
  public setDifficulty(difficulty: IDifficulty): ISettings {
    this.difficulty = difficulty;
    return this;
  }
}

export interface IDifficulty {
  id: string;
  deviation: number;
  maxDuration: number;
  maxFailedAttempts: number;
}
export interface ISettings {
  difficulty: IDifficulty;
}

export interface IGameState {
  games: Game[];
  settings: ISettings;
  events: GameSubjectEvent[];
}

type MyResponseType = Response<unknown>;
export class GameSubject extends ObserverSubject<MyResponseType> {
  private readonly reactionService: ReactionService;
  private state: IGameState = {
    games: [],
    settings: {
      difficulty: new EasyDifficulty(),
    },
    events: [],
  };
  constructor(gameState?: Partial<IGameState>) {
    super();
    this.state = { ...this.state, ...gameState };
    this.reactionService = new ReactionService(this.state.settings);

    /* Rethink Architecture -> leave this open to concrete implementation */
    const addGuessObserver: Observer<MyResponseType> = {
      id: 'addGuessObserver',
      update: (eventName, response: Response<any>) => {
        if (eventName !== GameSubjectEvent.DISPATCH_ADD_GUESS) return;
        if (!isAddGuessResponse(response)) return;

        if (response.payload.data.status === 'GUESS_VALID') {
          this.dispatchCompleteReaction();

          return;
        }

        this.getCurrentGame().setFailedAttempts(
          this.getCurrentGame().getFailedAttempts() + 1
        );

        if (
          this.getCurrentGame().getFailedAttempts() !==
          this.getCurrentGame().difficulty.maxFailedAttempts
        )
          return;

        this.dispatchFailGame();
      },
    };
    this.subscribe(addGuessObserver);
  }

  public getState(): IGameState {
    return this.state;
  }
  public setState(gameState: IGameState): IGameState {
    this.state = { ...gameState };
    return this.getState();
  }

  public getSettings(): ISettings {
    return this.getState().settings;
  }
  public setSettings(settings: ISettings): IGameState {
    this.setState({ ...this.getState(), settings });
    return this.getState();
  }

  public getCurrentReaction(): Reaction {
    const currentReaction = this.getCurrentGame().getCurrentReaction();
    if (!currentReaction) throw new NoCurrentReactionError();

    return currentReaction;
  }
  public getCurrentGame(): Game {
    const games = [...this.getState().games];
    const currentGame = games.pop();
    if (!currentGame) throw new NoCurrentGameError();

    return currentGame;
  }

  public getCurrentEvent(): GameSubjectEvent {
    const events = [...this.getCurrentGame().events];
    const currentEvent = events.pop();
    if (!currentEvent) throw new NoCurrentGameEventError();

    return currentEvent;
  }

  public setCurrentReaction(reaction: Reaction): IGameState {
    this.getCurrentGame().setCurrentReaction(reaction);
    return this.getState();
  }

  public setCurrentGame(game: Game): IGameState {
    this.setState({
      ...this.getState(),
      games: [...this.getState().games, game],
    });
    return this.getState();
  }

  public setCurrentEvent(event: GameSubjectEvent): IGameState {
    this.getCurrentGame().setEvents([
      ...this.getCurrentGame().getEvents(),
      event,
    ]);
    return this.getState();
  }

  public dispatchStartingSequence() {
    this.setCurrentEvent(GameSubjectEvent.DISPATCH_STARTING_SEQUENCE);
    this.notify(
      this.getCurrentEvent(),
      new Response(this.getState(), this.getCurrentEvent(), undefined)
    );
  }

  @HasEvent([GameSubjectEvent.DISPATCH_STARTING_SEQUENCE])
  public dispatchReactionStart() {
    this.setCurrentEvent(GameSubjectEvent.DISPATCH_REACTION_START);
    this.notify(
      this.getCurrentEvent(),
      new EmptyResponse(this.getState(), this.getCurrentEvent())
    );
  }
  @HasEvent([GameSubjectEvent.DISPATCH_REACTION_START])
  public dispatchReactionEnd() {
    this.setCurrentEvent(GameSubjectEvent.DISPATCH_REACTION_END);
    this.getCurrentReaction().setStartedAt(Date.now());
    this.notify(
      this.getCurrentEvent(),
      new EmptyResponse(this.getState(), this.getCurrentEvent())
    );
  }
  @HasEvent([GameSubjectEvent.DISPATCH_REACTION_END])
  public dispatchAddGuess(guess: number) {
    if (this.getCurrentGame().isOver) return;

    this.setCurrentEvent(GameSubjectEvent.DISPATCH_ADD_GUESS);
    this.getCurrentReaction().addGuess(guess);
    const response = new Response(
      this.getState(),
      this.getCurrentEvent(),
      new AddGuessResponsePayload({
        status: this.reactionService
          .withReaction(this.getCurrentReaction())
          .guessIsRight(guess)
          ? 'GUESS_VALID'
          : 'GUESS_INVALID',
      })
    );
    this.notify(this.getCurrentEvent(), response);
  }

  @HasEvent([GameSubjectEvent.DISPATCH_ADD_GUESS])
  public dispatchCompleteReaction() {
    this.setCurrentEvent(GameSubjectEvent.DISPATCH_COMPLETE_REACTION);
    const currentReaction = this.getCurrentReaction();
    currentReaction.setCompletedAt(Date.now());
    currentReaction.setIsGuessed();

    this.getCurrentGame().setScore(this.getCurrentGame().getScore() + 1);
    this.notify(
      this.getCurrentEvent(),
      new EmptyResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([GameSubjectEvent.DISPATCH_ADD_GUESS])
  public dispatchFailReaction() {
    this.setCurrentEvent(GameSubjectEvent.DISPATCH_FAIL_REACTION);
    const currentReaction = this.getCurrentReaction();
    currentReaction.setCompletedAt(Date.now());
    this.notify(
      this.getCurrentEvent(),
      new EmptyResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([GameSubjectEvent.DISPATCH_COMPLETE_REACTION])
  public dispatchGenerateNewWithRandomDuration() {
    this.setCurrentEvent(
      GameSubjectEvent.DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION
    );
    const newReaction = this.reactionService.createReactionWithRandomDuration();
    this.setCurrentReaction(newReaction);
    this.notify(
      this.getCurrentEvent(),
      new EmptyResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([GameSubjectEvent.DISPATCH_ADD_GUESS])
  public dispatchFailGame() {
    this.setCurrentEvent(GameSubjectEvent.DISPATCH_FAIL_GAME);
    this.getCurrentGame().setIsOver();

    this.notify(
      this.getCurrentEvent(),
      new EmptyResponse(this.getState(), this.getCurrentEvent())
    );
  }

  // method that increments game.failedAttempts if necessary
  // -> listener that listens to GameSubjectEvent.DISPATCH_ADD_GUESS
}

export class Response<T> {
  constructor(
    public readonly state: IGameState,
    public readonly event: GameSubjectEvent,
    public readonly payload: T
  ) {}
}
export class EmptyResponse extends Response<undefined> {
  constructor(state: IGameState, event: GameSubjectEvent) {
    super(state, event, undefined);
  }
}
export class ResponsePayload<T> {
  public readonly id: string = 'RESPONE_PAYLOAD';
  constructor(public readonly data: T) {}
}
export class AddGuessResponsePayload<
  T = { status: AddGuessStatus }
> extends ResponsePayload<T> {
  public readonly id = 'ADD_GUESS_RESPONSE_PAYLOAD';
  constructor(data: T) {
    super(data);
  }
}
export type AddGuessStatus = 'GUESS_VALID' | 'GUESS_INVALID';
