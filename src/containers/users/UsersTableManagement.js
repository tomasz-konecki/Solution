import React from "react";
import AddUser from "./AddUser";

import "../../scss/UsersTableManagement.scss";

class UsersTableManagement extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="title-container">
          <p>Users Table Management</p>
        </div>
        <AddUser />
      </div>
    );
  }
}

export default UsersTableManagement;
