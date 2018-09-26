import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { controlsAutoUpdate, controlsConfigUpdate, controlsOptionsUpdate, controlsSettingsUpdate } from '../state/actions/controls';
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.name;
    const handlerName = `on${input}Change`;
    const value = e.target.value;
    props[handlerName](value);
  };
  return (
    <div className="controls">
      <div className="controls">
        <div className="controls-row">
          <label>auto execute: <input name="auto" type="checkbox" checked={props.auto} onChange={props.onAutoChange} /></label>&nbsp;
            <button onClick={props.onStart}>start Unity</button>
          <button onClick={props.onStop}>stop</button>
        </div>
        <div className="controls-row">
          <label>app config: <input name="Config" value={props.config} onChange={handleInputChange} /></label>&nbsp;
            <button onClick={props.onInitializeApp}>initialize app</button>
        </div>
        <div className="controls-row">
          <label>settings: <input name="Settings" value={props.settings} onChange={handleInputChange} /></label>&nbsp;
            <button onClick={props.onInitializeExercise}>initialize exercise</button>
        </div>
        <div className="controls-row">
          <label>options: <input name="Options" value={props.options} onChange={handleInputChange} /></label>&nbsp;
            <button onClick={props.onStartExercise}>start exercise</button>
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
    /*
    onStart: () => {
      // dispatch(controlsAutoUpdate());
    },
    onStop: () => {
      // dispatch(controlsAutoUpdate());
    },
    onInitializeApp: () => {
      // dispatch(controlsAutoUpdate());
    },
    onInitializeExercise: () => {
      // dispatch(controlsAutoUpdate());
    },
    onStartExercise: () => {
      // dispatch(controlsAutoUpdate());
    },
    */
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlsPanel);