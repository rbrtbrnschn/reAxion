export interface ILoggerService {
  log(...args: any): void;
  debug(...args: any): void;
  time(label: string): void;
  timeEnd(label: string): void;
  debugTime(label: string): void;
  debugTimeEnd(label: string): void;
}
class LoggerService implements ILoggerService {
  isDebug = process.env.REACT_APP_ENVIRONMENT === 'development';

  log(...args: any) {
    console.info(...args);
  }
  debug(...args: any): void {
    if (!this.isDebug) return;

    this.log('DEBUG:', ...args);
  }

  time(label: string): void {
    console.time(label);
  }
  timeEnd(label: string): void {
    console.timeEnd(label);
  }
  debugTime(label: string): void {
    if (!this.isDebug) return;
    this.time('DEBUG: ' + label);
  }
  debugTimeEnd(label: string): void {
    if (!this.isDebug) return;
    this.timeEnd('DEBUG: ' + label);
  }
}
export const loggerService = new LoggerService();
