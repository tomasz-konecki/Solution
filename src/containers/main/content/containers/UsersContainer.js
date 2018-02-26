import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import * as usersActions from "../../../../actions/usersActions";
import Users from "../views/Users";

class UsersContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.userActions.loadUsers();
  }

  render() {
    return <Users users={this.props.users} />;
  }
}

// UsersContainer.propTypes = {
//   dispatch: PropTypes.function,
//   users: PropTypes.array
// };

function mapStateToProps(state) {
  return {
    users: state.users
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(usersActions, dispatch)
  };
}

UsersContainer.propTypes = {
  users: PropTypes.object,
  userActions: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
