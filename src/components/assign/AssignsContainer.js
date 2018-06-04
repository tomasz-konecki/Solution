import React, { Component } from 'react';
import WebApi from '../../api';
import ResponseParser from "../../api/responseParser";
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
import { translate } from 'react-translate';
import Icon from './../common/Icon';

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
      minYoe: "",
      p_nameSearch: ""
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
    WebApi.projects.post.list({
      page: 1,
      limit: 300,
      projectFilter: {
        isActive: true
      },
      isDeleted: false
    })
      .then((projects) => {
        this.setState({
          projects: projects.extractData().results
        });
      })
      .catch((error) => {
        this.setState({
          loading: false
        });
      });
  }

  getEmployees = () => {
    this.setState({
      employees: undefined
    });

    WebApi.employees.post.list({
      limit: 3000,
      employeeFilter: {
        hasAccount: true
      }
    })
      .then((employees) => {
        this.setState({
          employees: employees.extractData().results
        });
      })
      .catch((error) => {
        this.setState({
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

  clearFilters = event => {
    this.setState({
      nameSearch: "",
      positionSearch: "",
      skillsSearch: "",
      minSeniority: "",
      minYoe: "",
      p_nameSearch: ""
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
        refresh={this.refresh}
      />
    </Modal>;
  };

  contains = stack => needle => {
    if(needle === "") return true;
    if(stack === null) return false;
    if(stack === undefined) return false;
    let val1 = stack.toLowerCase();
    let val2 = needle.toLowerCase().trim();
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
      if(this.state.skillsSearch !== "" || this.state.minYoe !== "" || this.state.minSeniority !== ""){
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

    if(this.state.skillsSearch.split(',')[0] !== ""){
      allFound = allFound && Object.keys(found).length === this.state.skillsSearch.split(',').length;
    }

    return singleFields && allFound && yoe && levels;
  }

  p_searchFilter = (project) => {
    let singleFields = this.contains(project.name)(this.state.p_nameSearch);

    return singleFields;
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

  pullProjectBlocks = () => {
    return this.state.projects !== undefined ?
    this.state.projects.map((project, index) => {
      if(!this.p_searchFilter(project)) return null;
      return <AssignProjectBlock
        key={index}
        accepts={[AssignDropTypes.EMPLOYEE]}
        onDrop={this.onEmployeeDrop(project, index)}
        project={project}
      />;
    }) : <LoaderCircular />;
  }

  render() {
    const { t } = this.props;
    return (
      <div className="row assign-container">
        { this.pullAssignmentDOM() }
        <div className="col-lg-2">
          <div className="content-container scroll-container">
            <div className="row scroll-container">
              <div className="col-lg-12">
                <div className="form-group assign-search-form">
                  <hr/>
                  <span>{t('Employees')}</span>
                  <label htmlFor="nameSearch">{t('LastName')}</label>
                  <input name="nameSearch" value={this.state.nameSearch} type="text" className="form-control" onChange={this.handleChange}/>
                  <label htmlFor="positionSearch">{t('Position')}</label>
                  <input name="positionSearch" value={this.state.positionSearch} type="text" className="form-control" onChange={this.handleChange}/>
                  <label htmlFor="skillsSearch">{t('Skills')}</label>
                  <input name="skillsSearch" value={this.state.skillsSearch} type="text" className="form-control" onChange={this.handleChange}/>
                  <label htmlFor="minSeniority">{t('MinLevelAbove')}</label>
                  <input name="minSeniority" value={this.state.minSeniority} type="text" className="form-control" onChange={this.handleChange}/>
                  <label htmlFor="minYoe">{t('MinExperience')}</label>
                  <input name="minYoe" value={this.state.minYoe} type="text" className="form-control" onChange={this.handleChange}/>
                  <hr/>
                  <span>{t('Projects')}</span>
                  <label htmlFor="p_nameSearch">{t('Name')}</label>
                  <input name="p_nameSearch" value={this.state.p_nameSearch} type="text" className="form-control" onChange={this.handleChange}/>
                  <hr/>
                  <button onClick={this.clearFilters} className="dcmt-button button-lowkey">Wyczyść filtry</button>
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
          <div className="content-container scroll-container">
            <div className="scroll-container">
              {
                this.pullProjectBlocks()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default translate("AssignsContainer")(AssignsContainer);
