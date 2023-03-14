import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Post,
  Res,
} from '@nestjs/common';
import { IGame } from '@reaxion/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}
  @Get('/')
  getAll() {
    // @TODO pagination
    const TEMPORARY_MAX = 50;
    return this.gameService.findAll().then((games)=>games.slice(0,TEMPORARY_MAX));
  }

  @Post('/')
  async addNew(@Body() game: IGame) {
    if (!game) throw new NotAcceptableException();
    console.warn("server-gameController",game)
    const savedGame = await this.gameService.addSingle(game);
    return new Response(200, savedGame);
  }
}

class Response<T>{
  data: T;
  code: number;
  message: string
  constructor(code: number, data?: T, message?: string){
    this.data = data || {a:""} as T;
    this.code = code || 200;
    this.message = message || "";
  }
}