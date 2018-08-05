import React, { Component } from "react";
import InfoClient from "./InfoClient";
import "./infoClient.scss";

export default class infoClientContainer extends Component {
  state = {
    shouldAnimate: true
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

  handleDeleteCloudChild = (cloudId, cloudName) => {
    this.props.handleDeleteCloud(cloudId, cloudName);
  };

  handleReactivateCloudChild = (cloudId, cloudName) => {
    this.props.handleReactivateCloud(cloudId, cloudName);
  };

  render() {
    const { shouldAnimate } = this.state;
    const {
      client,
      t,
      clearResponseCloud,
      resultBlockCloud,
      handleTimesClick,
      handleSyncClick,
      onEditClient,
      resultBlockAddClient,
      handleAddCloud
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
          handleAddCloud={handleAddCloud}
          loading={false}
          resultBlockCloud={resultBlockCloud}
          clearResponseCloud={clearResponseCloud}
          handleTimesClick={handleTimesClick}
          handleSyncClick={handleSyncClick}
          handleDeleteCloudChild={this.handleDeleteCloudChild}
          handleReactivateCloudChild={this.handleReactivateCloudChild}
          onEditClient={onEditClient}
          resultBlockAddClient={resultBlockAddClient}
        />
      </div>
    );
  }
}
