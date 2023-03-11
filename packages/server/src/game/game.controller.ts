import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Post,
  Res,
} from '@nestjs/common';
import { IGame } from '@reaxion/common';
import { Response } from 'express';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}
  @Get('/')
  getAll() {
    return this.gameService.getAll();
  }

  @Post('/')
  addNew(@Body() game: IGame, @Res() res: Response) {
    if (!game) throw new NotAcceptableException();
    this.gameService.addSingle(game);
  }
}
