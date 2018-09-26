export enum LogType {
  Error = 'ERROR',
  Debug = 'DEBUG',
  Info = 'INFO',
  Log = 'LOG',
  Warn = 'WARN',
}

export interface ILoggerMessage {
  type: LogType;
  message: string;
}
