import { ObserverSubject } from '../observer';
import {
  NoCurrentGameError,
  NoCurrentGameEventError,
  NoCurrentReactionError,
  NoPreviousGameError,
  NoPreviousReactionError,
} from './errors';
import { Game } from './game/game';
import { GameService } from './game/game.service';
import { HasEvent } from './has-event.decorator';
import { GameManagerMediator } from './mediator/mediator';
import { Reaction } from './reaction/reaction';
import {
  EmptyGameManagerResponse,
  GameManagerResponse,
  GameManagerResponsePayload,
} from './util/response.util';

export interface IGameManagerState {
  games: Game[];
  events: GameManagerEvent[];
}

export enum GameManagerEvent {
  DISPATCH_STARTING_SEQUENCE = 'DISPATCH_STARTING_SEQUENCE',
  DISPATCH_REACTION_START = 'DISPATCH_REACTION_START',
  DISPATCH_REACTION_END = 'DISPATCH_REACTION_END',
  DISPATCH_ADD_GUESS = 'DISPATCH_ADD_GUESS',
  DISPATCH_COMPLETE_REACTION = 'DISPATCH_COMPLETE_REACTION',
  DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION = 'DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION',
  DISPATCH_FAIL_GAME = 'DISPATCH_FAIL_GAME',
  DISPATCH_SET_NAME = 'DISPATCH_SET_NAME',
  DISPATCH_RESET_GAME = 'DISPATCH_RESET_GAME',

  DISPATCH_SET_EXTRA = 'DISPATCH_SET_EXTRA',
}

type MyResponseType = GameManagerResponse<unknown>;
export class GameManager extends ObserverSubject<MyResponseType> {
  // private readonly gameService: GameService;
  private state: IGameManagerState = {
    games: [],
    events: [],
  };
  constructor(
    public readonly mediator: GameManagerMediator,
    gameState?: Partial<IGameManagerState>
  ) {
    super();
    this.state = { ...this.state, ...gameState };
    // this.gameService = new GameService(this.mediator.getDifficulty());
  }

  public getState(): IGameManagerState {
    return this.state;
  }
  public setState(gameState: IGameManagerState): IGameManagerState {
    this.state = { ...gameState };
    return this.getState();
  }

  public getCurrentReaction(): Reaction {
    const currentReaction = this.getCurrentGame().getCurrentReaction();
    if (!currentReaction) throw new NoCurrentReactionError();

    return currentReaction;
  }
  public getPreviousReaction(): Reaction {
    const previousReaction = this.getCurrentGame().getPreviousReaction();
    if (!previousReaction) throw new NoPreviousReactionError();

    return previousReaction;
  }
  public getCurrentGame(): Game {
    const games = [...this.getState().games];
    const currentGame = games.pop();
    if (!currentGame) throw new NoCurrentGameError();

    return currentGame;
  }
  public getPreviousGame(): Game {
    const games = [...this.getState().games];
    const currentGame = games.pop();
    const prevGame = games.pop();

    if (!currentGame) throw new NoCurrentGameError();
    if (!prevGame) throw new NoPreviousGameError();

    return prevGame;
  }

  public getCurrentEvent(): GameManagerEvent {
    const events = [...this.getCurrentGame().events];
    const currentEvent = events.pop();
    if (!currentEvent) throw new NoCurrentGameEventError();

    return currentEvent;
  }

  public setCurrentReaction(reaction: Reaction): IGameManagerState {
    this.getCurrentGame().setCurrentReaction(reaction);
    return this.getState();
  }

  public setCurrentGame(game: Game): IGameManagerState {
    this.setState({
      ...this.getState(),
      games: [...this.getState().games, game],
    });
    return this.getState();
  }

  public setCurrentEvent(event: GameManagerEvent): IGameManagerState {
    this.getCurrentGame().setEvents([
      ...this.getCurrentGame().getEvents(),
      event,
    ]);
    return this.getState();
  }

  public dispatchStartingSequence() {
    this.setCurrentEvent(GameManagerEvent.DISPATCH_STARTING_SEQUENCE);

    this.getCurrentGame().difficulty.onReactionStartingSequence(this);
    this.notify(
      this.getCurrentEvent(),
      new GameManagerResponse(
        this.getState(),
        this.getCurrentEvent(),
        undefined
      )
    );
  }

  @HasEvent([GameManagerEvent.DISPATCH_STARTING_SEQUENCE])
  public dispatchReactionStart() {
    this.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_START);
    this.getCurrentGame().difficulty.onReactionStart(this);
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }
  @HasEvent([GameManagerEvent.DISPATCH_REACTION_START])
  public dispatchReactionEnd() {
    this.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);
    this.getCurrentReaction().setStartedAt(Date.now());

    this.getCurrentGame().difficulty.onReactionEnd(this);
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }
  @HasEvent([
    GameManagerEvent.DISPATCH_REACTION_END,
    GameManagerEvent.DISPATCH_ADD_GUESS,
  ])
  public dispatchAddGuess(guess: number) {
    if (this.getCurrentGame().isOver) return;

    this.setCurrentEvent(GameManagerEvent.DISPATCH_ADD_GUESS);
    const { difficulty } = this.getCurrentGame();

    difficulty.handleAddGuess(this, guess);
  }

  @HasEvent([GameManagerEvent.DISPATCH_ADD_GUESS])
  public dispatchCompleteReaction() {
    this.setCurrentEvent(GameManagerEvent.DISPATCH_COMPLETE_REACTION);
    const currentReaction = this.getCurrentReaction();
    currentReaction.setCompletedAt(Date.now());
    currentReaction.setIsGuessed();
    const difficulty = this.getCurrentGame().difficulty;

    difficulty.onReactionComplete(this);

    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([
    GameManagerEvent.DISPATCH_RESET_GAME,
    GameManagerEvent.DISPATCH_COMPLETE_REACTION,
  ])
  public dispatchGenerateNewWithRandomDuration() {
    this.setCurrentEvent(
      GameManagerEvent.DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION
    );
    const { difficulty } = this.getCurrentGame();
    const newReaction = difficulty.generateReaction(this);

    this.setCurrentReaction(newReaction);
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([
    GameManagerEvent.DISPATCH_ADD_GUESS,
    GameManagerEvent.DISPATCH_STARTING_SEQUENCE,
    GameManagerEvent.DISPATCH_REACTION_END,
  ])
  public dispatchFailGame() {
    this.getCurrentReaction().setCompletedAt(Date.now());
    this.getCurrentGame().setIsOver();
    this.setCurrentEvent(GameManagerEvent.DISPATCH_FAIL_GAME);

    this.getCurrentGame().difficulty.onGameEnd(this);

    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([
    GameManagerEvent.DISPATCH_FAIL_GAME,
    GameManagerEvent.DISPATCH_SET_NAME,
  ])
  public dispatchResetGame() {
    this.setCurrentGame(
      new GameService(this.mediator.getDifficulty()).createNewGame(
        this.mediator.getUserId()
      )
    );
    this.setCurrentEvent(GameManagerEvent.DISPATCH_RESET_GAME);
    this.notify(
      GameManagerEvent.DISPATCH_RESET_GAME,
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([GameManagerEvent.DISPATCH_FAIL_GAME])
  public dispatchSetName(name: string) {
    this.setCurrentEvent(GameManagerEvent.DISPATCH_SET_NAME);
    if (!name) throw new Error('No Name Found.');

    this.getCurrentGame().setName(name);
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }
}

export class AddGuessResponsePayload extends GameManagerResponsePayload<{
  status: AddGuessStatus;
  message: string;
}> {
  public readonly id = 'ADD_GUESS_RESPONSE';
  constructor(data: { status: AddGuessStatus; message: string }) {
    super(data);
  }
}
export class ReactionStartResponsePayload<
  T extends undefined
> extends GameManagerResponsePayload<T> {
  public readonly id = 'REACTION_START_RESPONSE';
  constructor(data: T) {
    super(data);
  }
}
export class ReactionEndResponsePayload<
  T extends undefined
> extends GameManagerResponsePayload<T> {
  public readonly id = 'REACTION_END_RESPONSE';
  constructor(data: T) {
    super(data);
  }
}

export class SetExtraPayload extends GameManagerResponsePayload<{
  message: string;
  type: string;
}> {
  public readonly id = 'SET_EXTRA_RESPONSE';
  constructor(data: { message: string; type: string }) {
    super(data);
  }
}

export enum SetExtraPayloadTypes {
  DEVIATION = 'DEVIATION',
  COUNTDOWN = 'COUNTDOWN',
  MESSAGE = 'MESSAGE',
}

export type AddGuessStatus =
  | 'GUESS_VALID'
  | 'GUESS_INVALID_HIGH'
  | 'GUESS_INVALID_LOW'
  | 'GUESS_TIMEOUT';
