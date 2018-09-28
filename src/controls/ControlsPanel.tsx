import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import './ControlsPanel.css';

import { consoleLog } from '../state/actions/console';
import { controlsAutoUpdate, controlsConfigUpdate, controlsOptionsUpdate, controlsSettingsUpdate } from '../state/actions/controls';
import {
  unityAppInit,
  unityExerciseInit,
  unityExerciseStart,
  unityInit,
  unityStop,
} from '../state/actions/unity';
import { Callback, DataCallback } from '../state/models/base';
import { IAppState, IControlsState } from '../state/models/state';
import { getControls } from '../state/selectors/controls';

export interface Props extends IControlsState {
  onAutoChange: Callback;
  onConfigChange: DataCallback<string>;
  onSettingsChange: DataCallback<string>;
  onOptionsChange: DataCallback<string>;
  onStart: Callback;
  onStop: Callback;
  onInitializeApp: Callback;
  onInitializeExercise: Callback;
  onStartExercise: Callback;
}

export function ControlsPanel(props: Props) {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.name;
    const handlerName = `on${input}Change`;
    const value = e.target.value;
    props[handlerName](value);
  };
  return (
    <div className="controls">
      <div className="row">
        <div className="col">
          <label>app config: <textarea name="Config" value={props.config} onChange={handleInputChange} /></label>
        </div>
        <div className="col">
          <label>settings: <textarea name="Settings" value={props.settings} onChange={handleInputChange} /></label>
        </div>
        <div className="col">
          <label>options: <textarea name="Options" value={props.options} onChange={handleInputChange} /></label>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <label>auto execute: <input name="auto" type="checkbox" checked={props.auto} onChange={props.onAutoChange} /></label>
        </div>
        <div className="col">
          <button onClick={props.onStart}>start Unity &#11208;</button>
        </div>
        <div className="col">
          <button onClick={props.onInitializeApp}>initialize app &#11208;</button>
        </div>
        <div className="col">
          <button onClick={props.onInitializeExercise}>initialize exercise &#11208;</button>
        </div>
        <div className="col">
          <button onClick={props.onStartExercise}>start exercise &#11208;</button>
        </div>
        <div className="col pull-right">
          <button onClick={props.onStop}>&#11200; stop</button>
        </div>
      </div>
    </div>
  );
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
    onAutoChange: () => {
      dispatch(controlsAutoUpdate());
    },
    onConfigChange: (value: string) => {
      dispatch(controlsConfigUpdate(value));
    },
    onOptionsChange: (value: string) => {
      dispatch(controlsOptionsUpdate(value));
    },
    onSettingsChange: (value: string) => {
      dispatch(controlsSettingsUpdate(value));
    },
    onStart: () => {
      dispatch(unityInit());
    },
    onStop: () => {
      dispatch(consoleLog('Stop!'));
      dispatch(unityStop());
    },
    onInitializeApp: () => {
      dispatch(unityAppInit());
    },
    onInitializeExercise: () => {
      dispatch(unityExerciseInit());
    },
    onStartExercise: () => {
      dispatch(unityExerciseStart());
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlsPanel);
