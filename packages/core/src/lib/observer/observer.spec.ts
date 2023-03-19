import { GameManagerEvent } from '../game-manager/game-manager';
import { EasyDifficulty } from '../game-manager/settings/difficulty';
import {
  EmptyGameManagerResponse,
  GameManagerResponse,
} from '../game-manager/util/response.util';
import { Observer, ObserverSubject } from './observer';

describe('observer', () => {
  it('should observe', () => {
    const observer: Observer<GameManagerResponse<unknown>> = {
      id: 'as',
      update: jest.fn(),
    };
    const subject = new ObserverSubject<GameManagerResponse<unknown>>();
    subject.subscribe(observer);
    subject.notify(
      'tbd',
      new EmptyGameManagerResponse(
        {
          events: [],
          games: [],
          settings: {
            difficulty: new EasyDifficulty(),
          },
        },
        GameManagerEvent.DISPATCH_ADD_GUESS
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
