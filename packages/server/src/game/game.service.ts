import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IDifficulty, IGame, IGameWithStats } from '@reaxion/common/interfaces';
import { GameProcessingService } from '@reaxion/core';
import { Model } from 'mongoose';
import { Game, GameDocument } from '../schemas/game.schema';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async findAll(limit: number, offset: number): Promise<IGameWithStats[]> {
    const games = await this.gameModel.find().skip(offset).limit(limit).exec();
    return games.map((game) => ({
      ...game,
      averageDeviation: new GameProcessingService(game).getAverageDeviation(),
    }));
  }
  async findAllByUser(
    limit: number,
    offset: number,
    userId: string
  ): Promise<IGameWithStats[]> {
    const games = await this.gameModel
      .find({ userId })
      .skip(offset)
      .limit(limit)
      .exec();
    return games.map((game) => {
      const gameWithStats = {
        ...game.toObject(),
        averageDeviation: new GameProcessingService(game).getAverageDeviation(),
      };
      return gameWithStats;
    });
  }

  async findLastByUser(userId: string): Promise<IGame | undefined> {
    return this.gameModel.findOne({ userId }).sort({ _id: -1 }).exec();
  }
  async addSingle(game: IGame): Promise<Game> {
    const createdGame = await this.gameModel.create(game);
    return createdGame.save();
  }

  async getLeaderboardByDifficulty(
    difficulty: IDifficulty['id']
  ): Promise<IGameWithStats[]> {
    const games = (await this.gameModel.aggregate([
      { $match: { 'difficulty.id': difficulty } },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: '$userId',
          doc: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
    ])) as IGame[];

    return games.map((game) => {
      return {
        ...game,
        averageDeviation: new GameProcessingService(game).getAverageDeviation(),
      };
    }) as IGameWithStats[];
  }
}
