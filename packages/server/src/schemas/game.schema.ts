import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DifficultyStrategy, IGame, IReaction } from '@reaxion/core';
import { HydratedDocument } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game implements IGame {
  @Prop({ default: 0 })
  score: number;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: false, default: Date.now })
  createdAt: Date;

  @Prop({
    type: Object,
    raw: {
      id: String,
      key: String,
      name: String,
      version: String,
    },
  })
  difficulty: DifficultyStrategy;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: 0 })
  failedAttempts: number;

  @Prop({ required: true, type: Number })
  startedAt: number;

  @Prop({ required: true, type: Number })
  endedAt: number;

  @Prop({
    raw: [
      {
        _id: { type: String },
        duration: { type: Number },
        guesses: [
          {
            type: raw({ guess: { type: Number }, createdAt: { type: Number } }),
          },
        ],
        isGuessed: { type: Boolean },
        startedAt: { type: Number, required: true },
        completedAt: { type: Number, required: false },
      },
    ],
  })
  reactions: IReaction[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
