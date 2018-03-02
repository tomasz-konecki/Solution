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
      foundUsers: [
        {
          id: "abartczak",
          firstName: "Adam ",
          lastName: "Bartczak",
          email: "Adam.Bartczak@billennium.pl",
          phoneNumber: null
        },
        {
          id: "ablizniuk",
          firstName: "Adam",
          lastName: "Bliźniuk",
          email: "Adam.Blizniuk@billennium.pl",
          phoneNumber: null
        },
        {
          id: "abondarzewski",
          firstName: "Adam",
          lastName: "Bondarzewski",
          email: "Adam.Bondarzewski@billennium.pl",
          phoneNumber: null
        },
        {
          id: "asmagowski",
          firstName: "Adam",
          lastName: "Smagowski",
          email: "Adam.Smagowski@billennium.pl",
          phoneNumber: null
        },
        {
          id: "aszczepanski",
          firstName: "Adam",
          lastName: "Szczepański",
          email: "Adam.Szczepanski@billennium.pl",
          phoneNumber: null
        },
        {
          id: "AWojciuk",
          firstName: "Adam",
          lastName: "Wojciuk",
          email: "Adam.Wojciuk@billennium.pl",
          phoneNumber: "504142291"
        },
        {
          id: "awolinski",
          firstName: "Adam",
          lastName: "Woliński",
          email: "Adam.Wolinski@billennium.pl",
          phoneNumber: null
        }
      ]
    };

    this.setSelectedUser = this.setSelectedUser.bind(this);
    this.resetState = this.resetState.bind(this);
    this.setState = this.setState.bind(this);
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
        // console.log("Users found in AD:", response.data);
        this.setState({ foundUsers: response.data }).bind(this);
        // return response.data;
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
