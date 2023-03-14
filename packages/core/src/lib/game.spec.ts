import { Game } from './game';
import { ConcreteMediator } from './mediator.class';
import { Observer } from './observer';
describe('game', () => {
  let mediator: ConcreteMediator;
  let game: Game;
  let observer: Observer;
  beforeEach(() => {
    mediator = new ConcreteMediator();
    game = new Game(mediator);
    observer = {
      id: '1',
      update: jest.fn(),
    };
  });
  afterEach(() => {
    game.unsubscribe(observer);
  });

  it('observer should listen to subject', () => {
    game.subscribe(observer);
    game.start();

    expect(observer.update).toHaveBeenCalledTimes(1);
  });
});
