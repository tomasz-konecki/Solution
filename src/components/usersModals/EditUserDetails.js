import React, { Component } from "react";
import UserDetailsBlock from "./UserDetailsBlock";
import UserRoleAssigner from "./UserRoleAssigner";

class EditUserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstName: "Jan",
        lastName: "Nowak",
        id: "jnowak",
        roles: ["Administrator", "Team Leader"],
        email: "jan.nowak@ex.com"
      }
    };
  }
  render() {
    return (
      <div>
        <UserDetailsBlock editable={true} user={this.props.user} />
        <UserRoleAssigner roles={this.state.user.roles} />
        <div className="edit-user-button-container">
          <button>Potwierdź</button>
        </div>
      </div>
    );
  }
}

export default EditUserDetails;
