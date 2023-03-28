import { Game, Reaction, ReactionGuess, ReactionOld } from '../game-manager';
import { DefaultSettingsHandlerImpl } from '../settings-manager';
import { GameProcessingServiceFactory } from './game-processing-service.factory';

describe('GameProcessingServiceFactory', () => {
  it('should instantiate PrimitiveDeviationCalculator', () => {
    const reactions = [
      new ReactionOld('asd', 1000, 300, [950], true, Date.now(), Date.now()),
      new ReactionOld('asd', 1000, 300, [975], true, Date.now(), Date.now()),
    ];
    const game = new Game(
      'asd',
      DefaultSettingsHandlerImpl.defaultSettings.difficulty,
      0,
      0,
      '',
      [...reactions],
      []
    );
    const deviation =
      GameProcessingServiceFactory.create(game).getAverageDeviation();
    expect(deviation).toBeDefined();
  });
  it('should instantiate ReactionGuessDeviationCalculator', () => {
    const reactions = [
      new Reaction(
        'asd',
        1000,
        300,
        [new ReactionGuess(950, Date.now())],
        true,
        Date.now(),
        Date.now()
      ),
      new Reaction(
        'asd',
        1000,
        300,
        [new ReactionGuess(975, Date.now())],
        true,
        Date.now(),
        Date.now()
      ),
    ];
    const game = new Game(
      'asd',
      DefaultSettingsHandlerImpl.defaultSettings.difficulty,
      0,
      0,
      '',
      [...reactions],
      []
    );
    const deviation =
      GameProcessingServiceFactory.create(game).getAverageDeviation();
    expect(deviation).toBeDefined();
  });
});
