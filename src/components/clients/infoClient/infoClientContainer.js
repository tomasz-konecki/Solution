import React, { Component } from "react";
import InfoClient from "./InfoClient";
import "./infoClient.scss";

export default class infoClientContainer extends Component {
  state = {
    shouldAnimate: true,
    addingNewCloud: false,
    inputValueToAdd: null
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

  changeAnimation = () => {
    setTimeout(() => {
      this.setState({ shouldAnimate: false });
    }, 800);
  };

  handleAddCloud = () => {
    this.setState({ addingNewCloud: !this.state.addingNewCloud });
  };

  handleInputAddCloud = e => {
    this.setState({ inputValueToAdd: e.target.value });
  };

  handleAddCloudSaveChild = () => {
    this.props.handleAddCloudSave(
      this.state.inputValueToAdd,
      this.props.client.id
    );
  };

  render() {
    const { shouldAnimate, addingNewCloud } = this.state;
    const {
      client,
      t,
      handleAddCloudSave,
      loading,
      resultBlockCloud
    } = this.props;

    if (shouldAnimate) {
      this.changeAnimation();
    }

    return (
      <div
        className={`client-info-container ${shouldAnimate ? "anim-in" : null}`}
      >
        <InfoClient
          client={client}
          t={t}
          handleAddCloud={this.handleAddCloud}
          addingNewCloud={addingNewCloud}
          handleInputAddCloud={this.handleInputAddCloud}
          handleAddCloudSaveChild={this.handleAddCloudSaveChild}
          loading={loading}
          resultBlockCloud={resultBlockCloud}
        />
      </div>
    );
  }
}
