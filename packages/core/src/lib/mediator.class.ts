import { Game, GameState } from './game';
import { ObserverSubject } from './observer';

export interface Mediator {
  notify(sender: MediatorSubject, event: string, payload: any): void;
  register(subject: MediatorSubject, events: string[]): void;
  getSubject(subject: MediatorSubject): MediatorSubject | null;
}
export interface GameMediator extends Mediator {
  getGameState(): GameState;
}

export class ConcreteMediator implements GameMediator {
  private subjects: Map<MediatorSubject, string[]> = new Map();

  register(subject: MediatorSubject, events: string[]) {
    this.subjects.set(subject, events);
    subject.setMediator(this);
  }

  notify(sender: MediatorSubject, event: string, payload: any) {
    this.subjects.forEach((events: string[], subject: MediatorSubject) => {
      if (subject !== sender && events.includes(event)) {
        subject.onNotification(event, payload);
      }
    });
  }

  getSubject(subject: MediatorSubject): MediatorSubject | null {
    return this.subjects.has(subject) ? subject : null;
  }

  getGameState() {
    const game = this.getSubject(new Game(this)) as Game;
    if (!game) throw new Error('MediatorSubject not found.');
    return game.getState;
  }
}

export abstract class MediatorSubject extends ObserverSubject {
  constructor() {
    super();
  }
  protected mediator!: Mediator;

  public setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }

  public notify(eventName: string, payload: any): void {
    super.notify(eventName, payload);
    this.mediator?.notify(this, eventName, payload);
  }

  abstract onNotification(event: string, payload: any): void;
}
