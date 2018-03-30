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
      multi: false,
      isLoading: false
    };
  }

  handleKeyUp = e => {
    console.log(e);
  };

  // onChange = value => {
  //   console.log(value);
  //   this.setState({
  //     value
  //   });
  // };

  getUsers = input => {
    if (input.length >= 3)
      this.setState({
        isLoading: true
      });

    return this.props.getUsers(input).then(
      this.setState({
        isLoading: false
      })
    );
  };

  handleClick = () => {
    this.props.setSelectedUser(this.state.value);
  };

  render() {
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;
    const { multi, value, backspaceRemoves, isLoading } = this.state;
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
          <AsyncComponent
            multi={multi}
            value={value}
            autoload={false}
            isLoading={isLoading}
            onChange={this.handleChange}
            // valueKey="lastName"
            labelKey="fullName"
            loadOptions={this.getUsers}
            backspaceRemoves={backspaceRemoves}
          />

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
