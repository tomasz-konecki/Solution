import React, { Component } from "react";
import StageOne from "./StageOne";
import StageTwo from "./StageTwo";
import WebApi from "../../../api";
import PropTypes from "prop-types";

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
    return WebApi.users.get
      .adSearch(user)
      .then(response => {
        this.setState({
          errorBlock: response
        });
        return response;
      })
      .then(responsex => {
        let usersRequest = responsex.extractData();
        let usersList = [];
        usersRequest.map((i, index) => {
          let OneUser = Object.assign(i, i.hasAccount && { disabled: true });
          usersList.push(OneUser);
        });
        return { options: usersList };
      })
      .catch(errorBlock => {
        this.setState({ errorBlock });
        // this.refs.StageOne.stopLoading();
      });
  };

  doAddUser = newUser => {
    WebApi.users.post
      .add(newUser.id, newUser.roles)
      .then(response => {
        this.setState({
          errorBlock: response,
          loading: false
        });
        setTimeout(() => {
          this.props.closeModal();
        }, 500);
      })
      .catch(errorBlock => {
        this.setState({
          errorBlock,
          loading: false
        });
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
            isLoading={this.state.loading}
          />
        )}
      </div>
    );
  }
}

UserSelector.propTypes = {
  closeModal: PropTypes.func.isRequired
};

export default UserSelector;
