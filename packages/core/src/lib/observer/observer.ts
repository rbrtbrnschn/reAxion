export interface Observer<Response = undefined> {
  id: string;
  update: (eventName: string, response: Response) => void;
}

interface ObserverMap<T> {
  [observerId: string]: Observer<T>;
}

export class ObserverSubject<T = any> {
  protected observers: ObserverMap<T> = {};
  public subscribe(observer: Observer<T>) {
    this.observers[observer.id] = observer;
  }

  public unsubscribe(observer: Observer<T>) {
    delete this.observers[observer.id];
  }

  public notify<K extends T>(eventName: string, response: K) {
    for (const observerId in this.observers) {
      const observer = this.observers[observerId];
      if (observer) observer.update(eventName, response);
    }
  }
}
