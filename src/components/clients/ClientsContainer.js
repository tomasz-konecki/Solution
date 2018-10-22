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
import AddEditClient from "./AddEditClient/AddEditClient";
import SearchClient from "./searchClient/SearchClient";
import ShowRadioButtons from "./ShowRadioButtons/ShowRadioButtons";
import InfoClientContainer from "./infoClient/infoClientContainer";
import Spinner from "../common/LoaderCircular";

import "../../scss/components/clients/ClientsContainer.scss";

class ClientsContainer extends React.Component {
  state = {
    clients: [],
    client: {},
    clientIndex: null,
    sortingDirections: {
      name: "asc"
    },
    checked: "",
    loaded: false,
    searchInputValue: ''
  };

  componentDidMount = () => {
    this.props.clientsActions.loadClients();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.clients !== this.props.clients) {
      const updatedClient = nextProps.clients.filter(clientItem => {
        return Object.getOwnPropertyNames(nextProps.clients).length !== 0
          ? clientItem.id === nextProps.clients[0].id
          : {};
      });

      this.setState({
        clients: nextProps.clients,
        client: updatedClient[0],
        checked: null
      });
    }
    if (nextProps.loading === false && this.props.loading === true) {
      this.setState({ loaded: true });
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
    if (this.validatePropsForCloudReactivation(nextProps)) {
      this.props.async.setActionConfirmationProgress(true);
      this.props.clientsActions.reactivateCloud(nextProps.toConfirm.id);
    }
    if (this.validatePropsForResponsiblePersonDeletion(nextProps)) {
      this.props.async.setActionConfirmationProgress(true);
      this.props.clientsActions.deleteResponsiblePerson(nextProps.toConfirm.id);
    }
    if (this.validatePropsForResponsiblePersonReactivation(nextProps)) {
      this.props.async.setActionConfirmationProgress(true);
      this.props.clientsActions.reactivateResponsiblePerson(
        nextProps.toConfirm.id
      );
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

  validatePropsForCloudReactivation(nextProps) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === "reactivateCloud"
    );
  }

  validatePropsForResponsiblePersonDeletion(nextProps) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === "deleteResponsiblePerson"
    );
  }

  validatePropsForResponsiblePersonReactivation(nextProps) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === "reactivateResponsiblePerson"
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

  resetSearchInput = () => {
    this.setState({
      searchInputValue: ''
    })
  }

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
        resetSearchInput={this.resetSearchInput}
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
    this.setState({ clients: updatedList, checked: null, searchInputValue: e.target.value});
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

  clientNameClickedHandler = (client, index) => {
    this.setState({
      client,
      clientIndex: index
    });
  };

  handleAddCloud = (name, fields, clientId) => {
    this.props.clientsActions.addCloud(name, fields, clientId);
  };

  handleEditCloud = (cloudId, name, fields, clientId) => {
    this.props.clientsActions.editCloud(cloudId, name, fields, clientId);
  };

  handleAddResponsiblePerson = (
    responsiblePersonId,
    firstName,
    lastName,
    client,
    email,
    phoneNumber
  ) => {
    this.props.clientsActions.addResponsiblePerson(
      responsiblePersonId,
      firstName,
      lastName,
      client,
      email,
      phoneNumber
    );
  };

  handleEditResponsiblePerson = (
    responsiblePersonId,
    firstName,
    lastName,
    client,
    email,
    phoneNumber
  ) => {
    this.props.clientsActions.editResponsiblePerson(
      responsiblePersonId,
      firstName,
      lastName,
      client,
      email,
      phoneNumber
    );
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

  handleDeleteResponsiblePerson = (id, name) => {
    const { async, t } = this.props;
    async.setActionConfirmation(true, {
      key: "deleteResponsiblePerson",
      string: `${t("RemovingResponsiblePerson")} ${name}`,
      id: id,
      successMessage: t("ResponsiblePersonRemoved")
    });
  };

  handleReactivateCloud = (id, name) => {
    const { async, t } = this.props;
    async.setActionConfirmation(true, {
      key: "reactivateCloud",
      string: `${t("ReactivatingCloud")} ${name}`,
      id: id,
      successMessage: t("CloudReactivated")
    });
  };

  handleReactivateResponsiblePerson = (id, name) => {
    const { async, t } = this.props;
    async.setActionConfirmation(true, {
      key: "reactivateResponsiblePerson",
      string: `${t("ReactivatingResponsiblePerson")} ${name}`,
      id: id,
      successMessage: t("ResponsiblePersonReactivated")
    });
  };

  radioButtonSingleClick = value => {
    if (value === this.state.checked) {
      this.setState({ clients: this.props.clients, checked: "" });
    }
  };

  pullDOM = () => {
    const {
      clientsActions,
      loading,
      resultBlockAddClient,
      t,
      resultBlock
    } = this.props;
    const { clients, checked, searchInputValue } = this.state;
    return (
      <React.Fragment>
        <div className="clients-operators">
          <div className="clients-add-search">
            <AddEditClient
              addClient={clientsActions.addClient}
              resultBlock={resultBlockAddClient}
              resetSearchInput={this.resetSearchInput}
            />
            <SearchClient filter={this.filterList} inputValue={searchInputValue} t={t} />
          </div>
          <ShowRadioButtons
            t={t}
            radioButtonClick={this.radioButtonClick}
            radioButtonSingleClick={this.radioButtonSingleClick}
            checked={checked}
          />
        </div>
        <ClientsList
          clients={clients}
          options={this.generateOptions}
          t={t}
          sortBy={this.sortBy}
          clientNameClickedHandler={this.clientNameClickedHandler}
          loading={loading}
        />
        {resultBlock ? (
          clients.length === 0 && (
            <span className="clients-not-found">{t("ClientsNotFound")}</span>
          )
        ) : (
          <h1>Error during loading</h1>
        )}
      </React.Fragment>
    );
  };


  render() {
    let {
      resultBlock,
      resultBlockAddClient,
      resultBlockCloud,
      resultBlockResponsiblePerson,
      t,
      clientsActions
    } = this.props;
    let { client, loaded } = this.state;
    let infoClient = null;

    if (client && client.name) {
      infoClient = (
        <InfoClientContainer
          client={client}
          t={t}
          onEditClient={clientsActions.editClient}
          handleAddCloud={this.handleAddCloud}
          handleEditCloud={this.handleEditCloud}
          handleDeleteCloud={this.handleDeleteCloud}
          handleReactivateCloud={this.handleReactivateCloud}
          handleAddResponsiblePerson={this.handleAddResponsiblePerson}
          handleEditResponsiblePerson={this.handleEditResponsiblePerson}
          handleDeleteResponsiblePerson={this.handleDeleteResponsiblePerson}
          handleReactivateResponsiblePerson={
            this.handleReactivateResponsiblePerson
          }
          resultBlockAddClient={resultBlockAddClient}
          resultBlockCloud={resultBlockCloud}
          resultBlockResponsiblePerson={resultBlockResponsiblePerson}
          clientsActions={clientsActions}
          handleTimesClick={this.handleTimesClick}
          handleSyncClick={this.handleSyncClick}
        />
      );
    }

    return (
      <div className="content-container clients-container">
        {loaded ? (
          <React.Fragment>
            <div className="clients-list-container">
              <IntermediateBlock
                loaded={loaded}
                render={() => this.pullDOM()}
                resultBlock={resultBlock}
              />
            </div>
            <div className="clients-info">{infoClient}</div>
          </React.Fragment>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

ClientsContainer.propTypes = {
  clients: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  type: PropTypes.string,
  resultBlock: PropTypes.object,
  resultBlockCloud: PropTypes.object,
  resultBlockResponsiblePerson: PropTypes.object,
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
    resultBlockResponsiblePerson:
      state.clientsReducer.resultBlockResponsiblePerson,
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
