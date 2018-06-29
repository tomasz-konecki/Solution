import React, { Component } from 'react';
import WebApi from "../../../api";
import Select from "react-select";
import "react-select/dist/react-select.css";
import ResultBlock from './../../common/ResultBlock';
import { translate } from 'react-translate';
import SpinnerButton from '../../form/spinner-btn/spinner-btn';
import './AddEmployeeToProject.scss';
class AddEmployeeToProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backspaceRemoves: true,
      multi: false,
      isLoading: false,
      value: '',
      errorBlock: null,
      ok: false,
      btnLoading: false,
      submitResult: null
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
  addEmployeeToProject = () => {
    this.setState({btnLoading: true, submitResult: null});
    const objectToSend = {
      employeeId: this.state.value.id,
      projectId: this.props.projectId,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      role: this.props.role,
      assignedCapacity: this.props.assignedCapacity,
      responsibilities: this.props.responsibilities
    }
    WebApi.assignments.post(objectToSend).then(response => {
        this.setState({btnLoading: false, 
          submitResult: {status: true, content: "Pomyślnie dodano użytkownika do projektu"}});
    }).catch(error => {
        this.setState({btnLoading: false, submitResult: {status: false, content: "Błąd serwera"}});
    })
}
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
      <div className="add-employe-container">
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

        
     
      </div>
    );
  }
}


export default translate("AddProjectOwner")(AddEmployeeToProject);
