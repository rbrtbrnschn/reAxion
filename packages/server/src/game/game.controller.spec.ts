import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GameDifficulty, GuessStatus, ReactionStatus } from '@reaxion/common';
import uuid4 from 'uuid4';
import { Game, GameSchema } from '../schemas/game.schema';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let controller: GameController;
  const gameModel = new Game();
  gameModel.difficulty = GameDifficulty.MEDIUM;
  gameModel.failedAttempts = 3;
  gameModel.name = 'pet';
  gameModel.reactions = [
    {
      _id: uuid4(),
      duration: 213,
      failedAttempts: 3,
      guesses: [123, 123, 33],
      guessStatus: GuessStatus.IS_TOO_LOW,
      isGuessed: false,
      reactionStatus: ReactionStatus.IS_OVER,
      startedAt: Date.now() - 3000
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [GameService,{
        provide: getModelToken(Game.name),
        useValue: gameModel,
      },],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
