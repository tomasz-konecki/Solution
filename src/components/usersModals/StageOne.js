import React, { Component } from "react";
import "../../scss/components/usersModals/StageOne.scss";

class StageOne extends Component {
  constructor() {
    super();

    this.state = {
      show: "",
      searchText: ""
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    this.setState({ show: "stage-one-show" });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible !== this.props.isVisible) {
      this.setState({
        show: this.props.isVisible ? "stage-one-hide" : "stage-one-show"
      });
    }
  }

  handleInput(e) {
    this.setState({ searchText: e.target.value });
  }

  handleClick(e) {
    this.props.setSelectedUser(this.state.searchText);
    this.props.searchUsersInAD(this.state.searchText);
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleClick(e);
    }
  }
  render() {
    return (
      <div className={["stage-one-container", this.state.show].join(" ")}>
        <input
          name="user"
          type="text"
          onChange={this.handleInput}
          onKeyUp={this.handleKeyUp}
        />
        <input type="button" value="Search" onClick={this.handleClick} />
      </div>
    );
  }
}

export default StageOne;
