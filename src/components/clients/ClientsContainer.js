import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import { ACTION_CONFIRMED } from "./../../constants";
import * as asyncActions from "../../actions/asyncActions";
import * as clientsActions from "../../actions/clientsActions";

import ClientsList from "./ClientsList";
import IntermediateBlock from "../common/IntermediateBlock";
import Icon from "../common/Icon";

class ClientsContainer extends React.Component {
  state = { loaded: false, editingInput: null };

  componentDidMount = () => {
    this.props.clientsActions.loadClients();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading === false && this.props.loading === true) {
      this.setState({ loaded: !this.state.loaded });
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

  handleTimesClick = (id, name) => {
    this.props.async.setActionConfirmation(true, {
      key: "deleteClient",
      string: `Removing... ${name}`,
      id: id,
      successMessage: "Client has been removed."
    });
  };

  handleSyncClick = (id, name) => {
    this.props.async.setActionConfirmation(true, {
      key: "reactivateClient",
      string: `Reactivate user ${name}`,
      id: id,
      successMessage: "Client has been reactivated."
    });
  };

  handleEditClick = (id, index) => {
    console.log(id, index);
    this.setState({ editingInput: index });
  };

  handleGetValueFromInput = (value, error) => {
    console.log("AHAhahahah", value, error);
  };

  generateOptions = (id, isDeleted, name, index) => {
    let content = [];
    let { editingInput } = this.state;

    if (!isDeleted) {
      content.push(
        <button key={1} onClick={() => this.handleTimesClick(id, name)}>
          <Icon icon="times" iconType="fa" />
        </button>
      );
    } else {
      content.push(
        <button key={2} onClick={() => this.handleSyncClick(id, name)}>
          <Icon icon="sync-alt" iconType="fa" />
        </button>
      );
    }
    if (editingInput === index) {
      content.push(
        <button key={3} onClick={() => this.handleEditSaveClick(id, index)}>
          <Icon icon="check" iconType="fa" />
        </button>
      );
    } else {
      content.push(
        <button
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

  pullDOM = (editingInput, clients) => {
    return (
      <ClientsList
        clients={clients}
        options={this.generateOptions}
        editingInput={editingInput}
        handleGetValueFromInput={this.handleGetValueFromInput}
      />
    );
  };

  render() {
    let { replyBlock, clients } = this.props;
    let { editingInput, loaded } = this.state;

    return (
      <div className="content-container clients-container">
        <IntermediateBlock
          loaded={loaded}
          render={() => this.pullDOM(editingInput, clients)}
          resultBlock={replyBlock}
        />
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
)(ClientsContainer);
