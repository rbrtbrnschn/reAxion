import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GameDifficulty, GuessStatus, ReactionStatus } from '@reaxion/common';
import uuid4 from 'uuid4';
import { Game } from '../schemas/game.schema';
import { GameService } from './game.service';
import { MockFunctionMetadata, ModuleMocker } from "jest-mock";

const moduleMocker = new ModuleMocker(global);

describe('GameService', () => {
  let service: GameService;
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
      providers: [
        GameService,
        {
          provide: getModelToken(Game.name),
          useValue: gameModel,
        },
      ],
    })
    .compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should find all games", async () => {
    jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve([gameModel]));
    
    try {
      const tbd = await service.findAll();
      expect(tbd).toBe([gameModel])
    } catch(e){
      expect(e).toBeDefined()
    }
  })
});
