import "./HeroSection.scss";
import * as React from "react";
// import FireFlies from "../FirefliesCustom";
// import Stars from "../Stars";
import InfinityIcon from "../icons/Infinity";
import Fireflies from "../fireFlies";

interface IState {
  elementWidth: number | undefined;
  elementHeight: number | undefined;
}
export default class HeroSection extends React.Component<{}, IState> {
  containerElement: HTMLElement;

  state = { elementWidth: undefined, elementHeight: undefined };

  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    if (this.containerElement) {
      this.updateDimensions();
    }

    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions() {
    this.setState({
      elementWidth: this.containerElement.offsetWidth,
      elementHeight: this.containerElement.offsetHeight
    });
  }

  render() {
    const isMobileViewPort =
      this.state.elementWidth && this.state.elementWidth < 600;
    const showFireflies =
      !isMobileViewPort && this.state.elementWidth && this.state.elementHeight;
    const content = (
      <div className="content">
        <header>
          <h1 className="title">The wedding of</h1>
        </header>
        <img className="emblem" src="/assets/emblem.png" />
      </div>
    );
    return (
      <div
        className="section section-hero"
        ref={ref => (this.containerElement = ref)}
      >
        <div className="firefly-container">
          {showFireflies ? (
            <Fireflies
              width={this.state.elementWidth}
              height={this.state.elementHeight}
              settings={{ count: 80, size: 3, color: "#ffffff" }}
              children={content}
            />
          ) : (
            content
          )}
        </div>
      </div>
    );
  }
}
