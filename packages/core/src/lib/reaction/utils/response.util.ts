import { AddGuessResponse } from '../models/add-guess-response.class';
import { CommenceCountdownResponse } from '../models/commence-countdown-response.class';
import { Response } from '../models/response.class';

export function isAddGuessResponse(
  response: Response<any>
): response is AddGuessResponse {
  return (
    response.id === 'ADD_GUESS_RESPONSE' &&
    response.data !== undefined &&
    'status' in response.data
  );
}

export function isCommenceCountdownResponse(
  response: Response<any>
): response is CommenceCountdownResponse {
  return response.id === 'COMMENCE_COUTDOWN_RESPONSE';
}
