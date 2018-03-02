import React, { Component } from "react";
import StageOne from "./StageOne";
import StageTwo from "./StageTwo";
import DCMTWebApi from "../../api";

class UserSelector extends Component {
  constructor() {
    super();
    this.state = {
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
      <div className="user-selector-container">
        <StageOne
          setSelectedUser={this.setSelectedUser}
          searchUsersInAD={this.searchUsersInAD}
          foundUsers={this.state.foundUsers}
        />
        {/* <StageTwo
          isVisible={this.state.twoIsVisible}
          foundUsers={this.state.foundUsers}
          resetState={this.resetState}
        /> */}
      </div>
    );
  }
}

export default UserSelector;
