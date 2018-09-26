import { map } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
  consoleCommand,
  consoleInputUpdate,
} from '../state/actions/console';
import { Callback, DataCallback } from '../state/models/base';
import { ILoggerMessage } from '../state/models/console';
import { IAppState } from '../state/models/state';
import { getConsoleInput, getConsoleLines } from '../state/selectors/console';

export interface Props {
  input: string;
  lines: ILoggerMessage[];
  onChange: DataCallback;
  onCommand: Callback;
}

export function printConsole(lines: ILoggerMessage[]) {
  return map(lines, (message, index) => (
    <p key={index}>[{message.type}]: {message.message}</p>
  ));
}

export class ConsoleContainer extends React.Component<Props, {}> {

  public bottom: HTMLDivElement | null;

  public componentDidMount() {
    this.scrollToBottom();
  }

  public componentDidUpdate() {
    this.scrollToBottom();
  }

  public render() {
    const consoleContent = printConsole(this.props.lines);
    const handleConsoleKey: React.KeyboardEventHandler<HTMLInputElement> = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.charCode !== 13) {
        return;
      }
      this.props.onCommand();
    }
    const handleConsoleChange: React.ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      this.props.onChange(value);
    }
    return (
      <div className="debug">
        <div className="debug-console">
          {consoleContent}
          <div ref={(el) => { this.bottom = el; }}/>
        </div>
        <input className="debug-input" type="text" value={this.props.input} onKeyPress={handleConsoleKey} onChange={handleConsoleChange} />
      </div>
    );
  }

  private scrollToBottom = () => {
    if (this.bottom) {
      this.bottom.scrollIntoView({ behavior: "smooth" });
    }
  }

}

export const mapStateToProps = (state: IAppState) => {
  const lines = getConsoleLines(state);
  const input = getConsoleInput(state);
  return {
    input,
    lines,
  };
}

export const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onChange: (input: string) => {
      dispatch(consoleInputUpdate(input));
    },
    onCommand: () => {
      dispatch(consoleCommand());
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsoleContainer);
