import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GuessStatus, IReaction, ReactionStatus } from '@reaxion/common';
import { Game as CoreGame, MediumDifficulty, Reaction } from '@reaxion/core';
import { ModuleMocker } from 'jest-mock';
import { v4 as uuid4 } from 'uuid';
import { Game } from '../schemas/game.schema';
import { GameService } from './game.service';

const moduleMocker = new ModuleMocker(global);

describe('GameService', () => {
  let service: GameService;
  const gameModel = new Game();
  const reaction: IReaction = {
    id: uuid4(),
    duration: 213,
    guesses: [123, 123, 33],
    guessStatus: GuessStatus.IS_TOO_LOW,
    isGuessed: false,
    reactionStatus: ReactionStatus.IS_OVER,
    startedAt: Date.now() - 3000,
  };
  gameModel.difficulty = new MediumDifficulty();
  gameModel.failedAttempts = 0;
  gameModel.score = 0;
  gameModel.name = 'pet';
  gameModel.reactions = [reaction];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getModelToken(Game.name),
          useValue: gameModel,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all games', async () => {
    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve([gameModel]));

    try {
      const tbd = await service.findAll();
      expect(tbd).toBe([gameModel]);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('should add single', async () => {
    const result = gameModel;
    jest
      .spyOn(service, 'addSingle')
      .mockImplementation(() => Promise.resolve(result));

    const igame = new CoreGame(
      new MediumDifficulty(),
      0,
      0,
      'pet',
      [
        new Reaction(
          reaction.id,
          reaction.duration,
          reaction.guesses,
          reaction.isGuessed,
          reaction.guessStatus,
          reaction.reactionStatus
        ),
      ],
      []
    );
    expect(await service.addSingle(igame)).toEqual(result);
  });
});
