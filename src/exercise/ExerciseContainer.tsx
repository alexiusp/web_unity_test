import * as React from 'react';
import { connect } from 'react-redux';

import './ExerciseContainer.css';

import { IAppState, RunningStage } from '../state/models/state';
import { getCurrentStage } from '../state/selectors/controls';

import UnityView from '../unity/UnityView';
import IntroView from './views/IntroView';
import LoadingProgressView from './views/LoadingProgressView';

export interface Props {
  stage: RunningStage;
};

enum CurrentView {
  Loading,
  Intro,
  Exercise,
}

export function getViewClass(view: CurrentView, stage: RunningStage) {
  const baseViewClass = 'view';
  switch (view) {
    case CurrentView.Loading: {
      const isLoading = stage > RunningStage.None && stage < RunningStage.AppInit;
      return `${baseViewClass} progress ${isLoading ? 'active' : ''}`;
    }
    case CurrentView.Intro: {
      const isIntro = stage > RunningStage.UnityInit && stage < RunningStage.ExerciseRunning;
      return `${baseViewClass} intro ${isIntro ? 'active' : ''}`;
    }
    case CurrentView.Exercise: {
      const isExercise = stage === RunningStage.ExerciseRunning;
      return `${baseViewClass} exercise ${isExercise ? 'active' : ''}`;
    }
  }
  return baseViewClass;
}

export function ExerciseContainerView(props: Props) {
  return (
    <div className="exercise-container">
      <div className={getViewClass(CurrentView.Loading, props.stage)}>
        <LoadingProgressView />
      </div>
      <div className={getViewClass(CurrentView.Intro, props.stage)}>
        <IntroView />
      </div>
      <div className={getViewClass(CurrentView.Exercise, props.stage)}>
        <UnityView />
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
