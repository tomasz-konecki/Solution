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

  render() {
    const { shouldAnimate } = this.state;
    const {
      client,
      t,
      resultBlockCloud,
      handleTimesClick,
      handleSyncClick,
      onEditClient,
      resultBlockAddClient,
      handleAddCloud,
      handleDeleteCloud,
      handleReactivateCloud,
      handleAddResponsiblePerson,

      handleDeleteResponsiblePerson,
      handleReactivateResponsiblePerson,
      resultBlockResponsiblePerson,
      clientsActions
    } = this.props;

    if (shouldAnimate) {
      this.changeAnimation();
    }

    return (
      <div
        className={`client-info-container ${shouldAnimate ? "anim-in" : null}`}
      >
        <InfoClient
          t={t}
          client={client}
          onEditClient={onEditClient}
          resultBlockAddClient={resultBlockAddClient}
          loading={false}
          handleTimesClick={handleTimesClick}
          handleSyncClick={handleSyncClick}
          handleAddCloud={handleAddCloud}
          handleDeleteCloud={handleDeleteCloud}
          handleReactivateCloud={handleReactivateCloud}
          resultBlockCloud={resultBlockCloud}
          handleAddResponsiblePerson={handleAddResponsiblePerson}
          handleDeleteResponsiblePerson={handleDeleteResponsiblePerson}
          handleReactivateResponsiblePerson={handleReactivateResponsiblePerson}
          resultBlockResponsiblePerson={resultBlockResponsiblePerson}
          clientsActions={clientsActions}
        />
      </div>
    );
  }
}
