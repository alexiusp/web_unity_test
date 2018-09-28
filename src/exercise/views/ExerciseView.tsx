import * as React from 'react';

import { CANVAS_ID } from '../../constants';

export default function ExerciseView() {
  return (
    <div id={CANVAS_ID} style={{ width: '960px', height: '600px' }} />
  );
}
