import * as React from 'react';
import { connect } from 'react-redux';

import { IAppState } from '../../state/models/state';
import { getLoadingProgress } from '../../state/selectors/exercise';

export interface Props {
  progress: number;
};

export function LoadingProgress(props: Props) {
  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: (props.progress * 100) + '%' }} />
    </div>
  );
}

export const mapStateToProps = (state: IAppState) => {
  const progress = getLoadingProgress(state);
  return {
    progress,
  };
}

const LoadingProgressView = connect(mapStateToProps)(LoadingProgress);
export default LoadingProgressView;
