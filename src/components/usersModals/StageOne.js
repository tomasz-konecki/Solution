import React, { Component } from "react";
import "../../scss/components/usersModals/StageOne.scss";
import FoundUsersTable from "../users/FoundUsersTable";
import LoaderHorizontal from "../../components/common/LoaderHorizontal";

class StageOne extends Component {
  constructor() {
    super();

    this.state = {
      searchText: "",
      isLoading: false,
      isSearchingDone: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
  }

  handleInput(e) {
    this.setState({ searchText: e.target.value });
  }

  handleClick(e) {
    this.props.searchUsersInAD(this.state.searchText);
    this.setState({
      isLoading: true,
      isSearchingDone: true
    });
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleClick(e);
    }
  }

  stopLoading() {
    this.setState({ isLoading: false });
  }

  render() {
    return (
      <div className="stage-one-container">
        <input
          name="user"
          type="text"
          onChange={this.handleInput}
          onKeyUp={this.handleKeyUp}
        />
        <input type="button" value="Search" onClick={this.handleClick} />

        {this.state.isLoading === true && <LoaderHorizontal />}

        {this.state.isSearchingDone === true && (
          <FoundUsersTable
            foundUsers={this.props.foundUsers}
            setSelectedUser={this.props.setSelectedUser}
          />
        )}
      </div>
    );
  }
}

export default StageOne;
