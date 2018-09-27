import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import './App.css';

import ConsoleContainer from './console/ConsoleContainer';
import ControlsPanel from './controls/ControlsPanel';
import { ExerciseContainer } from './exercise/ExerciseContainer';
import {
  consoleError,
  consoleLog,
  consoleProgressEnd,
  consoleProgressStart,
} from './state/actions/console';
import { exerciseSelect } from './state/actions/exercise';
import { unityInit } from './state/actions/unity';
import { Callback, DataCallback, IUnityInstance } from './state/models/base';
import { IAppState, IControlsState } from './state/models/state';
import { getControls } from './state/selectors/controls';

const BASE_PATH = (process.env.REACT_APP_UNITY_PATH || 'https://nncms.s3-eu-central-1.amazonaws.com/assets/edison/exercises/brain');
const BUILD_PATH = BASE_PATH + '/Build';
// const LOADER_NAME = 'UnityLoader';
const CANVAS_ID = 'exercise';

declare var UnityLoader: any;
/*
declare var window: {
  appReady: () => void,
  engineReady: () => void,
  exerciseReady: () => void,
  completeExercise: (result: string) => void,
  exerciseFailed: (e: Error) => void,
};
*/
export interface Props extends IControlsState {
  onLog: DataCallback<string>;
  onError: DataCallback<string>;
  onStartTimer: Callback;
  onStopTimer: Callback;
  onStart: Callback;
  onNext: DataCallback<string>;
}

export interface State {
  configPath: string;
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
  public state: State = {
    configPath: `${BUILD_PATH}/Production.json`,
    progress: 0,
    start: false,
  }

  constructor(props: Props) {
    super(props);
    /*
    // app started handler
    window.appReady = this.appReady;
    // 'engine ready' handler
    window.engineReady = this.engineReady;
    // 'assets loaded' handler
    window.exerciseReady = this.exerciseReady;
    // exercise callbacks
    window.completeExercise = this.completeExercise;
    window.exerciseFailed = this.onError;
    */
  }

  public startTest = () => {
    this.setState({ start: true });
    /*
    const existingScript = document.getElementById('unity-loader');
    if (existingScript) {
      existingScript.parentNode!.removeChild(existingScript);
    }
    const script = document.createElement('script');
    const loaderPath = BUILD_PATH + '/' + LOADER_NAME + '.js?rnd=' + getCacheBuster();
    script.id = 'unity-loader';
    script.src = loaderPath;
    script.onload = this.onUnityInitialize;
    script.async = true;
    document.body.appendChild(script);
    this.props.onLog('Test started!');
    */
   this.props.onStart();
  }

  public stopTest = () => {
    this.props.onStopTimer();
    this.setState({ start: false });
    this.props.onLog('Stop!');
  }

  public onUnityProgress = (instance: IUnityInstance, progress: number) => {
    this.setState({ progress });
  }

  public onUnityInitialize = () => {
    this.props.onLog('UnityLoader onLoad called');
    // unity loader script loaded - ready to load engine
    const path = this.state.configPath + '?rnd=' + getCacheBuster();
    this.instance = UnityLoader.instantiate(CANVAS_ID, path, { onProgress: this.onUnityProgress });
    this.props.onStartTimer();
  }

  // 'app ready' handler called when core app loaded
  public appReady = () => {
    this.props.onStopTimer();
    this.props.onLog('appReady called');
    if (this.props.auto) {
      this.loadApp();
    }
  }

  // 'engine ready' handler called when engine finished loading
  public engineReady = () => {
    this.props.onStopTimer();
    this.props.onLog('engineReady called');
    if (this.props.auto) {
      this.loadExercise();
    }
  }

  // 'assets loaded' handler called when exercise assets were loaded
  public exerciseReady = () => {
    this.props.onStopTimer();
    this.props.onLog('exerciseReady called');
    if (this.props.auto) {
      this.startExercise();
    }
  }

  public loadApp = () => {
    this.appInit(this.props.config);
    this.props.onStartTimer();
  }

  public loadExercise = () => {
    this.exerciseInit(this.props.settings);
    this.props.onStartTimer();
  }

  public startExercise = () => {
    this.exerciseStart(this.props.options);
  }

  public completeExercise = (resultString: string) => {
    this.props.onLog(`completeExercise: ${resultString}`);
    const result = JSON.parse(resultString);
    if (result && result.name) {
      const next = result.name;
      this.props.onNext(next);
    }
  }

  public onError = (e: Error) => {
    this.props.onStopTimer();
    this.props.onError(`Error: ${e.message}`);
  }

  public componentDidCatch(e: Error) {
    this.onError(e);
  }

  public render() {
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
        <ExerciseContainer />
        <div className="exercise">
          <div id={CANVAS_ID} />
        </div>
        <ConsoleContainer />
      </div>
    );
  }

  // sending messages to game instance
  private sendMessage: (objectName: string, methodName: string, value: any) => void = (objectName, methodName, value) => {
    if (this.instance) {
      const params = typeof value === 'string' ? value : JSON.stringify(value);
      this.props.onLog(`calling SendMessage('${objectName}', '${methodName}', '${params}')`);
      this.instance.SendMessage(objectName, methodName, params);
    } else {
      this.props.onError('Error: Trying to send message to not initialized instance');
    }
  }

  // wrappers for internal exercises function calls
  private appInit = (config: any) => this.sendMessage('Main', 'InitializeApp', config);
  private exerciseInit = (settings: any) => this.sendMessage('Main', 'InitializeExercise', settings);
  private exerciseStart = (options: any) => this.sendMessage('Main', 'StartExercise', options);

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

export const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onLog: (msg: string) => {
      dispatch(consoleLog(msg));
    },
    onError: (msg: string) => {
      dispatch(consoleError(msg));
    },
    onStartTimer: () => {
      dispatch(consoleProgressStart());
    },
    onStopTimer: () => {
      dispatch(consoleProgressEnd());
    },
    onStart: () => {
      dispatch(unityInit());
    },
    onNext: (name: string) => {
      dispatch(exerciseSelect(name));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
