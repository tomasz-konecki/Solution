import React, { Component } from 'react';
import DCMTWebApi from "../../../api";
import Select from "react-select";
import "react-select/dist/react-select.css";

class AddProjectOwner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backspaceRemoves: true,
      multi: true,
      isLoading: false
    };
  }

  handleChange = value => {
    this.setState({
      value
    });
  };

  checkLength = input => {
    return input.length >= 3;
  };

  getUsers = user => {
    return DCMTWebApi.getUsers({
      Limit: 20,
      PageNumber: 1,
      IsDeleted: false,
      Query: user
    })
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
      });
  };

  doSearch = input => {
    let isLoading = null;
    this.checkLength(input) ? (isLoading = true) : (isLoading = false);

    this.setState({
      isLoading
    });

    return this.checkLength(input)
      ? this.getUsers(input).then(
          this.setState({
            isLoading: false
          })
        )
      : Promise.resolve({ options: [] });
  };

  render() {
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;
    const { multi, value, backspaceRemoves, isLoading } = this.state;
    return (
      <div>
        <header>
          <h3 className="section-heading">Dodaj właściciela</h3>
        </header>
        <hr/>
        <AsyncComponent
            multi={multi}
            value={value}
            autoload={false}
            isLoading={isLoading}
            onChange={this.handleChange}
            labelKey="lastName"
            loadOptions={this.doSearch}
            backspaceRemoves={backspaceRemoves}
          />
      </div>
    );
  }
}

export default AddProjectOwner;
