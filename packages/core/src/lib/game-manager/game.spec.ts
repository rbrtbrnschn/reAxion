import { GuessStatus, ReactionStatus } from '@reaxion/common';
import { Observer } from '../observer';
import {
  AddGuessResponsePayload,
  GameManager,
  GameManagerEvent,
  IGameManagerState,
} from './game-manager';
import { Game } from './game/game';
import { GameService } from './game/game.service';
import { Reaction } from './reaction/reaction';
import { ReactionService } from './reaction/reaction.service';
import { EasyDifficulty } from './settings/difficulty';
import { Settings } from './settings/settings';
import { IDifficulty, ISettings } from './settings/settings.interface';
import {
  EmptyGameManagerResponse,
  GameManagerResponse,
  isAddGuessResponse,
} from './util/response.util';
describe('game', () => {
  let gameSubject: GameManager;
  let reaction: Reaction;
  let settings: ISettings;
  const difficulty: IDifficulty = new EasyDifficulty();
  let game: Game;

  beforeEach(() => {
    settings = new Settings(difficulty);
    const gameState: Partial<IGameManagerState> = {
      games: [],
      settings,
    };
    gameSubject = new GameManager(gameState);
    game = new Game(difficulty, 0, 0, 'asdd', [], []);
    gameSubject.setCurrentGame(game);
    reaction = new Reaction(
      'asd',
      1000,
      [],
      false,
      GuessStatus.IS_WAITING,
      ReactionStatus.HAS_NOT_STARTED,
      Date.now()
    );
  });

  describe('getters & setters', () => {
    it('should get & set currentReaction', () => {
      gameSubject.setCurrentReaction(reaction);
      expect(gameSubject.getCurrentReaction()._id).toEqual(reaction._id);
    });
    it('should get & set currentGame', () => {
      gameSubject.setCurrentGame(game);
      expect(gameSubject.getCurrentGame()._id).toEqual(game._id);
    });
  });

  describe('event loop', () => {
    it('should dispatch starting sequence', () => {
      gameSubject.dispatchStartingSequence();
      expect(gameSubject.getCurrentEvent()).toEqual(
        GameManagerEvent.DISPATCH_STARTING_SEQUENCE
      );
    });

    it('observer should update', () => {
      const observer: Observer<GameManagerResponse<any>> = {
        id: 'asd',
        update: jest.fn(),
      };
      gameSubject.subscribe(observer);
      gameSubject.dispatchStartingSequence();
      expect(observer.update).toHaveBeenCalledTimes(1);
      gameSubject.unsubscribe(observer);
    });

    it('should add guess to current Reaction', () => {
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);

      const validGuessObserverEvents: GameManagerEvent[] = [];
      const observerInvalidGuess: Observer<GameManagerResponse<any>> = {
        id: 'dasd',
        update: (
          eventName,
          response:
            | EmptyGameManagerResponse
            | GameManagerResponse<AddGuessResponsePayload>
        ) => {
          if (isAddGuessResponse(response)) {
            expect(eventName).toEqual(GameManagerEvent.DISPATCH_ADD_GUESS);
            expect(response.payload.data.status === 'GUESS_INVALID').toEqual(
              true
            );
          }
        },
      };
      const observerValidGuess: Observer<GameManagerResponse<any>> = {
        id: 'asdd',
        update: (
          eventName,
          payload: GameManagerResponse<AddGuessResponsePayload>
        ) => {
          validGuessObserverEvents.push(eventName as GameManagerEvent);
          if (payload.payload) {
            expect(payload.payload.data.status === 'GUESS_VALID').toEqual(true);
          }
        },
      };
      gameSubject.setCurrentReaction(reaction);
      gameSubject.subscribe(observerInvalidGuess);
      gameSubject.dispatchAddGuess(2000);
      gameSubject.unsubscribe(observerInvalidGuess);

      gameSubject.subscribe(observerValidGuess);
      gameSubject.dispatchAddGuess(reaction.duration);
      gameSubject.unsubscribe(observerValidGuess);

      expect(
        validGuessObserverEvents.includes(
          GameManagerEvent.DISPATCH_COMPLETE_REACTION
        ) === true
      ).toEqual(true);
      expect(gameSubject.getCurrentReaction().guesses.length).toEqual(2);
    });

    it('should complete current reaction', () => {
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_ADD_GUESS);

      gameSubject.setCurrentReaction(reaction);
      gameSubject.dispatchCompleteReaction();
      const currentReaction = gameSubject.getCurrentReaction();
      expect(currentReaction.completedAt).toBeGreaterThan(1);
      expect(currentReaction.isGuessed).toEqual(true);
    });

    it('should fail current reaction', () => {
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_ADD_GUESS);

      gameSubject.setCurrentReaction(reaction);
      gameSubject.dispatchFailReaction();
      const currentReaction = gameSubject.getCurrentReaction();
      expect(currentReaction.completedAt).toBeGreaterThan(1);
      expect(currentReaction.isGuessed).toEqual(false);
    });

    it('should generate and set new reaction with random duration', () => {
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_COMPLETE_REACTION);
      gameSubject.setCurrentReaction(reaction);
      expect(gameSubject.getCurrentReaction().duration).toEqual(
        reaction.duration
      );
      gameSubject.dispatchGenerateNewWithRandomDuration();
      expect(
        gameSubject.getCurrentReaction().duration !== reaction.duration
      ).toEqual(true);
      expect(gameSubject.getCurrentReaction().duration).toBeGreaterThan(0);
    });

    it('should be game over', () => {
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_ADD_GUESS);
      gameSubject.setCurrentReaction(reaction);
      gameSubject.dispatchFailReaction();
      gameSubject.dispatchFailGame();

      expect(gameSubject.getCurrentReaction().completedAt).toBeGreaterThan(1);
      expect(gameSubject.getCurrentReaction().isGuessed).toEqual(false);
      expect(gameSubject.getCurrentGame().getIsOver()).toEqual(true);
    });
    it('should fail game automatically', () => {
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);
      gameSubject.setCurrentReaction(reaction);
      const events: GameManagerEvent[] = [];
      const failedGameObserver: Observer<GameManagerResponse<any>> = {
        id: 'failedGameObserver',
        update: (eventName, payload) => {
          events.push(eventName as GameManagerEvent);
        },
      };
      gameSubject.subscribe(failedGameObserver);

      gameSubject.dispatchAddGuess(1);
      gameSubject.dispatchAddGuess(2);
      gameSubject.dispatchAddGuess(3);
      gameSubject.dispatchAddGuess(4);
      gameSubject.dispatchAddGuess(5);
      gameSubject.dispatchAddGuess(6);

      expect(gameSubject.getCurrentGame().getFailedAttempts()).toEqual(
        gameSubject.getCurrentGame().difficulty.maxFailedAttempts
      );
      expect(events.includes(GameManagerEvent.DISPATCH_FAIL_GAME)).toEqual(
        true
      );
      gameSubject.unsubscribe(failedGameObserver);
    });

    it('should not add guess after game is over', () => {
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);
      gameSubject.setCurrentReaction(reaction);
      Array.from({ length: 10 }).map((_, i) => gameSubject.dispatchAddGuess(i));

      expect(gameSubject.getCurrentGame().getFailedAttempts()).toEqual(
        gameSubject.getCurrentGame().difficulty.maxFailedAttempts
      );
    });

    it('should complete game if guess correctly', () => {
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);
      const events: GameManagerEvent[] = [];

      gameSubject.setCurrentReaction(reaction);
      const completeReactionOnValidGuessObserver: Observer<
        GameManagerResponse<any>
      > = {
        id: 'completeReactionOnValidGuessObserver',
        update(eventName, payload) {
          events.push(eventName as GameManagerEvent);
        },
      };
      gameSubject.subscribe(completeReactionOnValidGuessObserver);
      gameSubject.dispatchAddGuess(reaction.duration);

      expect(
        events.includes(GameManagerEvent.DISPATCH_COMPLETE_REACTION) === true
      ).toEqual(true);
      gameSubject.unsubscribe(completeReactionOnValidGuessObserver);
    });

    it('should update score on complete reaction', () => {
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);

      gameSubject.setCurrentReaction(reaction);
      gameSubject.dispatchAddGuess(reaction.duration);

      expect(gameSubject.getCurrentGame().getScore()).toBeGreaterThanOrEqual(1);
    });

    // 0. gameService
    // 1. frontend mvp

    // 2.may need to write converters or storage engine (TAKE A LOOK INTO AFTER FRONTEND WORKS)
    // -> game class and reaction class may need to take ids/keys to allow for this

    // should generate and set new current reaction upon valid guess
    it('should generate and set new current reaction upon valid guess', () => {
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);
      gameSubject.setCurrentReaction(reaction);
      gameSubject.dispatchAddGuess(2000);
      expect(gameSubject.getCurrentReaction()._id).toBe(reaction._id);
      gameSubject.dispatchAddGuess(reaction.duration);
      gameSubject.dispatchGenerateNewWithRandomDuration();

      expect(gameSubject.getCurrentReaction()._id !== reaction._id).toEqual(
        true
      );
      expect(
        gameSubject.getCurrentGame().reactions[0].completedAt
      ).toBeGreaterThan(1);
      expect(gameSubject.getCurrentGame().reactions[0].isGuessed).toEqual(true);
    });

    it('should reset game', () => {
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);
      gameSubject.setCurrentReaction(reaction);
      Array.from({
        length: gameSubject.getSettings().difficulty.maxFailedAttempts,
      }).forEach(() =>
        gameSubject.dispatchAddGuess(
          gameSubject.getCurrentReaction().duration +
            gameSubject.getCurrentGame().difficulty.deviation +
            1
        )
      );

      expect(gameSubject.getCurrentGame().reactions.length).toEqual(1);
      gameSubject.dispatchResetGame();
      expect(gameSubject.getCurrentGame()._id !== game._id).toEqual(true);
      expect(gameSubject.getCurrentGame().reactions.length).toEqual(0);
    });
  });

  describe('reaction service', () => {
    it('should calculate guess correctly ', () => {
      const easySettings: ISettings = { difficulty: new EasyDifficulty() };

      const reactionService = new ReactionService(easySettings).withReaction(
        reaction
      );

      expect(
        reactionService.guessIsRight(
          reaction.duration - settings.difficulty.deviation
        )
      ).toEqual(true);
      expect(
        reactionService.guessIsRight(
          reaction.duration - settings.difficulty.deviation - 1
        )
      ).toEqual(false);
    });

    it('should create new reaction with random duration', () => {
      const easySettings: ISettings = { difficulty: new EasyDifficulty() };
      const mediumSettings: ISettings = {
        difficulty: {
          maxDuration: 1500,
          deviation: 500,
          id: 'asd',
          maxFailedAttempts: 3,
        },
      };

      function generateRandomDurations(settings: ISettings, amount = 100) {
        const service = new ReactionService(settings);
        return Array.from({ length: amount }).map(
          () => service.createReactionWithRandomDuration().duration
        );
      }
      const easyDurations = generateRandomDurations(easySettings);
      const easyIsTrue = easyDurations.every(
        (e) => e <= easySettings.difficulty.maxDuration
      );

      const mediumDurations = generateRandomDurations(mediumSettings);
      const mediumIsTrue = mediumDurations.every(
        (e) => e <= mediumSettings.difficulty.maxDuration
      );

      expect(easyIsTrue).toEqual(true);
      expect(mediumIsTrue).toEqual(true);
    });
  });

  describe('gameService', () => {
    it('should create new game', () => {
      const service = new GameService(settings);
      const newGame = service.createNewGame();

      expect(newGame._id !== game._id).toEqual(true);
      expect(newGame.isOver).toEqual(false);
      expect(newGame.reactions).toStrictEqual([]);
      expect(newGame.events).toStrictEqual([]);
    });
  });
});
