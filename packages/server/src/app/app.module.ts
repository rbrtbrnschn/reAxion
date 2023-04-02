import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';

import { MongooseModule } from '@nestjs/mongoose';
import { MatchModule } from '../match/match.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    GameModule,
    MatchModule,
    MongooseModule.forRoot(
      [
        process.env.MONGODB_ROOT_USERNAME,
        process.env.MONGODB_ROOT_PASSWORD,
      ].some((e) => e)
        ? `mongodb://${process.env.MONGODB_ROOT_USERNAME}:${process.env.MONGODB_ROOT_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGO_PORT}`
        : `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGO_PORT}`,
      {
        connectionFactory: (connection) => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        },
      }
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
