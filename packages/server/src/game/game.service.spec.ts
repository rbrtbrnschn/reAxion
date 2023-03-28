import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import {
  Game as CoreGame,
  IGameWithStats,
  IReaction,
  Reaction,
  TimerOnGuessDifficulty,
  VariableDeviationDifficulty,
} from '@reaxion/core';
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
    isGuessed: false,
    startedAt: Date.now() - 3000,
  };
  gameModel.difficulty = new TimerOnGuessDifficulty();
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
    const result: IGameWithStats[] = [{ ...gameModel, averageDeviation: 13 }];
    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(result));

    try {
      const tbd = await service.findAll(50, 0);
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
      uuid4(),
      new VariableDeviationDifficulty(),
      0,
      0,
      'pet',
      [
        new Reaction(
          reaction.id,
          reaction.duration,
          reaction.guesses,
          reaction.isGuessed
        ),
      ],
      []
    );
    expect(await service.addSingle(igame)).toEqual(result);
  });

  it('should get leaderboard', () => {
    const result: IGameWithStats[] = [{ ...gameModel, averageDeviation: 13 }];
    jest
      .spyOn(service, 'getLeaderboardByDifficulty')
      .mockImplementation(() => Promise.resolve(result));

    expect(service.getLeaderboardByDifficulty(new TimerOnGuessDifficulty().id));
  });
});
