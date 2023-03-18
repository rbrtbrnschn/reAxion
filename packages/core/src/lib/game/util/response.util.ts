import { AddGuessResponsePayload, Response } from '../game.subject';

export function isAddGuessResponse(
  response: any
): response is Response<AddGuessResponsePayload> {
  return response.payload?.id === 'ADD_GUESS_RESPONSE_PAYLOAD';
}
