import React, { Component } from "react";
import InfoClient from "./InfoClient";
import "./infoClient.scss";

export default class infoClientContainer extends Component {
  state = {
    shouldAnimate: true,
    addingNewCloud: false,
    inputValueToAdd: "",
    disabled: true
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
    if (e.target.value) {
      this.setState({ inputValueToAdd: e.target.value, disabled: false });
    } else {
      this.setState({ inputValueToAdd: e.target.value, disabled: true });
    }
  };

  handleAddCloudSaveChild = () => {
    if (!this.state.disabled) {
      this.props.handleAddCloudSave(
        this.state.inputValueToAdd,
        this.props.client.id
      );
      this.setState({ inputValueToAdd: "" });
    }
  };

  handleDeleteCloudChild = (cloudId, cloudName) => {
    this.props.handleDeleteCloud(cloudId, cloudName);
  };

  handleReactivateCloudChild = (cloudId, cloudName) => {
    this.props.handleReactivateCloud(cloudId, cloudName);
  };

  render() {
    const {
      shouldAnimate,
      addingNewCloud,
      disabled,
      inputValueToAdd
    } = this.state;
    const {
      client,
      t,
      clearResponseCloud,
      resultBlockCloud,
      handleTimesClick,
      handleSyncClick,
      onEditClient,
      resultBlockAddClient
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
          loading={false}
          resultBlockCloud={resultBlockCloud}
          clearResponseCloud={clearResponseCloud}
          handleTimesClick={handleTimesClick}
          handleSyncClick={handleSyncClick}
          handleDeleteCloudChild={this.handleDeleteCloudChild}
          handleReactivateCloudChild={this.handleReactivateCloudChild}
          disabled={disabled}
          onEditClient={onEditClient}
          resultBlockAddClient={resultBlockAddClient}
          inputValueToAdd={inputValueToAdd}
        />
      </div>
    );
  }
}
