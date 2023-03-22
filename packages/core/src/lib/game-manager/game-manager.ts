import { Observer, ObserverSubject } from '../observer';
import {
  NoCurrentGameError,
  NoCurrentGameEventError,
  NoCurrentReactionError,
  NoPreviousReactionError,
} from './errors';
import { Game } from './game/game';
import { GameService } from './game/game.service';
import { HasEvent } from './has-event.decorator';
import { GameManagerMediator } from './mediator/mediator';
import { Reaction } from './reaction/reaction';
import { ReactionService } from './reaction/reaction.service';
import {
  EmptyGameManagerResponse,
  GameManagerResponse,
  GameManagerResponsePayload,
  isAddGuessResponse,
} from './util/response.util';

export interface IGameManagerState {
  games: Game[];
  events: GameManagerGameEvent[];
}

export enum GameManagerGameEvent {
  DISPATCH_STARTING_SEQUENCE = 'DISPATCH_STARTING_SEQUENCE',
  DISPATCH_REACTION_START = 'DISPATCH_REACTION_START',
  DISPATCH_REACTION_END = 'DISPATCH_REACTION_END',
  DISPATCH_ADD_GUESS = 'DISPATCH_ADD_GUESS',
  DISPATCH_COMPLETE_REACTION = 'DISPATCH_COMPLETE_REACTION',
  DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION = 'DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION',
  DISPATCH_FAIL_GAME = 'DISPATCH_FAIL_GAME',
  DISPATCH_SET_NAME = 'DISPATCH_SET_NAME',
  DISPATCH_RESET_GAME = 'DISPATCH_RESET_GAME',
}
export enum GameManagerEvent {
  DISPATCH_SET_SETTINGS = 'DISPATCH_SET_SETTINGS',
}

type MyResponseType = GameManagerResponse<unknown>;
export class GameManager extends ObserverSubject<MyResponseType> {
  private readonly gameService: GameService;
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
    this.gameService = new GameService(this.mediator.getDifficulty());

    /* Rethink Architecture -> leave this open to concrete implementation */
    const addGuessObserver: Observer<MyResponseType> = {
      id: 'addGuessObserver',
      update: (eventName, response: GameManagerResponse<any>) => {
        if (eventName !== GameManagerGameEvent.DISPATCH_ADD_GUESS) return;
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

  public getCurrentEvent(): GameManagerGameEvent {
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

  public setCurrentEvent(event: GameManagerGameEvent): IGameManagerState {
    this.getCurrentGame().setEvents([
      ...this.getCurrentGame().getEvents(),
      event,
    ]);
    return this.getState();
  }

  public dispatchStartingSequence() {
    this.setCurrentEvent(GameManagerGameEvent.DISPATCH_STARTING_SEQUENCE);
    this.notify(
      this.getCurrentEvent(),
      new GameManagerResponse(
        this.getState(),
        this.getCurrentEvent(),
        undefined
      )
    );
  }

  @HasEvent([GameManagerGameEvent.DISPATCH_STARTING_SEQUENCE])
  public dispatchReactionStart() {
    this.setCurrentEvent(GameManagerGameEvent.DISPATCH_REACTION_START);
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }
  @HasEvent([GameManagerGameEvent.DISPATCH_REACTION_START])
  public dispatchReactionEnd() {
    this.setCurrentEvent(GameManagerGameEvent.DISPATCH_REACTION_END);
    this.getCurrentReaction().setStartedAt(Date.now());
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }
  @HasEvent([
    GameManagerGameEvent.DISPATCH_REACTION_END,
    GameManagerGameEvent.DISPATCH_ADD_GUESS,
    GameManagerGameEvent.DISPATCH_FAIL_GAME,
  ])
  public dispatchAddGuess(guess: number) {
    if (this.getCurrentGame().isOver) return;

    this.setCurrentEvent(GameManagerGameEvent.DISPATCH_ADD_GUESS);
    this.getCurrentReaction().addGuess(guess);
    const response = new GameManagerResponse(
      this.getState(),
      this.getCurrentEvent(),
      new AddGuessResponsePayload({
        status: new ReactionService(this.getCurrentGame())
          .withReaction(this.getCurrentReaction())
          .calculateGuessDeviationStatus(guess),
      })
    );
    this.notify(this.getCurrentEvent(), response);
  }

  @HasEvent([GameManagerGameEvent.DISPATCH_ADD_GUESS])
  public dispatchCompleteReaction() {
    this.setCurrentEvent(GameManagerGameEvent.DISPATCH_COMPLETE_REACTION);
    const currentReaction = this.getCurrentReaction();
    currentReaction.setCompletedAt(Date.now());
    currentReaction.setIsGuessed();

    this.getCurrentGame().setScore(this.getCurrentGame().getScore() + 1);
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([
    GameManagerGameEvent.DISPATCH_RESET_GAME,
    GameManagerGameEvent.DISPATCH_COMPLETE_REACTION,
  ])
  public dispatchGenerateNewWithRandomDuration() {
    this.setCurrentEvent(
      GameManagerGameEvent.DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION
    );
    const newReaction = new ReactionService(
      this.getCurrentGame()
    ).createReactionWithRandomDuration();
    this.setCurrentReaction(newReaction);
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([GameManagerGameEvent.DISPATCH_ADD_GUESS])
  public dispatchFailGame() {
    this.getCurrentReaction().setCompletedAt(Date.now());
    this.getCurrentGame().setIsOver();
    this.setCurrentEvent(GameManagerGameEvent.DISPATCH_FAIL_GAME);

    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([
    GameManagerGameEvent.DISPATCH_FAIL_GAME,
    GameManagerGameEvent.DISPATCH_SET_NAME,
  ])
  public dispatchResetGame() {
    this.setCurrentGame(
      this.gameService.createNewGame(this.mediator.getUserId())
    );
    this.setCurrentEvent(GameManagerGameEvent.DISPATCH_RESET_GAME);
    this.notify(
      GameManagerGameEvent.DISPATCH_RESET_GAME,
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([GameManagerGameEvent.DISPATCH_FAIL_GAME])
  public dispatchSetName(name: string) {
    this.setCurrentEvent(GameManagerGameEvent.DISPATCH_SET_NAME);
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
}> {
  public readonly id = 'ADD_GUESS_RESPONSE';
  constructor(data: { status: AddGuessStatus }) {
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

export type AddGuessStatus =
  | 'GUESS_VALID'
  | 'GUESS_INVALID_HIGH'
  | 'GUESS_INVALID_LOW';
