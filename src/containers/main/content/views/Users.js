import React, { Component } from "react";

import UsersTableManagement from "../../../users/UsersTableManagement";
import UsersList from "./UsersList";

class Users extends Component {
  constructor(props) {
    super(props);
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

export default Users;
