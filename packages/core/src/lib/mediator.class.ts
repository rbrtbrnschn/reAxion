import { Game, GameState } from './game.subject';
import { ObserverSubject } from './observer';

export interface Mediator {
  notify(sender: MediatorSubject, event: string, payload: any): void;
  register(subject: MediatorSubject, events: string[]): void;
  getSubject(subjectId: string): MediatorSubject | undefined;
}
export interface GameMediator extends Mediator {
  getGameState(): GameState;
}

export class ConcreteMediator implements GameMediator {
  private subjects: Map<
    string,
    { subject: MediatorSubject; events: string[] }
  > = new Map();

  register(subject: MediatorSubject, events: string[]) {
    this.subjects.set(subject.key, { subject, events });
    subject.setMediator(this);
  }

  notify(sender: MediatorSubject, event: string, payload: any) {
    this.subjects.forEach(({ subject, events }) => {
      if (subject !== sender && events.includes(event)) {
        subject.onNotification(event, payload);
      }
    });
  }

  getSubject(subjectId: string): MediatorSubject | undefined {
    return this.subjects.get(subjectId)?.subject;
  }

  getGameState() {
    const game = this.getSubject('GAME' as any) as Game;
    if (!game) throw new Error('MediatorSubject not found.');
    return game.getState;
    return {
      currentEvent: '',
      duration: 1,
      failedAttempts: 1,
      maxFailedAttempts: 2,
    } as GameState;
  }
}

export abstract class MediatorSubject extends ObserverSubject {
  public key = 'MEDIATOR_SUBJECT';
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
