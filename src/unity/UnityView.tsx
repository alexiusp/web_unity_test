import * as React from 'react';

import { CANVAS_ID } from '../constants';

export default function UnityView() {
  return (
    <div id={CANVAS_ID} style={{ width: '970px', height: '600px' }} />
  );
}
