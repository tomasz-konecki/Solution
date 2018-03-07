import React, { Component } from "react";
import StageOne from "./StageOne";
import StageTwo from "./StageTwo";
import DCMTWebApi from "../../api";

class UserSelector extends Component {
  constructor() {
    super();
    this.state = {
      selectedUser: {},
      foundUsers: [],
      isStageTwo: false
    };

    this.setSelectedUser = this.setSelectedUser.bind(this);
    this.resetState = this.resetState.bind(this);
    this.setState = this.setState.bind(this);
    this.searchUsersInAD = this.searchUsersInAD.bind(this);
  }

  setSelectedUser(value) {
    this.setState({
      selectedUser: value,
      isStageTwo: true
    });
    console.log("Selected user:", value);
  }

  resetState() {
    this.setState({
      selectedUser: {},
      isStageTwo: false
    });
  }

  searchUsersInAD(user) {
    this.setState({
      foundUsers: []
    });
    DCMTWebApi.searchAD(user)
      .then(response => {
        this.setState({ foundUsers: response.data });
        this.refs.StageOne.stopLoading();
      })
      .catch(error => {
        throw error;
      });
  }

  render() {
    return (
      <div className="user-selector-container">
        {this.state.isStageTwo === false && (
          <StageOne
            ref="StageOne"
            setSelectedUser={this.setSelectedUser}
            searchUsersInAD={this.searchUsersInAD}
            foundUsers={this.state.foundUsers}
          />
        )}
        {this.state.isStageTwo === true && (
          <StageTwo
            selectedUser={this.state.selectedUser}
            resetState={this.resetState}
          />
        )}
      </div>
    );
  }
}

export default UserSelector;
