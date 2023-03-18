import {
  NoCurrentReactionError,
  NoPreviousReactionError,
  UndefinedReactionError,
} from '../errors';
import { GameManagerEvent } from '../game-manager';
import { Reaction } from '../reaction/reaction';
import { IDifficulty } from '../settings/settings.interface';

export class Game {
  public readonly key = 'GAME_CLASS';
  public isOver: boolean;
  constructor(
    public readonly difficulty: IDifficulty,
    private failedAttempts: number,
    private score: number,
    public readonly _id: string,
    public reactions: Reaction[],
    public events: GameManagerEvent[]
  ) {
    this.isOver = false;
  }
  public setCurrentReaction(reaction: Reaction): Game {
    if (!reaction) throw new UndefinedReactionError();
    this.reactions.push(reaction);
    return this;
  }
  public getCurrentReaction() {
    const reactions = [...this.reactions];
    const currentReaction = reactions.pop();
    if (!currentReaction) throw new NoCurrentReactionError();

    return currentReaction;
  }
  public getPreviousReaction(): Reaction {
    const reactions = [...this.reactions];
    const currentReaction = reactions.pop();
    if (!currentReaction) throw new NoCurrentReactionError();

    const previousReaction = reactions.pop();
    if (!previousReaction) throw new NoPreviousReactionError();

    return previousReaction;
  }

  public getFailedAttempts() {
    return this.failedAttempts;
  }
  public setFailedAttempts(failedAttempts: number): Game {
    this.failedAttempts = failedAttempts;
    return this;
  }
  public getScore() {
    return this.score;
  }
  public setScore(score: number): Game {
    this.score = score;
    return this;
  }
  public getIsOver() {
    return this.isOver;
  }
  public setIsOver() {
    this.isOver = true;
  }
  public getEvents() {
    return this.events;
  }
  public setEvents(events: GameManagerEvent[]) {
    this.events = events;
  }
}
