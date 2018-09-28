import * as React from 'react';

import './ExerciseContainer.css';

import ExerciseView from './views/ExerciseView';

export interface Props {
  some?: any;
};

export default function ExerciseContainer(props: Props) {
  return (
    <div>
      <ExerciseView />
    </div>
  );
}
