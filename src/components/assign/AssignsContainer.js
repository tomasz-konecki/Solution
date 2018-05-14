import React, { Component } from 'react';
import DCMTWebApi from '../../api';
import CapacitySlider from './../employees/CapacitySlider';
import SenioritySlider from './../employees/SenioritySlider';
import LoaderCircular from './../common/LoaderCircular';

class AssignsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getEmployees();
    this.getProjects();
  }

  getProjects = () => {
    DCMTWebApi.getProjects({
      page: 1,
      limit: 300,
      projectFilter: {
        isDeleted: false,
        isActive: true
      }
    })
      .then((projects) => {
        this.setState({
          projects: projects.data.dtoObject.results,
          errorBlock: {
            response: projects
          }
        });
      })
      .catch((error) => {
        this.setState({
          errorBlock: error,
          loading: false
        });
      });
  }

  getEmployees = () => {
    DCMTWebApi.getEmployees({
      page: 1,
      limit: 300,
      employeeFilter: {
        hasAccount: true
      }
    })
      .then((employees) => {
        this.setState({
          employees: employees.data.dtoObject.results,
          errorBlock: {
            response: employees
          }
        });
      })
      .catch((error) => {
        this.setState({
          errorBlock: error,
          loading: false
        });
      });
  }

  seniorityLevelToString(level, reverse = false) {
    if(reverse) switch(level){
      case "Junior": return 1;
      case "Pro": return 2;
      case "Senior": return 3;
      case "Lead": return 4;
    }
    switch(level){
      case 1: return "Junior";
      case 2: return "Pro";
      case 3: return "Senior";
      case 4: return "Lead";
    }
  }

  render() {
    return (
      <div className="row assign-container">
        <div className="col-lg-6">
          <div className="content-container">
            {
              this.state.employees !== undefined ?
              this.state.employees.map((employee, index) => {
                return <div key={index} className="row assign-container-left-row">
                  <div className="col-lg-6">
                    <a target="_blank" href={`/main/employees/${employee.id}`}>
                      {employee.firstName} {employee.lastName}
                    </a>
                  </div>
                  <div className="col-lg-6">
                    <SenioritySlider
                      seniorityLevel={this.seniorityLevelToString(employee.seniority, true)}
                      showText={false}
                    />
                    <CapacitySlider
                      capacityLevel={employee.baseCapacity}
                      capacityLeft={employee.capacityLeft}
                    />
                  </div>
                </div>;
              }) : <LoaderCircular />
            }
          </div>
        </div>
        <div className="col-lg-6">
          <div className="content-container">
            {
              this.state.projects !== undefined ?
              this.state.projects.map((project, index) => {
                return <div key={index} className="row assign-container-right-row">
                  <div className="col-lg-8">{project.name}</div>
                  <div className="col-lg-4">
                  </div>
                </div>;
              }) : <LoaderCircular />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default AssignsContainer;
