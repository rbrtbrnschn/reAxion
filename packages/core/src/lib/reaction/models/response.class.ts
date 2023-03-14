import { ResponseError } from '../errors/response-error.class';
import { IReactionState } from '../interfaces/state.interface';

export class Response<T> {
  readonly id: string;
  readonly data: T | undefined;
  readonly errors: ReadonlyArray<ResponseError> | undefined;
  constructor(
    id: string,
    public readonly state: IReactionState,
    data?: T,
    errors?: ReadonlyArray<ResponseError>
  ) {
    this.id = id;
    this.data = data;
    this.errors = errors;
  }
}
