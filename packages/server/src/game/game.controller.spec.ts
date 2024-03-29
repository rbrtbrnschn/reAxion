import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { EasyDifficultyStrategy } from '@reaxion/core';
import { v4 as uuid4 } from 'uuid';
import { Game } from '../schemas/game.schema';
import { GameController, Response } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let controller: GameController;
  const gameModel = new Game();
  gameModel.difficulty = new EasyDifficultyStrategy();
  gameModel.failedAttempts = 3;
  gameModel.name = 'pet';
  gameModel.reactions = [
    {
      id: uuid4(),
      duration: 213,
      guesses: [123, 123, 33],
      isGuessed: false,
      startedAt: Date.now() - 3000,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        GameService,
        {
          provide: getModelToken(Game.name),
          useValue: gameModel,
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all', async () => {
    const result = [gameModel];
    jest
      .spyOn(controller, 'getAll')
      .mockImplementation(() => Promise.resolve(result));
    expect(await controller.getAll(50, 0, uuid4())).toEqual(result);
  });

  it('should add new', async () => {
    const result = new Response(200, gameModel);
    jest
      .spyOn(controller, 'addNew')
      .mockImplementation(() => Promise.resolve(result));

    expect(await controller.addNew(gameModel)).toEqual(result);
  });
});
