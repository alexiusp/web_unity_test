import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import './App.css';

import ConsoleContainer from './console/ConsoleContainer';
import ControlsPanel from './controls/ControlsPanel';
import ExerciseContainer from './exercise/ExerciseContainer';
import { consoleError } from './state/actions/console';
import { DataCallback } from './state/models/base';

export interface Props {
  onError: DataCallback<string>;
}

class App extends React.Component<Props, {}> {

  public componentDidCatch(e: Error) {
    this.props.onError(`React crashed: ${e.message}`);
  }

  public render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">UnityLoader test</h1>
        </header>
        <div className="app-body">
          <ControlsPanel />
          <div className="progress-container">
            <div className="progress-bar" style={{ width: (0.1 * 100) + '%' }} />
          </div>
          <ExerciseContainer />
          <ConsoleContainer />
        </div>
      </div>
    );
  }
}

export const mapStateToProps = () => {
  return {
  };
}

export const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onError: (msg: string) => {
      dispatch(consoleError(msg));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
