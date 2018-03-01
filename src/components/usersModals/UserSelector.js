import React, { Component } from "react";
import StageOne from "./StageOne";
import StageTwo from "./StageTwo";

class UserSelector extends Component {
  constructor() {
    super();
    this.state = {
      oneIsVisible: true,
      twoIsVisible: false,
      selectedUser: ""
    };
    this.setSelectedUser = this.setSelectedUser.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  setSelectedUser(value) {
    this.setState({
      oneIsVisible: false,
      twoIsVisible: true,
      selectedUser: value
    });
  }

  resetState() {
    this.setState({
      oneIsVisible: true,
      twoIsVisible: false,
      selectedUser: ""
    });
  }

  render() {
    return (
      <div className="parent-container">
        <StageOne
          isVisible={this.state.oneIsVisible}
          setSelectedUser={this.setSelectedUser}
        />
        <StageTwo
          isVisible={this.state.twoIsVisible}
          selectedUser={this.state.selectedUser}
          resetState={this.resetState}
        />
      </div>
    );
  }
}

export default UserSelector;
