import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GameDifficulty, IGame } from '@reaxion/common';
import mongoose, { HydratedDocument } from 'mongoose';
import { Reaction } from './reaction.schema';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game implements IGame {
  @Prop({ default: 0 })
  score: number;

  @Prop({ type: Number, enum: GameDifficulty })
  difficulty: GameDifficulty;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: 0 })
  failedAttempts: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction' }] })
  reactions: Reaction[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
