import React from "react";
import AddUser from "./AddUser";

class UsersTableManagement extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="title-container col-3">
            <p>Users:</p>
          </div>
          <AddUser />
        </div>
      </div>
    );
  }
}

export default UsersTableManagement;
