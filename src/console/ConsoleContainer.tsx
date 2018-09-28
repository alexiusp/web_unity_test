import { map } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import './ConsoleContainer.css';

import {
  consoleCommand,
  consoleInputUpdate,
} from '../state/actions/console';
import { Callback, DataCallback } from '../state/models/base';
import { ILoggerMessage } from '../state/models/console';
import { IAppState, IConsoleState } from '../state/models/state';
import { getConsoleInput, getConsoleLines, getConsoleProgress } from '../state/selectors/console';

export interface Props extends IConsoleState {
  onChange: DataCallback;
  onCommand: Callback;
}

export function printConsole(lines: ILoggerMessage[]) {
  return map(lines, (message, index) => (
    <p key={index}>[{message.type}]: {message.message}</p>
  ));
}

const LoadingPalette = '\\|/-\\|/-';

export function getLoadingChar(loading: number) {
  const index = loading % LoadingPalette.length;
  return LoadingPalette.charAt(index);
}

export class ConsoleContainer extends React.Component<Props, {}> {

  public bottom: HTMLParagraphElement | null;

  public componentDidMount() {
    this.scrollToBottom();
  }

  public componentDidUpdate() {
    this.scrollToBottom();
  }

  public onConsoleKey: React.KeyboardEventHandler<HTMLInputElement> = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode !== 13) {
      return;
    }
    this.props.onCommand();
  }

  public onConsoleChange: React.ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.props.onChange(value || '>');
  }

  public render() {
    const consoleContent = printConsole(this.props.lines);
    const loadingChar = (this.props.progress > 0) ? getLoadingChar(this.props.progress) : '';
    return (
      <div className="debug">
        <div className="debug-console">
          {consoleContent}
          <p ref={(el) => { this.bottom = el; }}>{loadingChar}</p>
        </div>
        <input className="debug-input" type="text" value={this.props.input} onKeyPress={this.onConsoleKey} onChange={this.onConsoleChange} />
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
  const progress = getConsoleProgress(state);
  return {
    input,
    lines,
    progress,
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
