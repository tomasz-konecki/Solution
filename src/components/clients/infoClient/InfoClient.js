import React, { Component } from "react";
import Modal from "react-responsive-modal";
import PropTypes from "prop-types";

import "./infoClient.scss";
import BilleniumPleaceholder from "assets/img/small-logo.png";
import Icon from "../../common/Icon";
import Spinner from "../../common/spinner/spinner";
import IntermediateBlock from "../../common/IntermediateBlock";
import AddEditClient from "../AddEditClient/AddEditClient";
import InfoClientList from "./InfoClientList/InfoClientList";
import AddCloudModal from "./InfoClientList/Modals/AddCloudModal";
import AddResponsiblePersonModal from "./InfoClientList/Modals/AddResponsiblePersonModal";

export default class InfoClient extends Component {
  state = {
    shouldAnimate: true,
    addingNewCloud: false,
    openCloudAddModal: false,
    openResponsiblePersonAddModal: false,
    item: {}
  };

  handleCloudAddCloseModal = () => {
    this.setState({ openCloudAddModal: false });
    this.props.resultBlockCloud &&
      this.props.clientsActions.addCloudResult(null);
  };

  handleCloudAddOpenModal = item => {
    this.setState({ item, openCloudAddModal: true });
  };

  handleResponsiblePersonAddCloseModal = () => {
    this.setState({ openResponsiblePersonAddModal: false });
    this.props.resultBlockResponsiblePerson &&
      this.props.clientsActions.addResponsiblePersonResult(null);
  };

  handleResponsiblePersonAddOpenModal = item => {
    this.setState({ item, openResponsiblePersonAddModal: true });
  };

  render() {
    const {
      t,
      client,
      resultBlockAddClient,
      onEditClient,
      handleTimesClick,
      handleSyncClick,
      handleAddCloud,
      handleEditCloud,
      handleDeleteCloud,
      handleReactivateCloud,
      resultBlockCloud,
      handleAddResponsiblePerson,
      handleEditResponsiblePerson,
      handleDeleteResponsiblePerson,
      handleReactivateResponsiblePerson,
      resultBlockResponsiblePerson
    } = this.props;

    const {
      openCloudAddModal,
      openResponsiblePersonAddModal,
      item
    } = this.state;

    const cloudsTranslateText = {
      Header: "ClientCloudsList",
      NotFound: "CloudsNotFound",
      ItemName: "CloudName",
      AddItem: "Add"
    };

    const responsiblePersonTranslateText = {
      Header: "ResponsiblePersonList",
      NotFound: "ResponsiblePersonNotFound",
      ItemName: "ResponsiblePersonName",
      AddItem: "Add"
    };

    client.descriptionHelper = !client.description
      ? t("NoClientDescription")
      : client.description;

    client.imgSrc = client.path
      ? "http://10.255.20.241/ClientsPictures/" + client.path
      : BilleniumPleaceholder;

    client.imgAlt = client.path
      ? client.name + " logo"
      : "Billeniumm Placeholder";

    return (
      <React.Fragment>
        <div className="client-info-header">
          <div
            style={{ background: `url(${client.imgSrc})` }}
            className="client-info-logo"
            title={client.imgAlt}
          />
          <div className="client-info-details">
            <div className="client-info-details-more">
              <h1>{client.name}</h1>
              <p>{client.descriptionHelper}</p>
            </div>
            <hr />
            <div className="client-info-options">
              <AddEditClient
                key={4}
                client={client}
                editClient={onEditClient}
                loading={false}
                resultBlock={resultBlockAddClient}
              >
                <span>{t("EditClient")}</span>
              </AddEditClient>
              |
              {!client.isDeleted ? (
                <span
                  onClick={() => handleTimesClick(client.id, client.name, t)}
                >
                  {t("DeleteClient")}
                </span>
              ) : (
                <span onClick={() => handleSyncClick(client.id, client.name)}>
                  {t("ReactivateClient")}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="client-clouds-container">
          <InfoClientList
            t={t}
            list={client.clouds}
            translateText={cloudsTranslateText}
            handleItemAddModal={this.handleItemAddModal}
            handleOpenAddItemModal={this.handleCloudAddOpenModal}
            handleDeleteInfoList={handleDeleteCloud}
            handleReactivateInfoList={handleReactivateCloud}
          />
        </div>
        <div className="responsible-person-container">
          <InfoClientList
            t={t}
            list={client.resposiblePersons}
            translateText={responsiblePersonTranslateText}
            handleOpenAddItemModal={this.handleResponsiblePersonAddOpenModal}
            handleDeleteInfoList={handleDeleteResponsiblePerson}
            handleReactivateInfoList={handleReactivateResponsiblePerson}
          />
        </div>
        {openCloudAddModal && (
          <Modal
            open={openCloudAddModal}
            classNames={{ modal: "Modal Modal-add-cloud" }}
            contentLabel="Add Cloud"
            onClose={this.handleCloudAddCloseModal}
          >
            <AddCloudModal
              t={t}
              item={item}
              handleAddCloud={handleAddCloud}
              handleEditCloud={handleEditCloud}
              clientId={client.id}
              resultBlockCloud={resultBlockCloud}
              handleCloudAddCloseModal={this.handleCloudAddCloseModal}
            />
          </Modal>
        )}

        <Modal
          open={openResponsiblePersonAddModal}
          classNames={{ modal: "Modal Modal-add-responsible-person" }}
          contentLabel="Add Responsible Person"
          onClose={this.handleResponsiblePersonAddCloseModal}
        >
          <AddResponsiblePersonModal
            t={t}
            item={item}
            handleAddResponsiblePerson={handleAddResponsiblePerson}
            handleEditResponsiblePerson={handleAddResponsiblePerson}
            clientName={client.name}
            resultBlockResponsiblePerson={resultBlockResponsiblePerson}
            handleResponsiblePersonAddCloseModal={
              this.handleResponsiblePersonAddCloseModal
            }
          />
        </Modal>
      </React.Fragment>
    );
  }
}

InfoClient.propTypes = {
  handleAddCloud: PropTypes.func.isRequired,
  handleAddResponsiblePerson: PropTypes.func.isRequired,
  resultBlockResponsiblePerson: PropTypes.object
};
