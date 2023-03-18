import {
  AddGuessResponsePayload,
  GameManagerEvent,
  IGameManagerState,
} from '../game-manager';

export class GameManagerResponse<T> {
  constructor(
    public readonly state: IGameManagerState,
    public readonly event: GameManagerEvent,
    public readonly payload: T
  ) {}
}
export class EmptyGameManagerResponse extends GameManagerResponse<undefined> {
  constructor(state: IGameManagerState, event: GameManagerEvent) {
    super(state, event, undefined);
  }
}
export class GameManagerResponsePayload<T> {
  public readonly id: string = 'RESPONE_PAYLOAD';
  constructor(public readonly data: T) {}
}

export function isAddGuessResponse(
  response: any
): response is GameManagerResponse<AddGuessResponsePayload> {
  return response.payload?.id === 'ADD_GUESS_RESPONSE_PAYLOAD';
}
