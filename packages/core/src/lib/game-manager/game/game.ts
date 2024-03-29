import { IGame } from '../../interfaces/game.interface';
import { DifficultyStrategy } from '../../settings-manager/modules/difficulty/difficulty';
import {
  NoCurrentReactionError,
  NoPreviousReactionError,
  UndefinedReactionError,
} from '../errors';
import { GameManagerEvent } from '../game-manager';
import { BaseReaction, Reaction } from '../reaction/reaction';

export class Game implements IGame {
  public readonly key = 'GAME_CLASS';
  public isOver: boolean;
  public startedAt?: number | undefined;
  public endedAt?: number | undefined;
  constructor(
    public readonly userId: string,
    public readonly difficulty: DifficultyStrategy,
    public failedAttempts: number,
    public score: number,
    public readonly id: string,
    public reactions: BaseReaction[],
    public events: GameManagerEvent[],
    public name?: string
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
  public setName(name: string) {
    if (!name) throw new NoNameError();
    this.name = name;
    return this;
  }
  public getName() {
    return this.name;
  }
  public getEvents() {
    return this.events;
  }
  public setEvents(events: GameManagerEvent[]) {
    this.events = events;
  }
  public setStartedAt(date: number) {
    this.startedAt = date;
  }
  public setEndedAt(date: number) {
    this.endedAt = date;
  }
}

class NoNameError extends Error {
  constructor() {
    super('No Name Found.');
  }
}
