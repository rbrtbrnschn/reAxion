import { GuessStatus, ReactionStatus } from '@reaxion/common';
import { ConcreteMediator, GameMediator } from '../mediator.class';
import { IReactionState } from './interfaces/state.interface';
import { Reaction } from './reaction';
import exp = require('constants');

describe('Reaction', () => {
  let mediator: GameMediator;
  let reaction: Reaction;
  let state: IReactionState;

  beforeEach(() => {
    mediator = new ConcreteMediator();
    reaction = new Reaction(mediator);
    state = {
      guesses: [],
      duration: 1000,
      _id: '',
      guessStatus: GuessStatus.IS_WAITING,
      reactionStatus: ReactionStatus.HAS_NOT_STARTED,
      isGuessed: false,
      currentEvent: '',
    };
  });

  describe('getters', () => {
    // Tests for getters go here
    it('should initialize with default state', () => {
      expect(reaction._guesses).toEqual([]);
      expect(reaction['_duration']).toEqual(1000);
      expect(reaction['_id']).toEqual('');
      expect(reaction['_guessStatus']).toEqual(GuessStatus.IS_WAITING);
      expect(reaction['_reactionStatus']).toEqual(
        ReactionStatus.HAS_NOT_STARTED
      );
      expect(reaction['_isGuessed']).toEqual(false);
      expect(reaction['_startedAt']).toBeUndefined();
      expect(reaction['_completedAt']).toBeUndefined();
      expect(reaction['_currentEvent']).toEqual('');
    });
  });

  describe('setters', () => {
    // Tests for setters go here
    it('', () => {
      reaction.guesses = [1, 23];
      expect(reaction._guesses).toStrictEqual([1, 23]);
      reaction.duration = 123;
      expect(reaction._duration).toEqual(123);
      reaction.guessStatus = GuessStatus.IS_TOO_LOW;
      expect(reaction._guessStatus).toEqual(GuessStatus.IS_TOO_LOW);
      reaction.id = 'pet';
      expect(reaction._id).toEqual('pet');
      reaction.isGuessed = true;
      expect(reaction._isGuessed).toEqual(true);
      reaction.reactionStatus = ReactionStatus.IS_IN_PROGRESS;
      expect(reaction._reactionStatus).toEqual(ReactionStatus.IS_IN_PROGRESS);
      const now = Date.now();
      reaction.startedAt = now;
      reaction.completedAt = now;
      expect(reaction._completedAt).toEqual(now);
      expect(reaction._startedAt).toEqual(now);
    });
  });

  describe('dispatchCommenceCountdown', () => {
    // Tests for dispatchCommenceCountdown go here
  });

  describe('dispatchStart', () => {
    // Tests for dispatchStart go here
  });

  describe('dispatchStop', () => {
    // Tests for dispatchStop go here
  });

  describe('dispatchAddGuess', () => {
    // Tests for dispatchAddGuess go here
  });

  describe('dispatchComplete', () => {
    // Tests for dispatchComplete go here
  });

  describe('dispatchFailed', () => {
    // Tests for dispatchFailed go here
  });

  describe('dispatchReset', () => {
    // Tests for dispatchReset go here
  });

  describe('onNotification', () => {
    // Tests for onNotification go here
  });
});
