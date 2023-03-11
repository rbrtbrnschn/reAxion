import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GuessStatus, IReaction, ReactionStatus } from '@reaxion/common';
import { HydratedDocument } from 'mongoose';
import uuid4 from 'uuid4';

export type ReactionDocument = HydratedDocument<Reaction>;

@Schema()
export class Reaction implements IReaction {
  @Prop()
  duration: number;

  @Prop({ type: [Number], default: [] })
  guesses: number[];

  @Prop({ default: false })
  isGuessed: boolean;

  @Prop({ default: 0 })
  failedAttempts: number;

  @Prop({ default: GuessStatus.IS_WAITING, type: Number, enum: GuessStatus })
  guessStatus: GuessStatus;

  @Prop({ default: ReactionStatus.HAS_NOT_STARTED, type: Number, enum: ReactionStatus })
  reactionStatus: ReactionStatus;

  @Prop({ default: uuid4() })
  _id: string;

  @Prop()
  startedAt?: number;

  @Prop()
  completedAt?: number;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
