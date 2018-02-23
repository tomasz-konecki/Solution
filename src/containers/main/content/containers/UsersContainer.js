import React from "react";
import { connect } from "react-redux";
import PropTypes from "../../../../../node_modules/prop-types/checkPropTypes";
import { loadUsers } from "../../../../actions/usersActions";
import Users from "../views/Users";

class UsersContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    console.log(this.props.users);
    this.props.loadUsers();
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
    loadUsers: () => {
      dispatch(loadUsers());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
