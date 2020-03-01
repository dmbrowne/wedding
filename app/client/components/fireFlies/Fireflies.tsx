import React, { Component, Fragment } from "react";
import Firefly, { IFireFliesSettings } from "./Firefly";

interface IProps {
  width: number;
  height: number;
  updateInterval?: number;
  settings?: Partial<IFireFliesSettings>;
}

interface IState {
  canvas: HTMLCanvasElement | null;
  canvasContext: CanvasRenderingContext2D | null;
  firefliesArray: Firefly[];
  settings: IFireFliesSettings;
  width: number;
  height: number;
}

const DEFAULT_SETTINGS: IFireFliesSettings = {
  color: "#FF9B00",
  size: 4.7,
  speed: 0.1,
  blur: 0,
  count: 300,
  fadeSpeedRate: 0.01,
  differentSize: true,
  isGradient: true,
  randomFadeTime: true
};

class Fireflies extends Component<IProps, IState> {
  static defaultProps = {
    updateInterval: 15,
    displayParamsChanger: true,
    displayFpsStats: true
  };

  timerId: NodeJS.Timer | undefined;

  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      canvasContext: null,
      firefliesArray: [],
      settings: { ...DEFAULT_SETTINGS, ...this.props.settings },
      width: this.props.width,
      height: this.props.height
    };
  }

  componentDidMount() {
    const canvas = document.getElementById(
        "fireflies-canvas"
      ) as HTMLCanvasElement,
      context = canvas.getContext("2d"),
      width = this.state.width,
      height = this.state.height;

    context.fillStyle = "rgba(30,30,30,1)";
    context.fillRect(0, 0, width, height);
    this.setState({
      canvas: canvas,
      canvasContext: context
    });

    const canvasParams = {
        canvasContext: context,
        width: width,
        height: height
      },
      settings = this.state.settings,
      fireflies = this.state.firefliesArray;

    for (let j = 0; j < settings.count; j++)
      fireflies.push(new Firefly(canvasParams, settings));

    this.setState({ firefliesArray: fireflies });
    this.timerId = setInterval(() => this.draw(), this.props.updateInterval);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  updateFireflies = () => {
    const fireflies = this.state.firefliesArray;

    fireflies.forEach(firefly => {
      firefly.update();
    });
  };

  draw = () => {
    const canvasContext = this.state.canvasContext,
      width = this.state.width,
      height = this.state.height;

    canvasContext.clearRect(0, 0, width, height);

    this.updateFireflies();
  };

  reRenderFireflies = () => {
    const fireflies = this.state.firefliesArray;

    fireflies.forEach(firefly => {
      firefly.updateCanvasSize(this.state.width, this.state.height);
    });
  };

  componentDidUpdate({ width, height }) {
    if (width !== this.state.width || height !== this.state.height) {
      this.reRenderFireflies();
    }
  }

  addFireflies = (arr, count) => {
    const canvasParams = {
        canvasContext: this.state.canvasContext,
        width: this.state.width,
        height: this.state.height
      },
      settings = this.state.settings;
    for (let j = 0; j < count; j++)
      arr.push(new Firefly(canvasParams, settings));
  };

  removeFireflies = (arr, count) => {
    arr.splice(arr.length - count);
  };

  render() {
    return (
      <Fragment>
        <canvas
          id="fireflies-canvas"
          width={this.state.width}
          height={this.state.height}
          style={{ WebkitFilter: `blur(${this.state.settings.blur}px)` }}
        />
        {this.props.children}
      </Fragment>
    );
  }
}

export default Fireflies;
