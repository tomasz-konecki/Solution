import React from "react";
import { connect } from "react-redux";
import PropTypes from "../../../node_modules/prop-types/checkPropTypes";
import { loadUsers } from "../../actions/usersActions";
import UsersList from "../main/content/views/UsersList";
import UsersTableManagement from "./UsersTableManagement";

class UsersContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadUsers();
    console.log("USERS_CONTAINER PROPS - ", this.props);
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
    loadUsers: () => {
      dispatch(loadUsers());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
