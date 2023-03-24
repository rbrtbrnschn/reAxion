import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotAcceptableException,
  Post,
  Query,
} from '@nestjs/common';
import { IDifficulty, IGame, IGameWithStats } from '@reaxion/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}
  @Get('/')
  getAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('userId') userId: string
  ): Promise<IGame[]> {
    if (!limit) limit = 10;
    if (!offset) offset = 0;

    const TEMPORARY_MAX = 50;
    limit = limit > TEMPORARY_MAX ? TEMPORARY_MAX : limit;
    offset = offset || 0;

    return !userId
      ? this.gameService.findAll(limit, offset)
      : this.gameService.findAllByUser(limit, offset, userId);
  }

  @Get('/leaderboard')
  getLeaderboardByDifficultyId(
    @Query('difficulty') difficulty: IDifficulty['id']
  ): Promise<IGameWithStats[]> {
    if (!difficulty) throw new ForbiddenException();
    if (difficulty === 'undefined') throw new ForbiddenException();
    return this.gameService.getLeaderboardByDifficulty(difficulty);
  }

  @Get('/overview')
  getOverview(@Query('userId') userId: string): Promise<IGame | undefined> {
    if (!userId) throw new ForbiddenException();

    return this.gameService.findLastByUser(userId);
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
