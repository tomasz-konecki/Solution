import React, { Component } from "react";
import InfoClient from "./InfoClient";
import "./infoClient.scss";

export default class infoClientContainer extends Component {
  state = {
    shouldAnimate: true
  };

  changeAnimation = () => {
    setTimeout(() => {
      this.setState({ shouldAnimate: false });
    }, 800);
  };

  componentWillReceiveProps(nextState) {
    const { client } = this.props;
    const { shouldAnimate } = this.state;
    if (
      shouldAnimate !== nextState.shouldAnimate &&
      client !== nextState.client
    ) {
      this.setState({ shouldAnimate: true });
    }
  }

  render() {
    const { shouldAnimate } = this.state;
    const { client, t } = this.props;

    if (shouldAnimate) {
      this.changeAnimation();
    }

    return (
      <div
        className={`client-info-container ${shouldAnimate ? "anim-in" : null}`}
      >
        <InfoClient client={client} t={t} />
      </div>
    );
  }
}
