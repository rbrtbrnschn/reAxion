import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  GuessStatus,
  IDifficulty,
  IGame,
  IReaction,
  ReactionStatus,
} from '@reaxion/common';
import mongoose, { HydratedDocument } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game implements IGame {
  @Prop({ default: 0 })
  score: number;

  @Prop({
    type: Object,
    raw: {
      id: String,
      deviation: Number,
      maxFailedAttempts: Number,
      maxDuration: Number,
    },
  })
  difficulty: IDifficulty;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: 0 })
  failedAttempts: number;

  @Prop({
    raw: [
      {
        _id: { type: String },
        duration: { type: Number },
        guesses: [{ type: Number }],
        isGuessed: { type: Boolean },
        guessStatus: {
          type: Number,
          enum: GuessStatus,
          default: GuessStatus.IS_WAITING,
        },
        reactionStatus: {
          type: Number,
          enum: ReactionStatus,
          default: ReactionStatus.HAS_NOT_STARTED,
        },
        startedAt: { type: Number, required: true },
        completedAt: { type: Number, required: false },
      },
    ],
  })
  reactions: IReaction[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
GameSchema.plugin(mongoosePaginate);

export const gameModel = mongoose.model<
  GameDocument,
  mongoose.PaginateModel<GameDocument>
>('Game', GameSchema, 'game');
