export interface Middleware<T> {
  (context: T, next: () => T): T;
}

export class MiddlewareHandler<T> {
  private readonly middleware: Middleware<T>[];

  constructor(middleware: Middleware<T>[]) {
    this.middleware = middleware;
  }

  handle(context: T): T {
    const firstMiddleware = this.middleware[0];

    const finalMiddleware = this.middleware.reduceRight(
      //@ts-ignore
      (next, middleware) => () => middleware(context, next),
      () => context
    );

    return this.middleware.length
      ? //@ts-ignore
        firstMiddleware(context, finalMiddleware)
      : context;
  }
}
