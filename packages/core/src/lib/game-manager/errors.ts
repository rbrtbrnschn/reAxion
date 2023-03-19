export class NoCurrentReactionError extends Error {
  constructor() {
    super('No Current Reaction Found.');
  }
}
export class NoPreviousReactionError extends Error {
  constructor() {
    super('No Previous Reaction Found.');
  }
}
export class NoCurrentGameError extends Error {
  constructor() {
    super('No Current Game Found.');
  }
}
export class NoCurrentGameEventError extends Error {
  constructor() {
    super('No Current Event Found.');
  }
}

export class UndefinedReactionError extends Error {
  constructor() {
    super('Reaction is undefined.');
  }
}
export class InvalidPermissionError extends Error {
  constructor(tbd: any) {
    super('Invalid Permissions. ' + tbd);
  }
}
