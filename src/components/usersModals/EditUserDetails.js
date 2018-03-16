import React, { Component } from "react";
import UserDetailsBlock from "./UserDetailsBlock";
import UserRoleAssigner from "./UserRoleAssigner";

class EditUserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log("EditUserDetails USER:", this.props.user);
    return (
      <div>
        <h2>Edit user details Modal</h2>
        <UserDetailsBlock editable={true} user={this.props.user} />
        <UserRoleAssigner roles={this.props.user.roles} />
      </div>
    );
  }
}

export default EditUserDetails;
