import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Callback, DataCallback } from '../../state/models/base';
import { CurrentExercise } from '../../state/models/exercise';
import { IAppState } from '../../state/models/state';
import { getCurrentExercise } from '../../state/selectors/exercise';

export interface Props extends CurrentExercise {
  onError: DataCallback;
  onStart: Callback;
}

export class ExerciseView extends React.Component<Props, {}> {
  public render() {
    return (
      <div>exercise view</div>
    );
  }
}

export const mapStateToProps = (state: IAppState) => {
  const { name, options, progress, settings } = getCurrentExercise(state);
  return {
    name,
    options,
    progress,
    settings,
  };
}

export const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onError: (msg: string) => {
      // dispatch(consoleError(msg));
    },
    onStart: () => {
      // dispatch(consoleError(msg));
    },
  }
}

const ExerciseViewComponent = connect(mapStateToProps, mapDispatchToProps)(ExerciseView);

export default ExerciseViewComponent;
