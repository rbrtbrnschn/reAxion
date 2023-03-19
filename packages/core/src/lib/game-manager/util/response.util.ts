import {
  AddGuessResponsePayload,
  GameManagerEvent,
  GameManagerGameEvent,
  IGameManagerState,
} from '../game-manager';

export class GameManagerResponse<T> {
  public readonly key: string = 'RESPONSE';
  public readonly id: string;
  constructor(
    public readonly state: IGameManagerState,
    public readonly event: GameManagerEvent | GameManagerGameEvent,
    public readonly payload: T
  ) {
    this.id = event + '_RESPONSE';
  }
}
export class EmptyGameManagerResponse extends GameManagerResponse<undefined> {
  public readonly key = 'EMPTY_RESPONSE';
  constructor(
    state: IGameManagerState,
    event: GameManagerEvent | GameManagerGameEvent
  ) {
    super(state, event, undefined);
  }
}
export class GameManagerResponsePayload<T> {
  public readonly key: string = 'RESPONSE_PAYLOAD';
  constructor(public readonly data: T) {}
}
function getResponseId(event: GameManagerEvent | GameManagerGameEvent) {
  return event + '_RESPONSE';
}

export function isStartingSequenceResponse(
  response: GameManagerResponse<unknown>
): response is GameManagerResponse<unknown> {
  return (
    response.id ===
    getResponseId(GameManagerGameEvent.DISPATCH_STARTING_SEQUENCE)
  );
}
export function isAddGuessResponse(
  response: GameManagerResponse<unknown>
): response is GameManagerResponse<AddGuessResponsePayload> {
  return response.id === getResponseId(GameManagerGameEvent.DISPATCH_ADD_GUESS);
}
export function isReactionStartResponse(
  response: GameManagerResponse<unknown>
): response is EmptyGameManagerResponse {
  return (
    response.id === getResponseId(GameManagerGameEvent.DISPATCH_REACTION_START)
  );
}
export function isReactionEndResponse(
  response: GameManagerResponse<unknown>
): response is EmptyGameManagerResponse {
  return (
    response.id === getResponseId(GameManagerGameEvent.DISPATCH_REACTION_END)
  );
}
export function isCompleteReactionResponse(
  response: GameManagerResponse<unknown>
): response is EmptyGameManagerResponse {
  return (
    response.id ===
    getResponseId(GameManagerGameEvent.DISPATCH_COMPLETE_REACTION)
  );
}
export function isGenerateNewWithRandomDurationResponse(
  response: GameManagerResponse<unknown>
): response is EmptyGameManagerResponse {
  return (
    response.id ===
    getResponseId(
      GameManagerGameEvent.DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION
    )
  );
}

export function isFailGameResponse(
  response: GameManagerResponse<unknown>
): response is EmptyGameManagerResponse {
  return response.id === getResponseId(GameManagerGameEvent.DISPATCH_FAIL_GAME);
}

export function isSetSettingsResponse(
  response: GameManagerResponse<unknown>
): response is EmptyGameManagerResponse {
  return response.id === getResponseId(GameManagerEvent.DISPATCH_SET_SETTINGS);
}
