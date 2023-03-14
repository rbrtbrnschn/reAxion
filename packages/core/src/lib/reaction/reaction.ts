import { GuessStatus, ReactionStatus } from '@reaxion/common';
import { GameMediator, MediatorSubject } from '../mediator.class';
import { Event } from './decorators/event.decorator';
import { Whitelist } from './decorators/whitelist.decorator';
import { AddGuessResponseStatus } from './enums';
import { ReactionEvent } from './enums/event.enum';
import { GameEvent } from './enums/game.enum';
import { IReactionState } from './interfaces/state.interface';
import { AddGuessResponse } from './models/add-guess-response.class';
import { CommenceCountdownResponse } from './models/commence-countdown-response.class';
import { StartAnimationResponse } from './models/start-response.class';
import { StopAnimationResponse } from './models/stop-response.class';
import { ReactionService } from './services/reaction.service';

const defaultState: IReactionState = {
  guesses: [],
  duration: 1000,
  _id: '',
  guessStatus: GuessStatus.IS_WAITING,
  reactionStatus: ReactionStatus.HAS_NOT_STARTED,
  isGuessed: false,
  currentEvent: '',
};

export class Reaction extends MediatorSubject {
  constructor(
    protected mediator: GameMediator,
    private state: IReactionState = defaultState
  ) {
    super();
    mediator.register(this, [GameEvent.SET_FAILED_ATTEMPTS]);
    this.dispatchAddGuess = this.dispatchAddGuess.bind(this);
  }

  onNotification(eventName: string, payload: any): void {
    // TODO rewrite after game.ts is rewritten
    if (eventName === GameEvent.SET_FAILED_ATTEMPTS) {
      const isGameOver = payload?.failedAttempts === payload?.maxFailedAttempts;
      if (isGameOver) {
        this.dispatchFailed();
      }
    }
  }

  private reactionService = new ReactionService(this.state);

  /* Getters */
  get _guesses() {
    return this.state.guesses;
  }
  get _duration() {
    return this.state.duration;
  }
  get _id() {
    return this.state._id;
  }
  get _guessStatus() {
    return this.state.guessStatus;
  }
  get _reactionStatus() {
    return this.state.reactionStatus;
  }
  get _isGuessed() {
    return this.state.isGuessed;
  }
  get _startedAt() {
    return this.state?.startedAt;
  }
  get _completedAt() {
    return this.state?.completedAt;
  }
  get _currentEvent(): string {
    return this.state.currentEvent;
  }
  /* Getters */

  /* Setters */
  set guesses(guesses: number[]) {
    this.state.guesses = guesses;
  }
  set duration(duration: number) {
    this.state.duration = duration;
  }
  set id(_id: string) {
    this.state._id = _id;
  }
  set guessStatus(guessStatus: GuessStatus) {
    this.state.guessStatus = guessStatus;
  }
  set reactionStatus(reactionStatus: ReactionStatus) {
    this.state.reactionStatus = reactionStatus;
  }
  set isGuessed(isGuessed: boolean) {
    this.state.isGuessed = isGuessed;
  }
  set startedAt(startedAt: number) {
    this.state.startedAt = startedAt;
  }
  set completedAt(completedAt: number) {
    this.state.completedAt = completedAt;
  }
  /* Setters */

  /* Dispatchers / Events */

  @Event(ReactionEvent.EVENT_COMMENCE_COUNTDOWN)
  public dispatchCommenceCountdown() {
    this.notify(
      this.state.currentEvent,
      new CommenceCountdownResponse(this.state)
    );
  }

  @Event(ReactionEvent.EVENT_START_ANIMATION)
  public dispatchStart() {
    this.notify(
      this.state.currentEvent,
      new StartAnimationResponse(this.state)
    );
  }

  @Whitelist([ReactionEvent.EVENT_START_ANIMATION])
  @Event(ReactionEvent.EVENT_STOP_ANIMATION)
  public dispatchStop() {
    this.notify(this.state.currentEvent, new StopAnimationResponse(this.state));
  }

  @Whitelist([
    ReactionEvent.EVENT_STOP_ANIMATION,
    ReactionEvent.EVENT_ADD_GUESS,
  ])
  @Event(ReactionEvent.EVENT_ADD_GUESS)
  public dispatchAddGuess(guess: number) {
    // const gameState = this.mediator.getGameState().currentEvent;
    this.state.guesses = [...this._guesses, guess];

    // game, set failedAttemptsAccordingToResponseStatus
    const payload = new AddGuessResponse(this.state, {
      status: this.reactionService.guessIsRight(guess)
        ? AddGuessResponseStatus.GUESSED_SUCCESSFULLY
        : AddGuessResponseStatus.GUSSED_UNSUCCESSFULLY,
    });
    this.notify(this.state.currentEvent, payload);
  }

  @Whitelist([ReactionEvent.EVENT_ADD_GUESS])
  @Event(ReactionEvent.EVENT_COMPLETED)
  public dispatchComplete() {
    this.completedAt = Date.now();
    this.isGuessed = true;
    // set completedAt
    // set isGuessed
    // copy to history
  }

  @Whitelist([ReactionEvent.EVENT_ADD_GUESS])
  @Event(ReactionEvent.EVENT_FAILED)
  public dispatchFailed() {
    // TODO
    // gameover and axios.post
  }
  /* Dispatchers / Events */
}
