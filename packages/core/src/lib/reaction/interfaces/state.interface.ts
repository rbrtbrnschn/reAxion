import { IReaction } from '@reaxion/common';

export interface IReactionState extends IReaction {
  currentEvent: string;
}
