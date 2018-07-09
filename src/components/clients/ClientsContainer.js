import React from "react";
import { connect } from "react-redux";
import * as clientsActions from "../../actions/clientsActions";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as asyncActions from "../../actions/asyncActions";

class ClientsContainer extends React.Component {
  state = {};
  componentDidMount = () => {
    this.props.clientsActions.loadClients();
  };
  render() {
    const { clients } = this.props;
    console.log(clients);
    console.log(this.props);

    return "List of clients";
  }
}

ClientsContainer.propTypes = {
  clients: PropTypes.array
};

function mapStateToProps(state) {
  return {
    clients: state.clientsReducer.clients
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clientsActions: bindActionCreators(clientsActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientsContainer);
