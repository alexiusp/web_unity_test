import * as React from 'react';
import { connect } from 'react-redux';

import ControlsPanel from './controls/ControlsPanel';
import Logger from './Logger';
import { IAppState, IControlsState } from './state/models/state';
import { getControls } from './state/selectors/controls';

import './App.css';

const BASE_PATH = (process.env.REACT_APP_UNITY_PATH || 'https://nncms.s3-eu-central-1.amazonaws.com/assets/edison/exercises/brain');
const BUILD_PATH = BASE_PATH + '/Build';
const LOADER_NAME = 'UnityLoader';
const CANVAS_ID = 'exercise';

declare var UnityLoader: any;
declare var window: {
  appReady: () => void,
  engineReady: () => void,
  exerciseReady: () => void,
  completeExercise: (result: any) => void,
  exerciseFailed: (e: Error) => void,
};

interface IUnityInstance {
  SendMessage: (objectName: string, methodName: string, value: string) => void,
};

type Props = IControlsState;
/*
export interface Props extends IControlsState {
}
*/
export interface State {
  configPath: string;
  console: string;
  counter: number;
  progress: number;
  start: boolean;
}

const cacheBusterDict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function getCacheBuster() {
  let text = '';
  for (let index = 0; index < 3; index++) {
    text += cacheBusterDict.charAt(Math.floor(Math.random() * cacheBusterDict.length));
  }
  return text;
}

class App extends React.Component<Props, State> {
  public instance: IUnityInstance;
  public initTimer: any;
  public startTimer: any;
  public state: State = {
    configPath: `${BUILD_PATH}/Production.json`,
    console: '>',
    counter: 0,
    progress: 0,
    start: false,
  }

  constructor(props: Props) {
    super(props);
    // app started handler
    window.appReady = this.appReady;
    // 'engine ready' handler
    window.engineReady = this.engineReady;
    // 'assets loaded' handler
    window.exerciseReady = this.exerciseReady;
    // exercise callbacks
    window.completeExercise = this.completeExercise;
    window.exerciseFailed = this.onError;
  }

  public startTest = () => {
    this.setState({ start: true });
    const script = document.createElement('script');
    const loaderPath = BUILD_PATH + '/' + LOADER_NAME + '.js?rnd=' + getCacheBuster();
    script.src = loaderPath;
    script.onload = this.onUnityInitialize;
    script.async = true;
    document.body.appendChild(script);
    Logger.log('Test started!');
  }

  public stopTest = () => {
    this.stopTimers();
    this.setState({ start: false });
    Logger.log('Stop!');
  }

  public onUnityProgress = (instance: IUnityInstance, progress: number) => {
    this.setState({ progress });
  }

  public onUnityInitialize = () => {
    Logger.log('UnityLoader onLoad called');
    // unity loader script loaded - ready to load engine
    const path = this.state.configPath + '?rnd=' + getCacheBuster();
    this.instance = UnityLoader.instantiate(CANVAS_ID, path, { onProgress: this.onUnityProgress });
    this.initTimer = setInterval(this.onTimer, 500);
  }

  // 'app ready' handler called when core app loaded
  public appReady = () => {
    this.stopTimers();
    Logger.log('appReady called');
    this.startTimer = setInterval(this.onTimer, 500);
    if (this.props.auto) {
      this.loadApp();
    }
  }

  // 'engine ready' handler called when engine finished loading
  public engineReady = () => {
    this.stopTimers();
    Logger.log('engineReady called');
    if (this.props.auto) {
      this.loadExercise();
    }
  }

  // 'assets loaded' handler called when exercise assets were loaded
  public exerciseReady = () => {
    this.stopTimers();
    Logger.log('exerciseReady called');
    if (this.props.auto) {
      this.startExercise();
    }
  }

  public loadApp = () => {
    this.appInit(this.props.config);
  }

  public loadExercise = () => {
    this.exerciseInit(this.props.settings);
  }

  public startExercise = () => {
    this.exerciseStart(this.props.options);
  }

  public completeExercise = (result: any) => {
    Logger.log(`completeExercise: ${JSON.stringify(result)}`);
  }

  public onError = (e: Error) => {
    this.stopTimers();
    Logger.log(`Error: ${e.message}`);
  }

  public componentDidCatch(e: Error) {
    this.onError(e);
  }

  public render() {
    const debug = Logger.print();
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">UnityLoader test</h1>
        </header>
        <ControlsPanel
          onStart={this.startTest}
          onStop={this.stopTest}
          onInitializeApp={this.loadApp}
          onInitializeExercise={this.loadExercise}
          onStartExercise={this.startExercise}
        />
        <div className="progress-container">
          <div className="progress-bar" style={{ width: (this.state.progress * 100) + '%' }} />
        </div>
        <div className="exercise">
          <div id={CANVAS_ID} />
        </div>
        <div className="debug">
          <pre className="debug-console">{debug}</pre>
          <input id="debug-input" className="debug-input" type="text" value={this.state.console} onKeyPress={this.handleConsoleKey} onChange={this.handleConsoleChange} />
        </div>
      </div>
    );
  }

  private handleConsoleChange: React.ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.stopPropagation();
    // e.preventDefault();
    const lines = e.target.value.split('\n');
    this.setState({ console: lines[lines.length - 1] });
  }

  private handleConsoleKey: React.KeyboardEventHandler<HTMLInputElement> = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode !== 13) {
      return;
    }
    const cmd = (`${this.state.console}`).slice(1);
    this.setState({ console: '>' });
    Logger.log(`Unknown command: ${cmd}`);
    // e.stopPropagation();
    // e.preventDefault();
  }

  // sending messages to game instance
  private sendMessage: (objectName: string, methodName: string, value: any) => void = (objectName, methodName, value) => {
    if (this.instance) {
      const params = typeof value === 'string' ? value : JSON.stringify(value);
      Logger.log(`calling SendMessage('${objectName}', '${methodName}', '${params}')`);
      this.instance.SendMessage(objectName, methodName, params);
    } else {
      Logger.log('Error: Trying to send message to not initialized instance');
    }
  }

  // wrappers for internal exercises function calls
  private appInit = (config: any) => this.sendMessage('Main', 'InitializeApp', config);
  private exerciseInit = (settings: any) => this.sendMessage('Main', 'InitializeExercise', settings);
  private exerciseStart = (options: any) => this.sendMessage('Main', 'StartExercise', options);

  private onTimer = () => {
    this.setState({ counter: this.state.counter + 1 });
    Logger.progress();
  }

  private stopTimers = () => {
    this.setState({ counter: 0 });
    clearInterval(this.startTimer);
    clearInterval(this.initTimer);
    Logger.stop();
  }

}

export const mapStateToProps = (state: IAppState) => {
  const { auto, config, options, settings, start } = getControls(state);
  return {
    auto,
    config,
    options,
    settings,
    start,
  };
}

export default connect(mapStateToProps)(App);
