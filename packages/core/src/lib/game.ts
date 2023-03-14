import { Event } from './reaction/decorators/event.decorator';

import { GameMediator, MediatorSubject } from './mediator.class';
import { ReactionEvent } from './reaction/enums/event.enum';
import { GameEvent } from './reaction/enums/game.enum';

export interface GameState {
  duration: number;
  currentEvent: string;
  maxFailedAttempts: number;
  failedAttempts: number;
}

export class Game extends MediatorSubject {
  onNotification(event: string, payload: any): void {
    switch (event) {
      case ReactionEvent.EVENT_ADD_GUESS:
        this.setFailedAttempts(this.state.failedAttempts + 1);
        break;
      default:
        break;
    }
  }
  constructor(protected mediator: GameMediator) {
    super();
    this.mediator.register(this, [ReactionEvent.EVENT_ADD_GUESS]);
  }

  private state: GameState = {
    duration: 1000,
    maxFailedAttempts: 1,
    failedAttempts: 0,
    currentEvent: '',
  };

  get getState() {
    return this.state;
  }

  set setState(state: GameState) {
    this.state = state;
    this.notify('EVENT_SET_STATE', this.state);
  }

  set setMaxFailedAttempts(maxFailedAttempts: number) {
    this.state.maxFailedAttempts = maxFailedAttempts;
    console.log(
      'Setting maxFailedAttempts to ',
      maxFailedAttempts,
      this.state.maxFailedAttempts
    );
  }

  get currentEvent(): string {
    return this.state.currentEvent;
  }

  @Event(GameEvent.SET_FAILED_ATTEMPTS)
  public setFailedAttempts(failedAttempts: number) {
    this.state.failedAttempts = failedAttempts;
    this.notify(this.currentEvent, this.state);
  }

  public startCountdown() {
    this.notify('START_COUNTDOWN', this.state);
  }
  @Event('GAME_STARTED')
  public start() {
    this.notify('GAME_STARTED', this.state);
  }

  @Event('GAME_OVER')
  public dispatchGameOver() {
    this.notify(this.state.currentEvent, this.state);
  }
}
