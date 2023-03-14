export class ResponseError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'ResponseError';
  }
}

export class NotFoundError extends ResponseError {
  constructor(message: string) {
    super('NOT_FOUND', message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ResponseError {
  constructor(message: string) {
    super('UNAUTHORIZED', message);
    this.name = 'UnauthorizedError';
  }
}
