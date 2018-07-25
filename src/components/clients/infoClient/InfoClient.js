import React from "react";
import Aux from "services/auxilary";
import "./infoClient.scss";
import BilleniumPleaceholder from "assets/img/small-logo.png";
import Icon from "../../common/Icon";
import Spinner from "../../common/spinner/spinner";
import IntermediateBlock from "../../common/IntermediateBlock";
import { CSSTransitionGroup } from "react-transition-group";
import AddEditClient from "../AddEditClient/AddEditClient";

const pullDOM = (
  t,
  handleAddCloud,
  handleAddCloudSaveChild,
  handleInputAddCloud,
  disabled,
  inputValueToAdd
) => {
  return (
    <div className="cloud">
      <div className="cloud-circle" />
      <div className="cloud-name">
        <input
          onChange={e => handleInputAddCloud(e)}
          onKeyPress={e => {
            if (e.key === "Enter") {
              handleAddCloudSaveChild();
            }
          }}
          placeholder={t("CloudName")}
          value={inputValueToAdd}
        />
      </div>
      <div className="cloud-options">
        <button disabled={disabled} onClick={handleAddCloudSaveChild}>
          <Icon icon="check" iconType="fa" additionalClass="icon-success" />
        </button>
        <button onClick={handleAddCloud}>
          <Icon icon="times" iconType="fa" additionalClass="icon-danger" />
        </button>
      </div>
    </div>
  );
};

const InfoClient = ({
  client,
  t,
  handleAddCloud,
  addingNewCloud,
  handleInputAddCloud,
  handleAddCloudSaveChild,
  resultBlockCloud,
  clearResponseCloud,
  handleTimesClick,
  handleSyncClick,
  handleDeleteCloudChild,
  handleReactivateCloudChild,
  disabled,
  onEditClient,
  resultBlockAddClient,
  inputValueToAdd
}) => {
  const clientClouds = client.clouds.map((cloud, index) => {
    return (
      <div key={index} className="cloud">
        <div className="cloud-circle" />
        <div className="cloud-name">
          <span>{cloud.name}</span>
        </div>
        <div className="cloud-options">
          {!cloud.isDeleted ? (
            <button
              onClick={() => handleDeleteCloudChild(cloud.id, cloud.name)}
            >
              <Icon icon="times" iconType="fa" additionalClass="icon-danger" />
            </button>
          ) : (
            <button
              onClick={() => handleReactivateCloudChild(cloud.id, cloud.name)}
            >
              <Icon
                icon="sync-alt"
                iconType="fa"
                additionalClass="icon-danger"
              />
            </button>
          )}
        </div>
      </div>
    );
  });

  client.descriptionHelper = !client.description
    ? t("NoClientDescription")
    : client.description;

  client.imgSrc = client.path
    ? "http://10.255.20.241/ClientsPictures/" + client.path
    : BilleniumPleaceholder;

  client.imgAlt = client.path
    ? client.name + " logo"
    : "Billeniumm Placeholder";

  let closeMessage = null;

  if (resultBlockCloud) {
    closeMessage = resultBlockCloud.errorOccurred() ? (
      <span className="messageClose" onClick={() => clearResponseCloud()}>
        x
      </span>
    ) : null;
  }

  let adddingNewCloudContainer = addingNewCloud ? (
    <IntermediateBlock
      loaded={true}
      render={() =>
        pullDOM(
          t,
          handleAddCloud,
          handleAddCloudSaveChild,
          handleInputAddCloud,
          disabled,
          inputValueToAdd
        )
      }
      resultBlock={resultBlockCloud}
    />
  ) : null;

  return (
    <Aux>
      <div className="client-info-header">
        <div className="client-info-logo">
          <img
            src={client.imgSrc}
            title={client.imgAlt}
            onError={e => {
              e.target.src = BilleniumPleaceholder;
            }}
          />
        </div>
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
              <span onClick={() => handleTimesClick(client.id, client.name, t)}>
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
        <div className="client-clouds-header">
          <h2>{t("ClientCloudsList")}</h2>
        </div>
        <div className="client-clouds">
          {clientClouds}
          {clientClouds.length === 0 && (
            <span className="clouds-not-found">{t("CloudsNotFound")}</span>
          )}
          <div className="client-cloud-adding-container">
            {closeMessage}
            <CSSTransitionGroup
              transitionName="example"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            >
              {adddingNewCloudContainer}
            </CSSTransitionGroup>
          </div>
        </div>

        {!adddingNewCloudContainer && (
          <div className="client-cloud-add">
            <button onClick={() => handleAddCloud()}>
              <Icon icon="plus" iconType="fa" />
              {t("AddCloud").toUpperCase()}
            </button>
          </div>
        )}
      </div>
      {/* {loading && (
        <div className="full-screen-loader">
          <Spinner />
        </div>
      )} */}
    </Aux>
  );
};
export default InfoClient;
