import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';

import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    GameModule,
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_ROOT_USERNAME}:${process.env.MONGODB_ROOT_PASSWORD}@mongodb:${process.env.MONGO_PORT}`,
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
