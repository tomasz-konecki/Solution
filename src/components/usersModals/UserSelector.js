import React, { Component } from "react";
import StageOne from "./StageOne";
import StageTwo from "./StageTwo";
import DCMTWebApi from "../../api";

const initialState = {
  selectedUser: {},
  foundUsers: [],
  isStageTwo: false,
  errorBlock: null
};

class UserSelector extends Component {
  constructor() {
    super();
    this.state = initialState;

    this.setSelectedUser = this.setSelectedUser.bind(this);
    this.resetState = this.resetState.bind(this);
    this.setState = this.setState.bind(this);
    this.searchUsersInAD = this.searchUsersInAD.bind(this);
  }

  setSelectedUser(value) {
    this.setState({
      selectedUser: value,
      isStageTwo: true,
      errorBlock: null
    });
  }

  resetState() {
    this.setState({
      ...initialState
    });
  }

  searchUsersInAD(user) {
    this.setState({
      foundUsers: [],
      errorBlock: null
    }, () => {
      DCMTWebApi.searchAD(user)
      .then(response => {
        this.setState({ foundUsers: response.data.dtoObjects });
        this.refs.StageOne.stopLoading();
      })
      .catch(errorBlock => {
        this.setState({ errorBlock });
        this.refs.StageOne.stopLoading();
      });
    });
  }

  doAddUser = newUser => {
    DCMTWebApi.addUser(newUser.id, newUser.roles)
      .then(response => {
        this.setState({ errorBlock: {
          response
        }});
        this.refs.StageTwo.stopLoading();
        setTimeout(() => {
          this.props.closeModal();
        }, 500);
      })
      .catch(errorBlock => {
        this.setState({ errorBlock });
        this.refs.StageTwo.stopLoading();
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
            errorBlock={this.state.errorBlock}
          />
        )}
        {this.state.isStageTwo === true && (
          <StageTwo
            ref="StageTwo"
            selectedUser={this.state.selectedUser}
            resetState={this.resetState}
            errorBlock={this.state.errorBlock}
            doAddUser={this.doAddUser}
          />
        )}
      </div>
    );
  }
}

export default UserSelector;
