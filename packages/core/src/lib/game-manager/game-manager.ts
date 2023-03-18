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
import { Reaction } from './reaction/reaction';
import { ReactionService } from './reaction/reaction.service';
import { EasyDifficulty } from './settings/difficulty';
import { ISettings } from './settings/settings.interface';
import {
  EmptyGameManagerResponse,
  GameManagerResponse,
  GameManagerResponsePayload,
  isAddGuessResponse,
} from './util/response.util';

export interface IGameManagerState {
  games: Game[];
  settings: ISettings;
  events: GameManagerEvent[];
}

export enum GameManagerEvent {
  DISPATCH_STARTING_SEQUENCE = 'DISPATCH_STARTING_SEQUENCE',
  DISPATCH_REACTION_START = 'DISPATCH_REACTION_START',
  DISPATCH_REACTION_END = 'DISPATCH_REACTION_END',
  DISPATCH_ADD_GUESS = 'DISPATCH_ADD_GUESS',
  DISPATCH_COMPLETE_REACTION = 'DISPATCH_COMPLETE_REACTION',
  DISPATCH_FAIL_REACTION = 'DISPATCH_FAIL_REACTION',
  DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION = 'DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION',
  DISPATCH_FAIL_GAME = 'DISPATCH_FAIL_GAME',
  DISPATCH_RESET_GAME = 'DISPATCH_RESET_GAME',
}

type MyResponseType = GameManagerResponse<unknown>;
export class GameManager extends ObserverSubject<MyResponseType> {
  private readonly reactionService: ReactionService;
  private readonly gameService: GameService;
  private state: IGameManagerState = {
    games: [],
    settings: {
      difficulty: new EasyDifficulty(),
    },
    events: [],
  };
  constructor(gameState?: Partial<IGameManagerState>) {
    super();
    this.state = { ...this.state, ...gameState };
    this.reactionService = new ReactionService(this.state.settings);
    this.gameService = new GameService(this.state.settings);

    /* Rethink Architecture -> leave this open to concrete implementation */
    const addGuessObserver: Observer<MyResponseType> = {
      id: 'addGuessObserver',
      update: (eventName, response: GameManagerResponse<any>) => {
        if (eventName !== GameManagerEvent.DISPATCH_ADD_GUESS) return;
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

  public getSettings(): ISettings {
    return this.getState().settings;
  }
  public setSettings(settings: ISettings): IGameManagerState {
    this.setState({ ...this.getState(), settings });
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
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }
  @HasEvent([GameManagerEvent.DISPATCH_REACTION_START])
  public dispatchReactionEnd() {
    this.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);
    this.getCurrentReaction().setStartedAt(Date.now());
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }
  @HasEvent([GameManagerEvent.DISPATCH_REACTION_END])
  public dispatchAddGuess(guess: number) {
    if (this.getCurrentGame().isOver) return;

    this.setCurrentEvent(GameManagerEvent.DISPATCH_ADD_GUESS);
    this.getCurrentReaction().addGuess(guess);
    const response = new GameManagerResponse(
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

  @HasEvent([GameManagerEvent.DISPATCH_ADD_GUESS])
  public dispatchCompleteReaction() {
    this.setCurrentEvent(GameManagerEvent.DISPATCH_COMPLETE_REACTION);
    const currentReaction = this.getCurrentReaction();
    currentReaction.setCompletedAt(Date.now());
    currentReaction.setIsGuessed();

    this.getCurrentGame().setScore(this.getCurrentGame().getScore() + 1);
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([GameManagerEvent.DISPATCH_ADD_GUESS])
  public dispatchFailReaction() {
    this.setCurrentEvent(GameManagerEvent.DISPATCH_FAIL_REACTION);
    const currentReaction = this.getCurrentReaction();
    currentReaction.setCompletedAt(Date.now());
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([GameManagerEvent.DISPATCH_COMPLETE_REACTION])
  public dispatchGenerateNewWithRandomDuration() {
    this.setCurrentEvent(
      GameManagerEvent.DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION
    );
    const newReaction = this.reactionService.createReactionWithRandomDuration();
    this.setCurrentReaction(newReaction);
    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([GameManagerEvent.DISPATCH_ADD_GUESS])
  public dispatchFailGame() {
    this.setCurrentEvent(GameManagerEvent.DISPATCH_FAIL_GAME);
    this.getCurrentGame().setIsOver();

    this.notify(
      this.getCurrentEvent(),
      new EmptyGameManagerResponse(this.getState(), this.getCurrentEvent())
    );
  }

  @HasEvent([GameManagerEvent.DISPATCH_FAIL_GAME])
  public dispatchResetGame() {
    this.setCurrentEvent(GameManagerEvent.DISPATCH_RESET_GAME);
    this.setCurrentGame(this.gameService.createNewGame());
  }
}

export class AddGuessResponsePayload<
  T = { status: AddGuessStatus }
> extends GameManagerResponsePayload<T> {
  public readonly id = 'ADD_GUESS_RESPONSE';
  constructor(data: T) {
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

export type AddGuessStatus = 'GUESS_VALID' | 'GUESS_INVALID';
