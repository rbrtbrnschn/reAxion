import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GameDifficulty, GuessStatus, IGame, IReaction, ReactionStatus } from '@reaxion/common';
import { HydratedDocument } from 'mongoose';
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

  @Prop({ raw: [{
    _id: {type: String},
    duration: { type: Number },
    guesses: [{ type: Number }],
    isGuessed: {type: Boolean},
    guessStatus: { type: Number, enum: GuessStatus, default: GuessStatus.IS_WAITING },
    reactionStatus: {type: Number, enum: ReactionStatus, default: ReactionStatus.HAS_NOT_STARTED },
    startedAt: { type: Number, required: true },
    completedAt: { type: Number, required: false}
  }]})
  reactions: IReaction[];
}

export const GameSchema = SchemaFactory.createForClass(Game);