import { ResponseId } from '../enums/response.enum';
import { ResponseError } from '../errors/response-error.class';
import { IReactionState } from '../interfaces/state.interface';
import { Response } from './response.class';

export class CommenceCountdownResponse extends Response<Record<string, never>> {
  readonly data: undefined;
  readonly errors: ReadonlyArray<ResponseError> | undefined;
  constructor(
    public readonly state: IReactionState,
    errors?: ReadonlyArray<ResponseError>
  ) {
    super(ResponseId.COMMENCE_COUNTDOWN_RESPONSE, state, {}, errors);
  }
}
