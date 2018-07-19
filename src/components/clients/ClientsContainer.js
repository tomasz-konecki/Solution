import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { translate } from "react-translate";

import { ACTION_CONFIRMED } from "./../../constants";
import * as asyncActions from "../../actions/asyncActions";
import * as clientsActions from "../../actions/clientsActions";

import ClientsList from "./ClientsList";
import IntermediateBlock from "../common/IntermediateBlock";
import Icon from "../common/Icon";
import Aux from "../../services/auxilary";
import AddEditClient from "./AddEditClient/AddEditClient";
import SearchClient from "./searchClient/SearchClient";
import ShowRadioButtons from "./ShowRadioButtons/ShowRadioButtons";
import InfoClientContainer from "./infoClient/infoClientContainer";

import "../../scss/components/clients/ClientsContainer.scss";

class ClientsContainer extends React.Component {
  state = {
    clients: [],
    client: {},
    sortingDirections: {
      name: "asc"
    },
    checked: null
  };

  componentDidMount = () => {
    this.props.clientsActions.loadClients();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.clients !== this.props.clients) {
      this.setState({ clients: nextProps.clients });
    }
    if (this.validatePropsForClientDeletion(nextProps)) {
      this.props.async.setActionConfirmationProgress(true);
      this.props.clientsActions.deleteClient(nextProps.toConfirm.id);
    }
    if (this.validatePropsForClientReactivation(nextProps)) {
      this.props.async.setActionConfirmationProgress(true);
      this.props.clientsActions.reactivateClient(nextProps.toConfirm.id);
    }
    if (this.validatePropsForCloudDeletion(nextProps)) {
      this.props.async.setActionConfirmationProgress(true);
      this.props.clientsActions.deleteCloud(nextProps.toConfirm.id);
    }
  }

  validatePropsForClientDeletion(nextProps) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === "deleteClient"
    );
  }

  validatePropsForClientReactivation(nextProps) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === "reactivateClient"
    );
  }

  validatePropsForCloudDeletion(nextProps) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === "deleteCloud"
    );
  }

  handleTimesClick = (id, name) => {
    const { t } = this.props;
    this.props.async.setActionConfirmation(true, {
      key: "deleteClient",
      string: `${t("Removing")} ${name}`,
      id: id,
      successMessage: t("ClientRemoved")
    });
  };

  handleSyncClick = (id, name) => {
    const { t } = this.props;
    this.props.async.setActionConfirmation(true, {
      key: "reactivateClient",
      string: `${t("Reactivating")} ${name}`,
      id: id,
      successMessage: t("ClientReactivated")
    });
  };

  generateOptions = client => {
    const { t } = this.props;
    let content = [];
    if (!client.isDeleted) {
      content.push(
        <button
          title={t("DeleteClient")}
          key={1}
          onClick={() => this.handleTimesClick(client.id, client.name)}
        >
          <Icon icon="times" iconType="fa" />
        </button>
      );
    } else {
      content.push(
        <button
          title={t("ReactivateClient")}
          key={2}
          onClick={() => this.handleSyncClick(client.id, client.name)}
        >
          <Icon icon="sync-alt" iconType="fa" />
        </button>
      );
    }
    content.push(
      <AddEditClient
        key={4}
        client={client}
        editClient={this.props.clientsActions.editClient}
        loading={this.props.loading}
        resultBlock={this.props.resultBlockAddClient}
      >
        <Icon icon="edit" iconType="fa" />
      </AddEditClient>
    );

    return content;
  };

  filterList = e => {
    let updatedList = this.props.clients;
    let searchedValue = e.target.value;
    if (searchedValue && this.props.clients) {
      updatedList = updatedList.filter((item, index) => {
        if (item.name && searchedValue) {
          return (
            item.name.toLowerCase().indexOf(searchedValue.toLowerCase()) >= 0
          );
        }
      });
    }
    this.setState({ clients: updatedList, checked: null });
  };

  sortBy = key => {
    const { sortingDirections, clients } = this.state;

    let sortedClients = (clients ? clients : this.props.clients).sort(
      (a, b) => {
        let nameA = a[key] ? a[key].toLowerCase() : "";
        let nameB = b[key] ? b[key].toLowerCase() : "";

        if (nameA < nameB) return sortingDirections[key] === "asc" ? -1 : 1;
        if (nameA > nameB) return sortingDirections[key] === "asc" ? 1 : -1;
      }
    );

    this.setState({
      clients: sortedClients,
      sortingDirections: {
        [key]: sortingDirections[key] === "asc" ? "desc" : "asc"
      }
    });
  };

  radioButtonClick = value => {
    let updatedList;
    let listFilled = new Promise(resolve => {
      updatedList = this.props.clients;
      resolve(updatedList);
    });
    if (updatedList) {
      listFilled.then(
        (updatedList = updatedList.filter((item, index) => {
          if (value === "activated") {
            if (!item.isDeleted) {
              return item;
            }
          }
          if (value === "not-activated") {
            if (item.isDeleted) {
              return item;
            }
          }
        })),
        this.setState({ clients: updatedList, checked: value })
      );
    }
  };

  clientNameClickedHandler = client => {
    this.setState({
      client
    });
  };

  handleAddCloudSave = (name, clientId) => {
    this.props.clientsActions.addCloud(name, clientId);
  };

  handleDeleteCloud = (id, name) => {
    const { async, t } = this.props;
    async.setActionConfirmation(true, {
      key: "deleteCloud",
      string: `${t("RemovingCloud")} ${name}`,
      id: id,
      successMessage: t("CloudRemoved")
    });
  };

  pullDOM = () => {
    const { clientsActions, loading, resultBlockAddClient, t } = this.props;
    const { clients, checked } = this.state;
    return (
      <Aux>
        <AddEditClient
          addClient={clientsActions.addClient}
          loading={loading}
          resultBlock={resultBlockAddClient}
        />
        <SearchClient filter={this.filterList} t={t} />
        <ShowRadioButtons
          t={t}
          radioButtonClick={this.radioButtonClick}
          checked={checked}
        />
        <ClientsList
          clients={clients}
          options={this.generateOptions}
          t={t}
          sortBy={this.sortBy}
          clientNameClickedHandler={this.clientNameClickedHandler}
        />
        {clients.length === 0 && (
          <span className="clients-not-found">{t("ClientsNotFound")}</span>
        )}
      </Aux>
    );
  };
  render() {
    let { resultBlock, resultBlockCloud, t, loading } = this.props;
    let { clients, checked, client } = this.state;
    let infoClient = null;
    console.log(client);
    if (client.name) {
      infoClient = (
        <InfoClientContainer
          client={client}
          t={t}
          handleAddCloudSave={this.handleAddCloudSave}
          loading={loading}
          resultBlockCloud={resultBlockCloud}
          clearResponseCloud={this.props.clientsActions.clearResponseCloud}
          handleTimesClick={this.handleTimesClick}
          handleDeleteCloud={this.handleDeleteCloud}
        />
      );
    }

    return (
      <div className="content-container clients-container">
        <div className="clients-list-container">
          <IntermediateBlock
            loaded={!loading}
            render={() => this.pullDOM()}
            resultBlock={resultBlock}
          />
        </div>
        <div className="clients-info">{infoClient}</div>
      </div>
    );
  }
}

ClientsContainer.propTypes = {
  clients: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  type: PropTypes.string,
  resultBlock: PropTypes.object,
  toConfirm: PropTypes.object,
  isWorking: PropTypes.bool,
  async: PropTypes.object
};

function mapStateToProps(state) {
  return {
    clients: state.clientsReducer.clients,
    resultBlock: state.clientsReducer.resultBlock,
    resultBlockAddClient: state.clientsReducer.resultBlockAddClient,
    resultBlockCloud: state.clientsReducer.resultBlockCloud,
    confirmed: state.asyncReducer.confirmed,
    toConfirm: state.asyncReducer.toConfirm,
    isWorking: state.asyncReducer.isWorking,
    type: state.asyncReducer.type,
    loading: state.asyncReducer.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clientsActions: bindActionCreators(clientsActions, dispatch),
    async: bindActionCreators(asyncActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("ClientsContainer")(ClientsContainer));
