import * as React from 'react';

import './ExerciseContainer.css';

import ExerciseViewComponent from './views/ExerciseView';

export interface Props {
  some?: any;
};

export function ExerciseContainer(props: Props) {
  return (
    <div>
      <ExerciseViewComponent />
    </div>
  );
}
