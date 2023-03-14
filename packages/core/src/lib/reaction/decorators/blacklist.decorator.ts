/**
 * Function only fires if state.currentEvent is excluded from blacklist.
 * @param events
 * @returns
 */
export function Blacklist(events: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const blacklist = [...events];
      //@ts-ignore
      if (blacklist.includes(this.state.currentEvent)) return;
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
