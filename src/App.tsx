import * as React from 'react';
import './App.css';

const BASE_PATH = 'https://d2ynczlew6xd8m.cloudfront.net/webUnityExercises/edison_ob';
const LOADER_NAME = 'UnityLoader';
const CANVAS_ID = 'exercise-canvas';

declare var UnityLoader: any;
declare var window: {
  initGame: () => void,
  engineReady: () => void,
  finishLoading: () => void,
  exerciseReady: () => void,
  completeExercise: (result: any) => void,
  exerciseFailed: (e: Error) => void,
};

interface IUnityInstance {
  SendMessage: (objectName: string, methodName: string, value: string) => void,
};

interface IAppState {
  configPath: string;
  console: string;
  debug: string[];
  options: string;
  settings: string;
  start: boolean;
}

class App extends React.Component<{}, IAppState> {
  public instance: IUnityInstance;
  public initTimer: any;
  public state: IAppState = {
    configPath: 'https://d2ynczlew6xd8m.cloudfront.net/webUnityExercises/edison_ob/main_out.json',
    console: '>',
    debug: [],
    options: '{ difficulty: 0, mode: "training" }',
    settings: '{ id: 38, name: "ColorCraze", type: "X", language: "de" }',
    start: false,
  }

  constructor(props: {}) {
    super(props);
    // 'engine ready' handler
    window.initGame = this.initExercise;
    // new name for this handler
    window.engineReady = this.initExercise;
    // 'assets loaded' handler
    window.finishLoading = this.exerciseReady;
    // new name for this handler
    window.exerciseReady = this.exerciseReady;
    // exercise callbacks
    window.completeExercise = this.completeExercise;
    window.exerciseFailed = this.onError;
  }

  public startTest = () => {
    this.setState({ start: true });
    const script = document.createElement('script');
    const loaderPath = BASE_PATH + '/' + LOADER_NAME + '.js';
    script.src = loaderPath;
    script.onload = this.onUnityInitialize;
    script.async = true;
    document.body.appendChild(script);
    this.log('App started!');
  }
  
  public onUnityInitialize = () => {
    this.log('UnityLoader onLoad called');
    // unity loader script loaded - ready to load engine
    this.instance = UnityLoader.instantiate(CANVAS_ID, this.state.configPath);
    this.initTimer = setInterval(() => {
      const messages = [...this.state.debug];
      const msg = messages.pop();
      messages.push(msg + '.');
      this.setState({
        debug: [...messages],
      });
    }, 500);
  }

  // 'engine ready' handler called when engine finished loading
  public initExercise = () => {
    this.log('initExercise called');
    clearInterval(this.initTimer);
    this.exerciseInit(this.state.settings);
  }

  // 'assets loaded' handler called when exercise assets were loaded
  public exerciseReady = () => {
    this.log('exerciseReady called');
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
            <label>config path: <input value={this.state.configPath} onChange={this.handleInputChange('configPath')} /></label>&nbsp;
            <button onClick={this.startTest}>init</button>
          </div>
          <div className="controls-row">
            <label>settings: <input value={this.state.settings} onChange={this.handleInputChange('settings')} /></label>&nbsp;
            <label>options: <input value={this.state.options} onChange={this.handleInputChange('options')} /></label>&nbsp;
            <button onClick={this.startExercise}>start exercise</button>
          </div>
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
  private exerciseInit = (settings: any) => this.sendMessage('Main', 'Initialize', settings);
  private exerciseStart = (options: any) => this.sendMessage('Main', 'StartExercise', options);

}

export default App;
