import { Observer } from '../observer';
import { EasyDifficultyStrategy } from '../settings-manager/default-settings-handler/default-settings.handler';
import { SettingsManager } from '../settings-manager/settings-manager';
import {
  AddGuessResponsePayload,
  GameManager,
  GameManagerEvent,
  IGameManagerState,
} from './game-manager';
import { Game } from './game/game';
import { GameService } from './game/game.service';
import { GameManagerMediator } from './mediator/mediator';
import { Reaction } from './reaction/reaction';
import {
  EmptyGameManagerResponse,
  GameManagerResponse,
  isAddGuessResponse,
  isCompleteReactionResponse,
} from './util/response.util';
describe('game', () => {
  let gameSubject: GameManager;
  let reaction: Reaction;
  let game: Game;
  let settingsManager: SettingsManager;
  beforeEach(() => {
    settingsManager = new SettingsManager();
    const gameState: Partial<IGameManagerState> = {
      games: [],
    };
    gameSubject = new GameManager(
      new GameManagerMediator(settingsManager),
      gameState
    );
    game = new Game(
      gameSubject.mediator.getUserId(),
      gameSubject.mediator.getDifficulty(),
      0,
      0,
      'asdd',
      [],
      []
    );
    gameSubject.setCurrentGame(game);
    reaction = new Reaction(
      'asd',
      1000,
      EasyDifficultyStrategy.maxDeviation,
      [],
      false,
      Date.now()
    );
  });

  describe('getters & setters', () => {
    it('should get & set currentReaction', () => {
      gameSubject.setCurrentReaction(reaction);
      expect(gameSubject.getCurrentReaction().id).toEqual(reaction.id);
    });
    it('should get & set currentGame', () => {
      gameSubject.setCurrentGame(game);
      expect(gameSubject.getCurrentGame().id).toEqual(game.id);
    });
  });

  describe('event loop', () => {
    it('should dispatch starting sequence', () => {
      gameSubject.setCurrentReaction(reaction);
      gameSubject.dispatchStartingSequence();
      expect(gameSubject.getCurrentEvent()).toEqual(
        GameManagerEvent.DISPATCH_STARTING_SEQUENCE
      );
      expect(gameSubject.getCurrentGame().events.length).toEqual(1);
    });

    it('observer should update', () => {
      gameSubject.setCurrentReaction(reaction);
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
      gameSubject.setCurrentReaction(reaction);
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
            expect(
              response.payload.data.status === 'GUESS_INVALID_HIGH'
            ).toEqual(true);
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
      gameSubject.setCurrentReaction(reaction);
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_ADD_GUESS);

      gameSubject.setCurrentReaction(reaction);
      gameSubject.dispatchCompleteReaction();
      const currentReaction = gameSubject.getCurrentReaction();
      expect(currentReaction.completedAt).toBeGreaterThan(1);
      expect(currentReaction.isGuessed).toEqual(true);
    });

    it('should fail current reaction', () => {
      gameSubject.setCurrentReaction(reaction);
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_ADD_GUESS);

      gameSubject.setCurrentReaction(reaction);
      gameSubject.dispatchFailGame();
      const currentReaction = gameSubject.getCurrentReaction();
      expect(currentReaction.completedAt).toBeGreaterThan(1);
      expect(currentReaction.isGuessed).toEqual(false);
    });

    it('should generate and set new reaction with random duration', () => {
      gameSubject.setCurrentReaction(reaction);
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_COMPLETE_REACTION);
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
      gameSubject.setCurrentReaction(reaction);
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_ADD_GUESS);
      gameSubject.dispatchFailGame();

      expect(gameSubject.getCurrentReaction().completedAt).toBeGreaterThan(1);
      expect(gameSubject.getCurrentReaction().isGuessed).toEqual(false);
      expect(gameSubject.getCurrentGame().getIsOver()).toEqual(true);
    });
    it('should fail game automatically', () => {
      gameSubject.setCurrentReaction(reaction);
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);
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
      const shouldThrow = () => {
        gameSubject.dispatchAddGuess(6);
      };

      expect(shouldThrow).toThrowError();
      expect(events.includes(GameManagerEvent.DISPATCH_FAIL_GAME)).toEqual(
        true
      );
      gameSubject.unsubscribe(failedGameObserver);
    });

    it('should not add guess after game is over', () => {
      gameSubject.setCurrentReaction(reaction);
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);
      expect(() => {
        Array.from({ length: 10 }).map((_, i) =>
          gameSubject.dispatchAddGuess(i)
        );
      }).toThrowError();
    });

    it('should complete game if guess correctly', () => {
      gameSubject.setCurrentReaction(reaction);
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);
      const events: GameManagerEvent[] = [];

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
      gameSubject.setCurrentReaction(reaction);
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);

      gameSubject.dispatchAddGuess(reaction.duration);

      expect(gameSubject.getCurrentGame().getScore()).toBeGreaterThanOrEqual(1);
    });

    // TODO .may need to write converters or storage engine (TAKE A LOOK INTO AFTER FRONTEND WORKS)
    // -> game class and reaction class may need to take ids/keys to allow for this
    it('should generate and set new current reaction upon valid guess', () => {
      gameSubject.setCurrentReaction(reaction);
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);
      gameSubject.dispatchAddGuess(2000);
      expect(gameSubject.getCurrentReaction().id).toBe(reaction.id);
      gameSubject.dispatchAddGuess(reaction.duration);
      gameSubject.dispatchGenerateNewWithRandomDuration();

      expect(gameSubject.getCurrentReaction().id !== reaction.id).toEqual(true);
      expect(
        gameSubject.getCurrentGame().reactions[0].completedAt
      ).toBeGreaterThan(1);
      expect(gameSubject.getCurrentGame().reactions[0].isGuessed).toEqual(true);
    });

    it('should reset game', () => {
      gameSubject.setCurrentEvent(GameManagerEvent.DISPATCH_REACTION_END);
      gameSubject.setCurrentReaction(reaction);
      expect(() => {
        Array.from({
          length: 6,
        }).forEach(() =>
          gameSubject.dispatchAddGuess(
            gameSubject.getCurrentReaction().duration + -10000
          )
        );
      }).toThrowError();

      expect(gameSubject.getCurrentGame().reactions.length).toEqual(1);
      gameSubject.dispatchResetGame();
      expect(gameSubject.getCurrentGame().id !== game.id).toEqual(true);
      expect(gameSubject.getCurrentGame().reactions.length).toEqual(0);
    });
  });

  describe('reaction service', () => {
    it('should calculate guess correctly ', () => {
      gameSubject.setCurrentReaction(reaction);
      expect(
        gameSubject
          .getCurrentGame()
          .difficulty.guessIsValid(gameSubject, reaction.duration)
      ).toEqual('GUESS_VALID');
    });
  });

  describe('gameService', () => {
    it('should create new game', () => {
      const service = new GameService(gameSubject.mediator.getDifficulty());
      const newGame = service.createNewGame('as');

      expect(newGame.id !== game.id).toEqual(true);
      expect(newGame.isOver).toEqual(false);
      expect(newGame.reactions).toStrictEqual([]);
      expect(newGame.events).toStrictEqual([]);
    });
  });

  describe('full game loop', () => {
    it('should not fail', () => {
      // reaction 1
      gameSubject.setCurrentGame(
        new Game('', new EasyDifficultyStrategy(), 0, 0, '', [], [])
      );
      gameSubject.setCurrentReaction(reaction);

      const notYetAllowed = () => gameSubject.dispatchAddGuess(1);
      expect(notYetAllowed).toThrowError();
      gameSubject.dispatchStartingSequence();
      gameSubject.dispatchReactionStart();
      gameSubject.dispatchReactionEnd();

      const onCompleteObserver: Observer<GameManagerResponse<unknown>> = {
        id: 'tbd',
        update(eventName, response) {
          if (!isCompleteReactionResponse(response)) return;
          gameSubject.dispatchGenerateNewWithRandomDuration();
        },
      };
      gameSubject.subscribe(onCompleteObserver);
      gameSubject.dispatchAddGuess(reaction.duration);
      expect(gameSubject.getCurrentGame().getScore()).toEqual(1);

      // reaction 2
      const notYetAllowed2 = () => {
        gameSubject.dispatchReactionStart();
      };
      expect(notYetAllowed2).toThrow();
      gameSubject.dispatchStartingSequence();
      notYetAllowed2();
      gameSubject.dispatchStartingSequence();
      notYetAllowed2();
      gameSubject.dispatchReactionEnd();
      gameSubject.dispatchAddGuess(1);
      gameSubject.dispatchAddGuess(1);
      gameSubject.dispatchAddGuess(1);
      gameSubject.dispatchAddGuess(1);
      gameSubject.dispatchAddGuess(1);

      expect(() => {
        gameSubject.dispatchAddGuess(1);
      }).toThrowError();

      expect(gameSubject.getCurrentGame().isOver).toEqual(true);
      expect(gameSubject.getCurrentEvent()).toEqual(
        GameManagerEvent.DISPATCH_FAIL_GAME
      );
      // gameover -> reset
      gameSubject.dispatchSetName('pet');
      gameSubject.dispatchResetGame();
      gameSubject.dispatchGenerateNewWithRandomDuration();
      gameSubject.dispatchStartingSequence();
      gameSubject.dispatchReactionStart();
      gameSubject.dispatchReactionEnd();
      gameSubject.dispatchAddGuess(1);
    });
  });

  /*
  - DISPATCH_STARTING_SEQUENCE
    - DISPATCH_REACTION_START
      - DISPATCH_REACTION_END
        - DISPATCH_ADD_GUESS
          - DISPATCH_COMPLETE_REACTION
            - DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION
            
            ------- Start a new -------
              - DISPATCH_STARTING_SEQUENCE
                - DISPATCH_REACTION_START
                  - DISPATCH_REACTION_END
                    - DISPATCH_ADD_GUESS`
                      - DISPAtCH_COMPLETE_REACTION
                      - DISPATCH_FAIL_GAME

          - DISPATCH_FAIL_GAME
            - DISPATCH_SET_NAME
              - DISPATCH_RESET_GAME
                - DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION
                  
                ------- Start a new -------
                  - DISPATCH_STARTING_SEQUENCE
                    - DISPATCH_REACTION_START
                      - DISPATCH_REACTION_END
                        - DISPATCH_ADD_GUESS
  */
});
