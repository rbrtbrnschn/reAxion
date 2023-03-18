import { Response } from './game.subject';

export interface Observer {
  id: string;
  update: (eventName: string, payload: Response<any>) => void;
}

interface ObserverMap {
  [observerId: string]: Observer;
}

export class ObserverSubject {
  protected observers: ObserverMap = {};
  public subscribe(observer: Observer) {
    this.observers[observer.id] = observer;
  }

  public unsubscribe(observer: Observer) {
    delete this.observers[observer.id];
  }

  public notify(eventName: string, payload: Response<any>) {
    for (const observerId in this.observers) {
      const observer = this.observers[observerId];
      if (observer) observer.update(eventName, payload);
    }
  }
}
