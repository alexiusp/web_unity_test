import * as React from 'react';

import './LoadTest.css';

const LOAD_TEST = process.env.REACT_APP_LOAD_TEST || 0;

interface LState {
  numbers: number[];
  show: boolean;
}

export default class LoadTest extends React.Component<{},LState> {
  public state: LState;
  private timer: any;
  public constructor(props: {}) {
    super(props);
    this.state = {
      numbers: [],
      show: true,
    };
  }
  public componentDidMount() {
    this.setState({numbers: [0, 0, 0, 0, 0]});
    if (LOAD_TEST) {
      this.timer = setInterval(this.doSomeHeavyStuff, +LOAD_TEST);
    }
  }
  public doSomeHeavyStuff = () => {
    const index = Math.floor(Math.random() * Math.random() * 5);
    const value = Math.floor(Math.random() * Math.random() * 10);
    const numbers = [...this.state.numbers];
    numbers[index] = value;
    this.setState({ numbers });
  }
  public toggle = () => {
    const show = !this.state.show;
    this.setState({show});
    if (!show && this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(this.doSomeHeavyStuff, +LOAD_TEST);
    }
  }
  public render() {
    if (!LOAD_TEST) {
      return null;
    }
    return (
      <div className="test">
        <button className="test-toggle" onClick={this.toggle}>*</button>
        {this.state.show ? (
          <div className="animation-container">
            <div className="sprite" ><span>{this.state.numbers[0]}</span></div>
            <div className="sprite green" style={{ animationDuration: '11s' }} ><span>{this.state.numbers[1]}</span></div>
            <div className="sprite red" style={{ animationDuration: '13s', animationDirection: 'reverse' }} ><span>{this.state.numbers[2]}</span></div>
            <div className="sprite yellow" style={{ animationDuration: '17s' }} ><span>{this.state.numbers[3]}</span></div>
            <div className="sprite black" style={{ animationDuration: '19s', animationDirection: 'alternate' }} ><span>{this.state.numbers[4]}</span></div>
          </div>
        ) : null}
      </div>
    );
  }
}
