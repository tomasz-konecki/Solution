import React from "react";

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddUser = this.handleAddUser.bind(this);
  }

  handleAddUser() {
    console.log("Button clicked");
  }

  render() {
    return (
      <div className="add-user-button-container">
        <button className="add-user-button" onClick={this.handleAddUser}>
          Add User
        </button>
      </div>
    );
  }
}

export default AddUser;
