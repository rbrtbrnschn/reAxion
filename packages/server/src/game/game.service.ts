import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IDifficulty, IGame } from '@reaxion/common/interfaces';
import { Model } from 'mongoose';
import { Game, GameDocument } from '../schemas/game.schema';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async findAll(limit: number, offset: number): Promise<Game[]> {
    return this.gameModel.find().skip(offset).limit(limit).exec();
  }
  async findAllByUser(
    limit: number,
    offset: number,
    userId: string
  ): Promise<Game[]> {
    return this.gameModel.find({ userId }).skip(offset).limit(limit).exec();
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
  ): Promise<IGame[]> {
    return this.gameModel.aggregate([
      { $match: { 'difficulty.id': difficulty } },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: '$userId',
          doc: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
    ]);
  }
}
