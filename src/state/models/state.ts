export interface IControlsState {
  auto: boolean;
  config: string;
  options: string;
  settings: string;
  start: boolean;
}

export interface IAppState {
  controls: IControlsState;
}
