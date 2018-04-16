import React, { Component } from "react";
import StageOne from "./StageOne";
import StageTwo from "./StageTwo";
import DCMTWebApi from "../../../api";

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
  }

  setSelectedUser = user => {
    this.setState({
      selectedUser: user,
      isStageTwo: true,
      errorBlock: null
    });
  };

  resetState = () => {
    this.setState({
      ...initialState
    });
  };

  getUsers = user => {
    // if (!user) {
    //   return Promise.resolve({ options: [] });
    // }
    return DCMTWebApi.searchAD(user)
      .then(response => {
        return { options: response.data.dtoObjects };
      })
      .then(
        this.setState({
          errorBlock: null
        })
      )
      .catch(errorBlock => {
        this.setState({ errorBlock });
        // this.refs.StageOne.stopLoading();
      });
  };

  doAddUser = newUser => {
    DCMTWebApi.addUser(newUser.id, newUser.roles)
      .then(response => {
        this.setState({
          errorBlock: {
            response
          }
        });
        this.refs.StageTwo.stopLoading();
        setTimeout(() => {
          this.props.closeModal();
        }, 500);
      })
      .catch(errorBlock => {
        this.setState({ errorBlock });
        this.refs.StageTwo.stopLoading();
      });
  };

  render() {
    return (
      <div className="user-selector-container">
        {this.state.isStageTwo === false && (
          <StageOne
            ref="StageOne"
            setSelectedUser={this.setSelectedUser}
            foundUsers={this.state.foundUsers}
            errorBlock={this.state.errorBlock}
            getUsers={this.getUsers}
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
