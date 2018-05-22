import React, { Component } from 'react';
import WebApi from "../../../api";
import Select from "react-select";
import "react-select/dist/react-select.css";
import ResultBlock from './../../common/ResultBlock';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

class AddEmployeeToProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backspaceRemoves: true,
      multi: false,
      isLoading: false,
      value: '',
      errorBlock: null,
      ok: false
    };
  }

  completeProjectSelection = (employee) => {
    if(this.props.aetpStageTwo !== undefined) this.props.aetpStageTwo(employee);
  }

  handleChange = value => {
    this.setState({
      value
    });
  };

  checkLength = input => {
    return input.length >= 3;
  };

  getEmployees = employee => {
    return WebApi.employees.post.list({
      Limit: 500,
      PageNumber: 1,
      IsDeleted: false,
      HasAccount: true,
      Query: employee
    })
      .then(response => {
        return { options: response.extractData().results };
      })
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
      ? this.getEmployees(input).then(
          this.setState({
            isLoading: false
          })
        )
      : Promise.resolve({ options: [] });
  };

  render() {
    const { t } = this.props;
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;
    const { multi, value, backspaceRemoves, isLoading } = this.state;
    return (
      <div>
        <header>
          <h3 className="section-heading">Dodaj pracownika do projektu</h3>
        </header>
        <hr/>
        <AsyncComponent
            multi={multi}
            value={value}
            autoload={false}
            isLoading={isLoading}
            onChange={this.handleChange}
            labelKey="fullName"
            loadOptions={this.doSearch}
            backspaceRemoves={backspaceRemoves}
            valueKey="id"
          />
          <hr/>
          <div className="row">
            <div className="col-sm-10">
              Pamiętaj, że pracownik wymaga aktywnego konta by być przypisanym do projektu
            </div>
            <div className="col-sm-2">
            {
              this.state.value !== '' ?
              <button onClick={this.completeProjectSelection(this.state.value)} className="dcmt-button button-success">Przypisz</button>
              : null
            }
            </div>
          </div>
      </div>
    );
  }
}

AddEmployeeToProject.propTypes = {
  project: PropTypes.object.isRequired,
  completed: PropTypes.func.isRequired
};

export default translate("AddProjectOwner")(AddEmployeeToProject);
