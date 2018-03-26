import React, { Component } from "react";
import "../../scss/components/usersModals/StageOne.scss";
import FoundUsersTable from "../users/FoundUsersTable";
import LoaderHorizontal from "../../components/common/LoaderHorizontal";
import ResultBlock from "../common/ResultBlock";
import Select from "react-select";
import "react-select/dist/react-select.css";
import DCMTWebApi from "../../api";
import { Throttle } from "react-throttle";

class StageOne extends Component {
  constructor() {
    super();

    this.state = {
      backspaceRemoves: true,
      multi: false
    };
  }

  onChange = value => {
    this.setState({
      value
    });
  };

  getUsers = input => {
    console.log(input);
    if (input.length >= 3) return this.props.getUsers(input);
  };

  handleClick = () => {
    this.props.setSelectedUser(this.state.value);
  };

  render() {
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;
    return (
      <div className="stage-one-container">
        <header>
          <h3 className="section-heading">Wyszukaj użytkownika w AD</h3>
        </header>
        <div className="error-block-container">
          {this.props.errorBlock !== null && (
            <ResultBlock errorBlock={this.props.errorBlock} />
          )}
        </div>
        <div className="search-container">
          <Throttle time="2000" handler="onChange">
            <AsyncComponent
              multi={this.state.multi}
              value={this.state.value}
              onChange={this.onChange}
              // valueKey="lastName"
              labelKey="fullName"
              loadOptions={this.getUsers}
              backspaceRemoves={this.state.backspaceRemoves}
            />
          </Throttle>

          {this.state.value && (
            <div className="forward-button-container">
              <button
                className="btn btn-primary dcmt-button"
                onClick={this.handleClick}
              >
                Dalej
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default StageOne;
