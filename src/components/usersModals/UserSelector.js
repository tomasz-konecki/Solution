import React, { Component } from "react";
import StageOne from "./StageOne";
import StageTwo from "./StageTwo";
import DCMTWebApi from "../../api";

class UserSelector extends Component {
  constructor() {
    super();
    this.state = {
      oneIsVisible: true,
      twoIsVisible: false,
      selectedUser: "",
      foundUsers: []
    };

    this.setSelectedUser = this.setSelectedUser.bind(this);
    this.resetState = this.resetState.bind(this);
    this.setState = this.setState.bind(this);
    this.searchUsersInAD = this.searchUsersInAD.bind(this);
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

  searchUsersInAD(user) {
    DCMTWebApi.searchAD(user)
      .then(response => {
        this.setState({ foundUsers: response.data });
      })
      .catch(error => {
        throw error;
      });
  }

  render() {
    return (
      <div className="parent-container">
        <StageOne
          isVisible={this.state.oneIsVisible}
          setSelectedUser={this.setSelectedUser}
          searchUsersInAD={this.searchUsersInAD}
        />
        <StageTwo
          isVisible={this.state.twoIsVisible}
          foundUsers={this.state.foundUsers}
          resetState={this.resetState}
        />
      </div>
    );
  }
}

export default UserSelector;
