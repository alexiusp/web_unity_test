import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import './ControlsPanel.css';

import {
  controlsAutoUpdate,
  controlsConfigUpdate,
  controlsFormToggle,
  controlsOptionsUpdate,
  controlsSettingsUpdate,
} from '../state/actions/controls';
import {
  exerciseAppInit,
  exerciseExerciseInit,
  exerciseExerciseStart,
  exerciseStop,
  exerciseUnityStart,
} from '../state/actions/exercise';
import { Callback, DataCallback } from '../state/models/base';
import { EditForm, IAppState, IControlsState, RunningStage } from '../state/models/state';
import { getControls } from '../state/selectors/controls';

export interface Props extends IControlsState {
  onAutoChange: Callback;
  onConfigChange: DataCallback<string>;
  onSettingsChange: DataCallback<string>;
  onOptionsChange: DataCallback<string>;
  onFormToggle: DataCallback;
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
  const toggleForm = (form: EditForm) => () => props.onFormToggle(form);
  let editForm = null;
  switch (props.edit) {
    case EditForm.AppConfig:
      editForm = (<textarea rows={6} name="Config" value={props.config} onChange={handleInputChange} />);
      break;
    case EditForm.Settings:
      editForm = (<textarea rows={6} name="Settings" value={props.settings} onChange={handleInputChange} />);
      break;
    case EditForm.Options:
      editForm = (<textarea rows={6} name="Options" value={props.options} onChange={handleInputChange} />);
  }
  const editFormClass = 'row edit-form' + (editForm ? ' show' : '');
  return (
    <div className="controls">
      <div className={editFormClass}>
        <div className="col">
          {editForm}
        </div>
      </div>
      <div className="row">
        <div className="col">
          <label>auto execute: <input name="auto" type="checkbox" checked={props.auto} onChange={props.onAutoChange} /></label>
        </div>
        <div className={(props.stage > RunningStage.None) ? 'col completed' : 'col'}>
          <button disabled={props.stage > RunningStage.None} onClick={props.onStart}>start Unity &#11208;</button>
        </div>
        <div className={(props.stage > RunningStage.UnityInit) ? 'col completed' : 'col'}>
          <button disabled={props.stage > RunningStage.UnityInit} onClick={toggleForm(EditForm.AppConfig)}>{props.edit === EditForm.AppConfig ? '\u2BC6' : '\u2BC5' }</button>
        </div>
        <div className={(props.stage > RunningStage.UnityInit) ? 'col completed' : 'col'}>
          <button disabled={props.stage > RunningStage.UnityInit} onClick={props.onInitializeApp}>initialize app &#11208;</button>
        </div>
        <div className={(props.stage > RunningStage.AppInit) ? 'col completed' : 'col'}>
          <button disabled={props.stage > RunningStage.AppInit} onClick={toggleForm(EditForm.Settings)}>{props.edit === EditForm.Settings ? '\u2BC6' : '\u2BC5'}</button>
        </div>
        <div className={(props.stage > RunningStage.AppInit) ? 'col completed' : 'col'}>
          <button disabled={props.stage > RunningStage.AppInit} onClick={props.onInitializeExercise}>initialize exercise &#11208;</button>
        </div>
        <div className={(props.stage > RunningStage.ExerciseInit) ? 'col completed' : 'col'}>
          <button disabled={props.stage > RunningStage.ExerciseInit} onClick={toggleForm(EditForm.Options)}>{props.edit === EditForm.Options ? '\u2BC6' : '\u2BC5'}</button>
        </div>
        <div className={(props.stage > RunningStage.ExerciseInit) ? 'col completed' : 'col'}>
          <button disabled={props.stage > RunningStage.ExerciseInit} onClick={props.onStartExercise}>start exercise &#11208;</button>
        </div>
        <div className="col pull-right">
          <button onClick={props.onStop}>&#11200; stop</button>
        </div>
      </div>
    </div>
  );
}

export const mapStateToProps = (state: IAppState) => {
  const controls = getControls(state);
  return {
    ...controls,
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
    onFormToggle: (form: EditForm) => {
      dispatch(controlsFormToggle(form));
    },
    onStart: () => {
      dispatch(exerciseUnityStart());
    },
    onStop: () => {
      dispatch(exerciseStop());
    },
    onInitializeApp: () => {
      dispatch(exerciseAppInit());
    },
    onInitializeExercise: () => {
      dispatch(exerciseExerciseInit());
    },
    onStartExercise: () => {
      dispatch(exerciseExerciseStart());
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlsPanel);
