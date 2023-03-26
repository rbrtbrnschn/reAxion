import {
  AddGuessResponsePayload,
  GameManagerEvent,
  IGameManagerState,
  SetExtraPayload,
} from '../game-manager';

export class GameManagerResponse<T> {
  public readonly key: string = 'RESPONSE';
  public readonly id: string;
  constructor(
    public readonly state: IGameManagerState,
    public readonly event: GameManagerEvent,
    public readonly payload: T
  ) {
    this.id = event + '_RESPONSE';
  }
}
export class EmptyGameManagerResponse extends GameManagerResponse<undefined> {
  public readonly key = 'EMPTY_RESPONSE';
  constructor(state: IGameManagerState, event: GameManagerEvent) {
    super(state, event, undefined);
  }
}
export class GameManagerResponsePayload<T> {
  public readonly key: string = 'RESPONSE_PAYLOAD';
  constructor(public readonly data: T) {}
}
function getResponseId(event: GameManagerEvent) {
  return event + '_RESPONSE';
}

export function isStartingSequenceResponse(
  response: GameManagerResponse<unknown>
): response is GameManagerResponse<unknown> {
  return (
    response.id === getResponseId(GameManagerEvent.DISPATCH_STARTING_SEQUENCE)
  );
}
export function isAddGuessResponse(
  response: GameManagerResponse<unknown>
): response is GameManagerResponse<AddGuessResponsePayload> {
  return response.id === getResponseId(GameManagerEvent.DISPATCH_ADD_GUESS);
}
export function isReactionStartResponse(
  response: GameManagerResponse<unknown>
): response is EmptyGameManagerResponse {
  return (
    response.id === getResponseId(GameManagerEvent.DISPATCH_REACTION_START)
  );
}
export function isReactionEndResponse(
  response: GameManagerResponse<unknown>
): response is EmptyGameManagerResponse {
  return response.id === getResponseId(GameManagerEvent.DISPATCH_REACTION_END);
}
export function isCompleteReactionResponse(
  response: GameManagerResponse<unknown>
): response is EmptyGameManagerResponse {
  return (
    response.id === getResponseId(GameManagerEvent.DISPATCH_COMPLETE_REACTION)
  );
}
export function isGenerateNewWithRandomDurationResponse(
  response: GameManagerResponse<unknown>
): response is EmptyGameManagerResponse {
  return (
    response.id ===
    getResponseId(GameManagerEvent.DISPATCH_GENERATE_NEW_WITH_RANDOM_DURATION)
  );
}

export function isFailGameResponse(
  response: GameManagerResponse<unknown>
): response is EmptyGameManagerResponse {
  return response.id === getResponseId(GameManagerEvent.DISPATCH_FAIL_GAME);
}

export function isSetExtraResponse(
  response: GameManagerResponse<unknown>
): response is GameManagerResponse<SetExtraPayload> {
  return response.id === getResponseId(GameManagerEvent.DISPATCH_SET_EXTRA);
}
