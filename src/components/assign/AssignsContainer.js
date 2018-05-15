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
      showAssignmentModal: false,
      nameSearch: "",
      positionSearch: "",
      skillsSearch: "",
      minSeniority: "",
      minYoe: ""
    };
  }

  componentDidMount() {
    this.refresh()();
  }

  refresh = (closeAssignmentsModal) => () => {
    if(closeAssignmentsModal) {
      setTimeout(() => {
        this.handleCloseAssigmentModal();
        this.getEmployees();
        this.getProjects();
      }, 500);
    }
    else {
      this.getEmployees();
      this.getProjects();
    }
  }

  getProjects = () => {
    this.setState({
      projects: undefined
    });
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
    this.setState({
      employees: undefined
    });
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

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

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
        refresh={this.refresh(true)}
      />
    </Modal>;
  }

  contains = stack => needle => {
    if(needle === "") return true;
    if(stack === null) return false;
    if(stack === undefined) return false;
    let val1 = stack.toLocaleLowerCase();
    let val2 = needle.toLocaleLowerCase().trim();
    return val1.indexOf(val2) >= 0;
  };

  searchFilter = (employee) => {
    let singleFields =
    this.contains(employee.firstName + " " + employee.lastName)(this.state.nameSearch)
    && this.contains(employee.title)(this.state.positionSearch);

    let found = {};
    let yoe = true;
    let levels = true;

    if(employee.skills.length === 0) {
      if(this.state.skillsSearch !== "" || this.state.minYoe !== "" || this.state.minSeniority !== undefined){
        return false;
      }
    }

    employee.skills.map((skill, index) => {
      if(skill.skillLevel === undefined) skill.skillLevel = skill.level;
      if(skill.skillName === undefined) skill.skillName = skill.name;

      this.state.skillsSearch.split(',').map((part, index) => {
        if(this.contains(skill.skillName)(part)){
          found[index] = true;
          yoe = yoe && (this.state.minYoe === "" ? true : skill.yearsOfExperience >= this.state.minYoe - 0);
          levels = levels && (this.state.minSeniority === "" ? true : skill.skillLevel >= this.state.minSeniority - 0);
        }
      });
    });

    let allFound = true;

    Object.values(found).map((findings) => {
      allFound = allFound && findings;
    });

    allFound = allFound && Object.keys(found).length === this.state.skillsSearch.split(',').length;

    return singleFields && allFound && yoe && levels;
  }

  pullEmployeeBlocks = () => {
    return this.state.employees !== undefined ?
    this.state.employees.map((employee, index) => {
      if(!this.searchFilter(employee)) return null;
      return <AssignEmployeeBlock
        key={index}
        employee={employee}
        name={employee.lastName}
        type={AssignDropTypes.EMPLOYEE}
      />;
    }) : <LoaderCircular />;
  }

  render() {
    return (
      <div className="row assign-container">
        { this.pullAssignmentDOM() }
        <div className="col-lg-2">
          <div className="content-container">
            <div className="row">
              <div className="col-lg-12">
                <div className="form-group assign-search-form">
                  <hr/>
                  <label htmlFor="nameSearch">Imię/Nazwisko</label>
                  <input name="nameSearch" type="text" className="form-control" onChange={this.handleChange}/>
                  <label htmlFor="positionSearch">Stanowisko</label>
                  <input name="positionSearch" type="text" className="form-control" onChange={this.handleChange}/>
                  <label htmlFor="skillsSearch">Umiejętności(po przecinku)</label>
                  <input name="skillsSearch" type="text" className="form-control" onChange={this.handleChange}/>
                  <label htmlFor="minSeniority">Minimalny poziom powyż.</label>
                  <input name="minSeniority" type="text" className="form-control" onChange={this.handleChange}/>
                  <label htmlFor="minYoe">Min. lat doświadczenia</label>
                  <input name="minYoe" type="text" className="form-control" onChange={this.handleChange}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="content-container scroll-container">
            <div className="scroll-container">
              { this.pullEmployeeBlocks() }
            </div>
          </div>
        </div>
        <div className="col-lg-4">
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
