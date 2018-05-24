import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import WebApi from '../../api';
import ResultBlock from '../common/ResultBlock';

class AssignmentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectRole: "",
      startDate: null,
      estimatedEndDate: null,
      responsibilities: {
        0: ""
      },
      assignedCapacity: "1",
      errorBlock: {}
    };
  }

  getResponsibilityValue = (index) => {
    if(this.state.responsibilities[index] !== undefined) return this.state.responsibilities[index];
    else return "";
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleMapChange = index => event => {
    const responsibilities = this.state.responsibilities;
    responsibilities[index] = event.target.value;
    this.setState({
      responsibilities
    });
  };

  handleStartDate = date => {
    this.setState({
      startDate: date
    });
  };

  handleEndDate = date => {
    const a = this.state.startDate;
    const b = date;
    let estimatedEndDate = moment();

    a.diff(b) > 0
      ? (estimatedEndDate = this.state.startDate)
      : (estimatedEndDate = date);

    this.setState({
      estimatedEndDate
    });
  };

  mapResponsibilityFields = () => {
    return Object.keys(this.state.responsibilities).map((index) => {
      return <input
        key={index}
        type="text"
        className="form-control"
        name={"responsibility" + index}
        onChange={this.handleMapChange(index)}
        value={this.getResponsibilityValue(index)}
      />;
    });
  };

  addResponsibility = () => {
    let responsibilities = this.state.responsibilities;
    const len = Object.keys(responsibilities).length;

    responsibilities[len] = "";

    this.setState({
      responsibilities
    });
  }

  handleSubmit = event => {
    event.preventDefault();
  };

  assignEmployeeToProject = () => {
    WebApi.assignments.post({
      employeeId: this.props.employee.id,
      projectId: this.props.project.id,
      startDate: this.state.startDate,
      endDate: this.state.estimatedEndDate,
      role: this.state.projectRole,
      assignedCapacity: this.state.assignedCapacity - 0,
      responsibilities: Object.values(this.state.responsibilities)
    })
    .then(response => {
      this.setState({
        errorBlock: response
      });
      if(this.props.refresh !== undefined && response.errorOccurred() === false){
        this.props.refresh(true)();
      }
    })
    .catch(error => {
      this.setState({
        errorBlock: error
      });
    });
  };

  render() {
    const { employee, project } = this.props;

    const {
      startDate,
      estimatedEndDate
    } = this.state;

    return (
      <div className="assignment-modal">
        <span className="assign-text-breathe-room">Przypisanie</span>
        <span className="assign-text-bold">{employee.firstName} {employee.lastName}</span>
        <span className="assign-text-breathe-room"> -> </span>
        <span className="assign-text-bold">{project.name}</span>
        <hr/>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label htmlFor="projectRole" className="col-sm-3 col-form-label">
              Rola w projekcie:
            </label>
            <div className="col-sm-9 assign-line-fix">
              <input
                type="text"
                className="form-control"
                name="projectRole"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="projectRole" className="col-sm-3 col-form-label">
              Odpowiedzialności:
            </label>
            <div className="col-sm-8 assign-line-fix assign-responsibility-row">
              {this.mapResponsibilityFields()}
            </div>
            <div className="col-sm-1 assign-line-fix assign-responsibility-row">
              <button onClick={this.addResponsibility} className="dcmt-button button-success">+</button>
            </div>
          </div>
          <hr/>
          <div className="form-group row">
            <div className="col-sm-6">
              <div className="row">
                <label htmlFor="projectRole" className="col-sm-5 col-form-label">
                  Data startu:
                </label>
                <div className="col-sm-7 assign-line-fix">
                <DatePicker
                  selected={startDate}
                  selectsStart
                  startDate={startDate}
                  endDate={estimatedEndDate}
                  onChange={this.handleStartDate}
                  locale="pl"
                  dateFormat="DD/MM/YYYY"
                  todayButton={"Dzisiaj"}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  className="form-control"
                />
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="row">
                <label htmlFor="projectRole" className="col-sm-5 col-form-label">
                  Kończy:
                </label>
                <div className="col-sm-7 assign-line-fix">
                  <DatePicker
                    selected={estimatedEndDate}
                    selectsEnd
                    startDate={startDate}
                    endDate={estimatedEndDate}
                    onChange={this.handleEndDate}
                    locale="pl"
                    dateFormat="DD/MM/YYYY"
                    todayButton={"Dzisiaj"}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr/>
          <div className="form-group row">
            <div className="col-sm-6">Wymiar pracy: </div>
            <div className="col-sm-6">
              <select value={this.state.assignedCapacity} onChange={this.handleChange} name="assignedCapacity" className="form-control manual-input">
                <option value="0.2">1/5</option>
                <option value="0.25">1/4</option>
                <option value="0.5">1/2</option>
                <option value="0.75">3/4</option>
                <option value="1">FTE</option>
              </select>
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col-sm-10">
              <ResultBlock
                errorBlock={this.state.errorBlock}
                errorOnly={false}
                successMessage="Przypisano pracownika!"
              />
            </div>
            <div className="col-sm-2 button-full-width">
              <button onClick={this.assignEmployeeToProject} className="dcmt-button button-success">Dodaj</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default AssignmentModal;
