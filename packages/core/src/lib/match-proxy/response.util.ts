export class MatchGatewayResponse {
  constructor(
    public readonly status: MatchStatus,
    public readonly data: MatchState
  ) {}
}

export enum MatchStatus {
  WAITING = 'WAITING',
  READY = 'READY',
  NOT_READY = 'NOT_READY',
  INCREASE_SCORE = 'INCREASE_SCORE',
  END = 'END',
  LEFT_ROOM = 'LEFT_ROOM',
  NO_ROOM_FOUND = 'NO_ROOM_FOUND',
}
export enum MatchEvent {
  JOIN_ROOM = 'match:join-room',
  LEAVE_ROOM = 'match:leave-room',
  READY = "'match:ready'",
  INCREASE_SCORE = 'match:increase-score',
  END = 'match:end',
}

export interface MatchState {
  [userId: string]: number;
}
