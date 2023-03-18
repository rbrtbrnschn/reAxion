import { EmptyResponse, GameSubjectEvent, Response } from './game/game.subject';
import { Observer, ObserverSubject } from './observer';

describe('observer', () => {
  it('should observe', () => {
    const observer: Observer<Response<unknown>> = {
      id: 'as',
      update: jest.fn(),
    };
    const subject = new ObserverSubject<Response<unknown>>();
    subject.subscribe(observer);
    subject.notify(
      'tbd',
      new EmptyResponse(
        {
          events: [],
          games: [],
          settings: {
            difficulty: {
              deviation: 1,
              id: 'a',
              maxDuration: 12,
              maxFailedAttempts: 1,
            },
          },
        },
        GameSubjectEvent.DISPATCH_ADD_GUESS
      )
    );
    subject.unsubscribe(observer);

    expect(observer.update).toHaveBeenCalled();
  });

  it('should test generics', () => {
    const observer: Observer = {
      id: 'as',
      update: jest.fn(),
    };
    const subject = new ObserverSubject();
    subject.subscribe(observer);
    subject.notify('tbd', 'string');
    subject.notify('tbd', 123);
    subject.unsubscribe(observer);

    expect(observer.update).toHaveBeenCalledTimes(2);
  });
});
