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
import AddClient from "./AddClient/AddClient";
import SearchClient from "./searchClient/SearchClient";
import ShowRadioButtons from "./ShowRadioButtons/ShowRadioButtons";
import InfoClientContainer from "./infoClient/infoClientContainer";

import "../../scss/components/clients/ClientsContainer.scss";
class ClientsContainer extends React.Component {
  state = {
    clients: [],
    loaded: false,
    editingInput: null,
    clientName: null,
    error: null,
    editClickDisabled: true,
    sortingDirections: {
      name: "asc"
    },
    checked: "activated",
    firstReceiving: true,
    client: {
      index: null,
      id: null,
      name: null
    }
  };

  componentDidMount = () => {
    this.props.clientsActions.loadClients();
    this.radioButtonClick("activated");
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.clients !== this.props.clients) {
      if (this.state.firstReceiving) {
        this.setState({ firstReceiving: false });
      } else {
        this.setState({ clients: nextProps.clients });
      }
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

  handleTimesClick = (id, name, t) => {
    this.props.async.setActionConfirmation(true, {
      key: "deleteClient",
      string: `${t("Removing")} ${name}`,
      id: id,
      successMessage: t("ClientRemoved")
    });
  };

  handleSyncClick = (id, name, t) => {
    this.props.async.setActionConfirmation(true, {
      key: "reactivateClient",
      string: `${t("Reactivating")} ${name}`,
      id: id,
      successMessage: t("ClientReactivated")
    });
  };

  handleEditClick = (id, index) => {
    this.setState({ editingInput: index });
  };

  handleGetValueFromInput = (value, error) => {
    if (!error) {
      this.setState({
        editClickDisabled: false,
        clientName: value,
        error: error
      });
    } else {
      this.setState({
        editClickDisabled: true,
        clientName: value,
        error: error
      });
    }
  };

  handleEditSaveClick = id => {
    if (!this.state.error) {
      this.props.clientsActions.saveEdit(id, this.state.clientName);
      this.setState({ editingInput: null });
    }
  };

  generateOptions = (id, isDeleted, name, index, t) => {
    let content = [];
    let { editingInput } = this.state;

    if (!isDeleted) {
      content.push(
        <button
          title={t("DeleteClient")}
          key={1}
          onClick={() => this.handleTimesClick(id, name, t)}
        >
          <Icon icon="times" iconType="fa" />
        </button>
      );
    } else {
      content.push(
        <button
          title={t("ReactivateClient")}
          key={2}
          onClick={() => this.handleSyncClick(id, name, t)}
        >
          <Icon icon="sync-alt" iconType="fa" />
        </button>
      );
    }
    if (editingInput === index) {
      content.push(
        <button
          title={t("SaveClient")}
          disabled={this.state.editClickDisabled}
          key={3}
          onClick={() => this.handleEditSaveClick(id, index)}
        >
          <Icon icon="check" iconType="fa" />
        </button>
      );
    } else {
      content.push(
        <button
          title={t("EditClient")}
          key={4}
          onClick={() =>
            this.handleEditClick(id, index, this.handleGetValueFromInput)
          }
        >
          <Icon icon="edit" iconType="fa" />
        </button>
      );
    }

    return content;
  };

  filterList = e => {
    let searchedValue = e.target.value;
    let updatedList = this.props.clients;
    if (searchedValue && this.props.clients) {
      updatedList = updatedList.filter((item, index) => {
        if (item.name && searchedValue) {
          return (
            item.name.toLowerCase().indexOf(searchedValue.toLowerCase()) >= 0
          );
        }
      });
    }
    this.setState({ clients: updatedList });
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

  clientNameClickedHandler = (id, name, clouds, index, t) => {
    this.setState({
      client: { index: index, id: id, name: name, clouds: clouds }
    });
  };

  handleAddCloudSave = (name, clientId) => {
    this.props.clientsActions.addCloud(name, clientId);
  };

  pullDOM = (editingInput, clients, t, filterList, sortBy, checked) => {
    return (
      <Aux>
        <AddClient
          addClient={this.props.clientsActions.addClient}
          loading={this.props.loading}
          resultBlock={this.props.resultBlockAddClient}
        />
        <SearchClient filter={filterList} t={t} />
        <ShowRadioButtons
          t={t}
          radioButtonClick={this.radioButtonClick}
          checked={checked}
        />
        <ClientsList
          clients={clients}
          options={this.generateOptions}
          editingInput={editingInput}
          handleGetValueFromInput={this.handleGetValueFromInput}
          t={t}
          sortBy={sortBy}
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
    let { editingInput, loaded, clients, checked, client } = this.state;
    let infoClient = null;
    console.log(this.props);
    if (client.name) {
      infoClient = (
        <InfoClientContainer
          client={client}
          t={t}
          handleAddCloudSave={this.handleAddCloudSave}
          loading={loading}
          resultBlock={resultBlockCloud}
        />
      );
    }

    return (
      <div className="content-container clients-container">
        <div className="clients-list-container">
          <IntermediateBlock
            loaded={loaded}
            render={() =>
              this.pullDOM(
                editingInput,
                clients,
                t,
                this.filterList,
                this.sortBy,
                checked
              )
            }
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
