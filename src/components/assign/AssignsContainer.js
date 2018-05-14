import React, { Component } from 'react';
import DCMTWebApi from '../../api';
import CapacitySlider from './../employees/CapacitySlider';
import SenioritySlider from './../employees/SenioritySlider';
import LoaderCircular from './../common/LoaderCircular';
import SkillRow from './../skills/SkillRow';
import AssignDropTypes from './AssignDropTypes';

import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';
import AssignProjectBlock from './AssignProjectBlock';
import AssignEmployeeBlock from './AssignEmployeeBlock';
import Modal from 'react-responsive-modal';
import AssignmentModal from './AssignmentModal';

@DragDropContext(HTML5Backend)
class AssignsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAssignmentModal: false
    };
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

  onEmployeeDrop = (project, index) => {
    return (employee) => {
      this.handleOpenAssigmentModal(employee, project);
    };
  }

  handleCloseAssigmentModal = () => {
    this.setState({
      showAssignmentModal: false
    });
  }

  handleOpenAssigmentModal = (employee, project) => {
    this.setState({
      showAssignmentModal: true,
      employeeForModal: employee,
      projectForModal: project
    });
  }

  pullAssignmentDOM = () => {
    return <Modal
        open={this.state.showAssignmentModal}
        classNames={{ modal: "Modal Modal-assignment" }}
        contentLabel="Assign"
        onClose={this.handleCloseAssigmentModal}
      >
      <AssignmentModal
        employee={this.state.employeeForModal}
        project={this.state.projectForModal}
      />
    </Modal>;
  }

  render() {
    return (
      <div className="row assign-container">
        { this.pullAssignmentDOM() }
        <div className="col-lg-6">
          <div className="content-container scroll-container">
            <div className="scroll-container">
              {
                this.state.employees !== undefined ?
                this.state.employees.map((employee, index) => {
                  return <AssignEmployeeBlock
                    key={index}
                    employee={employee}
                    name={employee.lastName}
                    type={AssignDropTypes.EMPLOYEE}
                  />;
                }) : <LoaderCircular />
              }
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="content-container">
          {
            this.state.projects !== undefined ?
            this.state.projects.map((project, index) => {
              return <AssignProjectBlock
                key={index}
                accepts={[AssignDropTypes.EMPLOYEE]}
                onDrop={this.onEmployeeDrop(project, index)}
                project={project}
              />;
            }) : <LoaderCircular />
          }
          </div>
        </div>
      </div>
    );
  }
}

export default AssignsContainer;
