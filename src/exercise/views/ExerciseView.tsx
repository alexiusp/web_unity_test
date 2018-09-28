import * as React from 'react';

const CANVAS_ID = 'exercise';

export default function ExerciseView() {
  return (
    <div className="exercise">
      <div id={CANVAS_ID} style={{ width: '960px', height: '600px' }} />
    </div>
  );
}
