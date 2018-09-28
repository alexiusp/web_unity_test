import * as React from 'react';
import { connect } from 'react-redux';

import './ExerciseContainer.css';

import { IAppState, RunningStage } from '../state/models/state';
import { getCurrentStage } from '../state/selectors/controls';

import ExerciseView from './views/ExerciseView';
import LoadingProgressView from './views/LoadingProgress';

export interface Props {
  stage: RunningStage;
};

export function ExerciseContainerView(props: Props) {
  const isLoading = props.stage < RunningStage.ExerciseRunning;
  const baseViewClass = 'view';
  const loadingClass = `${baseViewClass} progress ${isLoading ? 'active' : ''}`;
  const exerciseClass = `${baseViewClass} exercise ${!isLoading ? 'active' : ''}`;
  return (
    <div className="exercise-container">
      <div className={loadingClass}>
        <LoadingProgressView />
      </div>
      <div className={exerciseClass}>
        <ExerciseView />
      </div>
    </div>
  );
}

export const mapStateToProps = (state: IAppState) => {
  const stage = getCurrentStage(state);
  return {
    stage,
  };
}

const ExerciseContainer = connect(mapStateToProps)(ExerciseContainerView);
export default ExerciseContainer;
