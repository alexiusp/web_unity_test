import * as React from 'react';

export default function LoadingProgressView() {
  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: (0.1 * 100) + '%' }} />
    </div>
  );
}
