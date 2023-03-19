import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IGame } from '@reaxion/common/interfaces';
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
  async addSingle(game: IGame): Promise<Game> {
    const createdGame = await this.gameModel.create(game);
    return createdGame.save();
  }
}
