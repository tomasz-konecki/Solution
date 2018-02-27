import React from "react";
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

        <div className="add-user-button-container">
          <button className="add-user-button">Add User</button>
        </div>
      </div>
    );
  }
}

export default UsersTableManagement;
