import * as React from 'react';
import './App.css';

const BASE_PATH = (process.env.REACT_APP_UNITY_PATH || 'https://nncms.s3-eu-central-1.amazonaws.com/assets/edison/exercises/brain') + '/Build';
const LOADER_NAME = 'UnityLoader';
const CANVAS_ID = 'exercise-canvas';

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

interface IAppState {
  auto: boolean;
  config: string;
  configPath: string;
  console: string;
  debug: string[];
  options: string;
  progress: number;
  settings: string;
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

class App extends React.Component<{}, IAppState> {
  public instance: IUnityInstance;
  public initTimer: any;
  public startTimer: any;
  public state: IAppState = {
    auto: true,
    config: '{ "language": "de" }',
    configPath: `${BASE_PATH}/Production.json`,
    console: '>',
    debug: [],
    options: '{ "difficulty": 0, "mode": "training" }',
    progress: 0,
    settings: '{ "id": 38, "name": "ColorCraze", "type": "X", "language": "de" }',
    start: false,
  }

  constructor(props: {}) {
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
    const loaderPath = BASE_PATH + '/' + LOADER_NAME + '.js?rnd=' + getCacheBuster();
    script.src = loaderPath;
    script.onload = this.onUnityInitialize;
    script.async = true;
    document.body.appendChild(script);
    this.log('Test started!');
  }

  public onUnityProgress = (instance: IUnityInstance, progress: number) => {
    this.setState({ progress });
  }

  public onUnityInitialize = () => {
    this.log('UnityLoader onLoad called');
    // unity loader script loaded - ready to load engine
    const path = this.state.configPath + '?rnd=' + getCacheBuster();
    this.instance = UnityLoader.instantiate(CANVAS_ID, path, { onProgress: this.onUnityProgress });
    this.initTimer = setInterval(this.progress, 500);
  }

  // 'app ready' handler called when core app loaded
  public appReady = () => {
    this.log('appReady called');
    clearInterval(this.initTimer);
    this.startTimer = setInterval(this.progress, 500);
    if (this.state.auto) {
      this.loadApp();
    }
  }

  // 'engine ready' handler called when engine finished loading
  public engineReady = () => {
    this.log('engineReady called');
    clearInterval(this.startTimer);
    clearInterval(this.initTimer);
    if (this.state.auto) {
      this.loadExercise();
    }
  }

  // 'assets loaded' handler called when exercise assets were loaded
  public exerciseReady = () => {
    this.log('exerciseReady called');
    clearInterval(this.startTimer);
    clearInterval(this.initTimer);
    if (this.state.auto) {
      this.startExercise();
    }
  }

  public loadApp = () => {
    this.appInit(this.state.config);
  }

  public loadExercise = () => {
    this.exerciseInit(this.state.settings);
  }

  public startExercise = () => {
    this.exerciseStart(this.state.options);
  }

  public completeExercise = (result: any) => {
    this.log(`completeExercise: ${JSON.stringify(result)}`);
  }

  public onError = (e: Error) => {
    this.log(`Error: ${e.message}`);
  }

  public componentDidCatch(e: Error) {
    this.onError(e);
  }

  public render() {
    const debug = this.state.debug.join('\n');
    const consoleContent = (debug ? debug + '\n' : '') + this.state.console;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">UnityLoader test</h1>
        </header>
        <div className="controls">
          <div className="controls-row">
            <label>auto execute: <input type="checkbox" checked={this.state.auto} onChange={this.handleCheckboxChange('auto')} /></label>&nbsp;
            <button onClick={this.startTest}>initialize</button>
          </div>
          <div className="controls-row">
            <label>app config: <input value={this.state.config} onChange={this.handleInputChange('config')} /></label>&nbsp;
            <button onClick={this.loadApp}>load app</button>
          </div>
          <div className="controls-row">
            <label>settings: <input value={this.state.settings} onChange={this.handleInputChange('settings')} /></label>&nbsp;
            <button onClick={this.loadExercise}>load exercise</button>
          </div>
          <div className="controls-row">
            <label>options: <input value={this.state.options} onChange={this.handleInputChange('options')} /></label>&nbsp;
            <button onClick={this.startExercise}>start exercise</button>
          </div>
        </div>
        <div className="progress-container">
          <div className="progress-handle" style={{ width: (this.state.progress * 100) + '%' }} />
        </div>
        <div className="unity">
          <canvas id={CANVAS_ID} />
        </div>
        <div className="debug">
          <textarea className="debug-console" rows={20} cols={80} onKeyPress={this.handleConsoleKey} onChange={this.handleConsoleChange} value={consoleContent} />
        </div>
      </div>
    );
  }

  private handleCheckboxChange = (input: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const statePart = {};
    statePart[input] = !!e.target.checked;
    this.setState(statePart);
  }

  private handleInputChange = (input: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const statePart = {};
    statePart[input] = e.target.value;
    this.setState(statePart);
  }

  private handleConsoleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const lines = e.target.value.split('\n');
    this.setState({ console: lines[lines.length - 1] });
  }

  private handleConsoleKey: React.KeyboardEventHandler<HTMLTextAreaElement> = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.charCode !== 13) {
      return;
    }
    const cmd = (`${this.state.console}`).slice(1);
    this.setState({ console: '>' });
    this.log(`Unknown command: ${cmd}`);
    e.stopPropagation();
    e.preventDefault();
  }

  private log = (msg: string) => {
    this.setState({
      debug: [...this.state.debug, msg],
    });
  }

  // sending messages to game instance
  private sendMessage: (objectName: string, methodName: string, value: any) => void = (objectName, methodName, value) => {
    if (this.instance) {
      const params = typeof value === 'string' ? value : JSON.stringify(value);
      this.log(`calling SendMessage('${objectName}', '${methodName}', '${params}')`);
      this.instance.SendMessage(objectName, methodName, params);
    } else {
      this.log('Error: Trying to send message to not initialized instance');
    }
  }

  // wrappers for internal exercises function calls
  private appInit = (config: any) => this.sendMessage('Main', 'InitializeApp', config);
  private exerciseInit = (settings: any) => this.sendMessage('Main', 'InitializeExercise', settings);
  private exerciseStart = (options: any) => this.sendMessage('Main', 'StartExercise', options);

  private progress = () => {
    const messages = [...this.state.debug];
    const msg = messages.pop();
    messages.push(msg + '.');
    this.setState({
      debug: [...messages],
    });
  }
}

export default App;
