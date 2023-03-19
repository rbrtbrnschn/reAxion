import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Post,
  Query,
} from '@nestjs/common';
import { IGame } from '@reaxion/common';
import { Game } from '../schemas/game.schema';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}
  @Get('/')
  getAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number
  ): Promise<Game[]> {
    if (!limit) limit = 10;
    if (!offset) offset = 0;

    const TEMPORARY_MAX = 50;
    limit = limit > TEMPORARY_MAX ? TEMPORARY_MAX : limit;
    offset = offset || 0;

    return this.gameService.findAll(limit, offset);
  }

  @Post('/')
  async addNew(@Body() game: IGame) {
    if (!game) throw new NotAcceptableException();
    const savedGame = await this.gameService.addSingle(game);
    return new Response(200, savedGame);
  }
}

export class Response<T> {
  code: number;
  data: T;
  message: string;
  constructor(code: number, data?: T, message?: string) {
    this.data = data || ({ a: '' } as T);
    this.code = code || 200;
    this.message = message || '';
  }
}
