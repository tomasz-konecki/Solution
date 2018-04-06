import React, { Component } from "react";
import "../../scss/components/usersModals/StageOne.scss";
import FoundUsersTable from "../users/FoundUsersTable";
import LoaderHorizontal from "../../components/common/LoaderHorizontal";
import ResultBlock from "../common/ResultBlock";
import Select from "react-select";
import "react-select/dist/react-select.css";
import DCMTWebApi from "../../api";

class StageOne extends Component {
  constructor() {
    super();

    this.state = {
      backspaceRemoves: true,
      multi: false,
      isLoading: false
    };
  }

  handleChange = value => {
    console.log(value);
    this.setState({
      value
    });
  };

  checkLength = input => {
    return input.length >= 3;
  };

  getUsers = input => {
    let isLoading = null;
    this.checkLength(input) ? (isLoading = true) : (isLoading = false);

    this.setState({
      isLoading
    });

    return this.checkLength(input)
      ? this.props.getUsers(input).then(
          this.setState({
            isLoading: false
          })
        )
      : Promise.resolve({ options: [] });
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
