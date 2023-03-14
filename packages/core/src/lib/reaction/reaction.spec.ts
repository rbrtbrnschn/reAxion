import { Game } from '../game';
import { ConcreteMediator } from '../mediator.class';
import { Observer } from '../observer';
import { AddGuessResponseStatus } from './enums';
import { AddGuessResponse } from './models/add-guess-response.class';
import { CommenceCountdownResponse } from './models/commence-countdown-response.class';
import { Reaction } from './reaction';
import {
  isAddGuessResponse,
  isCommenceCountdownResponse,
} from './utils/response.util';
describe('reaction', () => {
  let mediator: ConcreteMediator;
  let game: Game;
  let reaction: Reaction;
  let observer: Observer;
  beforeEach(() => {
    mediator = new ConcreteMediator();
    game = new Game(mediator);
    game.setMaxFailedAttempts = 3;

    reaction = new Reaction(mediator);
    reaction.guesses = [];

    observer = {
      id: '1',
      update: jest.fn(),
    };
  });
  afterEach(() => {
    reaction.unsubscribe(observer);
  });

  it('observer should listen to subject', () => {
    reaction.subscribe(observer);
    reaction.dispatchStart();

    expect(observer.update).toHaveBeenCalledTimes(1);
  });

  it('should calculate guess correctly', () => {
    const observer: Observer = {
      id: '2',
      update(eventName, payload) {
        if (isAddGuessResponse(payload as AddGuessResponse)) {
          expect((payload as AddGuessResponse).data.status).toBe(
            AddGuessResponseStatus.GUESSED_SUCCESSFULLY
          );
        } else expect(false).toBe(true);
      },
    };
    reaction.subscribe(observer);
    reaction.dispatchAddGuess(1000);
  });

  it('reaction should notifyMediatior(game)', () => {
    const gameOnNotifaction = jest.spyOn(game, 'onNotification');
    reaction.dispatchStart();
    reaction.dispatchStop();
    reaction.dispatchAddGuess(1000);

    expect(gameOnNotifaction).toHaveBeenCalled();
  });

  it('game should notifyMediator(reaction)', () => {
    const reactionOnNotfication = jest.spyOn(reaction, 'onNotification');
    reaction.dispatchAddGuess(1000);
    game.setFailedAttempts(1);

    expect(reactionOnNotfication).toHaveBeenCalled();
  });

  it('should dispatch commence countdown', () => {
    const observer: Observer = {
      id: '3',
      update(eventName, payload) {
        if (isCommenceCountdownResponse(payload as CommenceCountdownResponse)) {
          expect((payload as CommenceCountdownResponse).id).toBe(
            'COMMENCE_COUNTDOWN_RESPONSE'
          );
        }
      },
    };
    reaction.subscribe(observer);
    reaction.dispatchCommenceCountdown();
  });

  it('should add 5 wrong guesses and fail game', () => {
    game.setMaxFailedAttempts = 6;
    reaction.dispatchStart();
    reaction.dispatchStop();
    reaction.dispatchAddGuess(1);
    reaction.dispatchAddGuess(2);
    reaction.dispatchAddGuess(3);
    reaction.dispatchAddGuess(4);
    reaction.dispatchAddGuess(5);
    reaction.dispatchAddGuess(6);
    reaction.dispatchAddGuess(7);
    reaction.dispatchAddGuess(8);
    reaction.dispatchAddGuess(9);

    reaction.dispatchAddGuess(10); // should fail due to game settings of 5 lives
    console.log(game.getState.maxFailedAttempts);

    expect(reaction._guesses.length).toBe(game.getState.maxFailedAttempts);
  });
});
