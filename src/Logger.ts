
export enum LogType {
  Error,
  Debug,
  Info,
  Log,
  Warn,
}

export interface ILoggerMessage {
  message: string;
  type: LogType;
}

export class LoggerClass {
  private lines: ILoggerMessage[];
  private chunkMatcher: RegExp;
  private counter: number;

  constructor(maxLength: number = 60) {
    this.chunkMatcher = new RegExp('(.{1,' + maxLength + '})', 'g');
    this.lines = [];
    this.counter = 0;
  }

  public log(msg: string) {
    console.log('[Application log] ', msg);
    this.add(msg, LogType.Log);
  }

  public clear() {
    this.lines = [];
  }

  public progress = () => {
    this.counter += 1;
  }

  public stop = () => {
    this.log('.'.repeat(this.counter));
    this.counter = 0;
  }

  public print() {
    let result = '';
    this.lines.forEach(message => {
      // TODO: implement coloring of message types
      result += `${message.message}\n`;
    });
    if (this.counter) {
      result += '.'.repeat(this.counter);
    }
    return result;
  }

  private format(msg: string) {
    return msg.split(this.chunkMatcher).filter(m=>m);
  }

  private add(msg: string, type: LogType) {
    const newLines: ILoggerMessage[] = [];
    this.format(msg).forEach(message => {
      newLines.push({
        message,
        type
      })
    });
    this.lines = [...this.lines, ...newLines];
  }
}

const Logger = new LoggerClass();

declare var window: {
  Logger: LoggerClass,
};
window.Logger = Logger;

export default Logger;
