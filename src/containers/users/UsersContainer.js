import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as usersActions from "../../actions/usersActions";
import UsersList from "../main/content/views/UsersList";
import UsersTableManagement from "./UsersTableManagement";
import "../../../node_modules/bootstrap/dist/css/bootstrap-grid.min.css";

import "../../scss/UsersContainer.scss";

class UsersContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.userActions.loadUsers();
  }

  render() {
    return (
      <div>
        <UsersTableManagement />
        <UsersList users={this.props.users} />
      </div>
    );
  }
}

UsersContainer.propTypes = {
  // dispatch: PropTypes.function,
  users: PropTypes.array
};

function mapStateToProps(store) {
  return {
    users: store.usersReducer.users
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(usersActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
