import { AddGuessResponseStatus } from '../enums/add-guess.enum';
import { ResponseId } from '../enums/response.enum';
import { ResponseError } from '../errors/response-error.class';
import { IReactionState } from '../interfaces/state.interface';
import { Response } from './response.class';

interface IAddGuessResponse {
  status: AddGuessResponseStatus;
}

export class AddGuessResponse extends Response<IAddGuessResponse> {
  readonly data: IAddGuessResponse;
  readonly errors: ReadonlyArray<ResponseError> | undefined;
  constructor(
    public readonly state: IReactionState,
    data: IAddGuessResponse,
    errors?: ReadonlyArray<ResponseError>
  ) {
    super(ResponseId.ADD_GUESS_RESPONSE, state, data, errors);
    this.data = data;
  }
}
