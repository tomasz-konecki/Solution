import React, { Component } from "react";
import "./ProjectDetails.scss";
import Aux from "../../../services/auxilary";
import ProjectInformationsCart from "./ProjectInformationsCart/ProjectInformationsCart";
import {
  cutNotNeededKeysFromArray,
  populateFormArrayWithValues
} from "../../../services/methods";
import SmallSpinner from "../../common/spinner/small-spinner";
import Modal from "react-responsive-modal";
import Table from "../../common/table/table";
import ProjectDetailsBlock from "../modals/ProjectDetailsBlock";
import moment from "moment";
import Form from "../../form/form";
import ProgressPicker from "../../common/progressPicker/progressPicker";
import { validateInput } from "../../../services/validation";
import { errorCatcher } from "../../../services/errorsHandler";
import { getRandomColor } from "../../../services/methods";
import OperationStatusPrompt from "../../form/operationStatusPrompt/operationStatusPrompt";
import { translate } from "react-translate";
import { connect } from "react-redux";
import {
  getProjectDataACreator,
  getContactPersonDataACreator,
  getProjectACreator,
  addEmployeeToProjectACreator,
  addEmployeeToProject,
  editEmployeeAssignmentACreator,
  editEmployeeAssignment,
  deleteEmployeeAssignmentACreator,
  getProject,
  changeProjectSkillsACreator,
  editProjectACreator,
  addSkillsToProjectACreator,
  addSkillsToProject,
  editProject,
  changeProjectStateACreator,
  clearProjectState,
  getSuggestEmployeesACreator,
  addProjectOwnerACreator
} from "../../../actions/projectsActions";
import {
  getAllSkillsACreator,
  getAllSkills
} from "../../../actions/skillsActions";
import Skills from "../../common/skills/skills";
import { changeOperationStatus } from "../../../actions/asyncActions";
import ConfirmModal from "../../common/confimModal/confirmModal";
import ServerError from "../../common/serverError/serverError";
import WebApi from "../../../api/index";
import employeeTable from "../../employees/details/employeeTable/employeeTable";
import specialPermissioner from "./../../../api/specialPermissioner";
import binaryPermissioner from "./../../../api/binaryPermissioner";
import Owners from "./Owners/Owners";
import ShareProject from "./ShareProject";
import NotFound404 from "../../notFound404/NotFound404";
import Spinner from '../../common/spinner/spinner';

class ProjectDetails extends Component {
  workerNames = [
    this.props.t("Name"),
    this.props.t("Role"),
    this.props.t("Experience"),
    this.props.t("Position"),
    this.props.t("StartDate"),
    this.props.t("EndDate")
  ];
  state = {
    isLoadingProject: true,
    isChangingAssignments: false,
    items: [],
    currentOpenedRow: -1,
    matches: false,
    isDeleted: false,
    editModal: false,
    deleteProjectModal: false,
    addEmployeModal: false,
    shareProjectModal: false,
    addEmployeToProjectFormItems: [
      {
        title: this.props.t("AssignmentStartDate"),
        name: "startDate",
        type: "text",
        placeholder: this.props.t("InsertAssignmentStartDate"),
        mode: "date-picker",
        value: "",
        error: "",
        canBeBefore: true
      },
      {
        title: this.props.t("AssignmentEndDate"),
        name: "endDate",
        type: "text",
        placeholder: this.props.t("InsertAssignmentEndDate"),
        mode: "date-picker",
        value: "",
        error: "",
        canBeBefore: false
      },
      {
        title: this.props.t("Responsibilities"),
        type: "text",
        placeholder: this.props.t("AddResponsibility"),
        mode: "input-with-add-items",
        value: [],
        typedListVal: "",
        error: "",
        inputType: "client",
        minLength: 3,
        maxLength: 100,
        canBeNull: false
      },
      {
        title: this.props.t("Employee"),
        type: "text",
        placeholder: this.props.t("FindEmployee"),
        mode: "type-ahead",
        value: "",
        error: "",
        inputType: "client",
        minLength: 3,
        maxLength: 100,
        canBeNull: false
      },
      {
        title: this.props.t("RoleInProject"),
        canBeNull: false,
        minLength: 3,
        maxLength: 100,
        error: "",
        type: "text",
        placeholder: this.props.t("SelectRoleInProject"),
        mode: "type-and-select",
        value: "",
        inputType: "roleInProject",
        dataToMap: [
          { name: "Developer", id: 0 },
          { name: "Tradesman", id: 1 },
          { name: "Human Resources", id: 2 },
          { name: "Team Leader", id: 3 },
          { name: "Administrator", id: 4 },
          { name: "Manager", id: 5 }
        ]
      }
    ],
    lteVal: 1,
    lteWidth: 10,
    editingEmployeeAssignment: false,
    deletingEmployeeAssignment: false,
    deleteEmpAssignmentModalOpen: false,
    deletingAssignment: null,
    editingAssignmentId: null,
    addEmployeSpinner: false,
    projectStatus: [],
    onlyActiveAssignments: true,
  };
  componentDidMount() {
    this.loadProjectData("isLoadingProject");
    const { getSuggest } = this.props;
    getSuggest(this.props.match.params.id);
  }

  togleActiveAssignments = () => {
    const { onlyActiveAssignments } = this.state;
    this.setState({ onlyActiveAssignments: !onlyActiveAssignments }, () => this.loadProjectData("isChangingAssignments"));
  };

  loadProjectData = operationName => {
    this.setState({[operationName]: true});
    const { getProjectDataACreator, match } = this.props;
    const { onlyActiveAssignments } = this.state;
    getProjectDataACreator(match.params.id, onlyActiveAssignments).then(() => {
      this.setState({[operationName]: false});
    }).catch(() => this.setState({[operationName]: false}));
  }


  changeOnlyActiveAssignments = () => {
    const { onlyActiveAssignments } = this.state;
    this.setState({ onlyActiveAssignments: !onlyActiveAssignments }, () => this.loadProjectData());
  };

  fillDates = (startDate, endDate, estimatedEndDate) => {
    const addEmployeToProjectFormItems = [
      ...this.state.addEmployeToProjectFormItems
    ];

    if(moment(startDate).format("YYYY-MM-DD") === '0001-01-01')
    {
      addEmployeToProjectFormItems[0].value = moment();
      addEmployeToProjectFormItems[1].value = moment().add(1, 'days');
    }else{
      addEmployeToProjectFormItems[0].value = moment(startDate)._i;
      addEmployeToProjectFormItems[1].value = moment(
        endDate ? endDate : estimatedEndDate
      )._i;
    }

    return addEmployeToProjectFormItems;
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.project === null ||
      this.props.project !== nextProps.project
    ) {
      const { project } = nextProps;
      if (project !== null) {
        this.setState({
          deleteProjectModal: false,
          addEmployeToProjectFormItems: this.fillDates(
            project.startDate,
            project.endDate,
            project.estimatedEndDate
          ),
          projectStatus: this.calculateProjectStatus(
            project.status,
            project.isDeleted
          )
        });

        if (
          this.props.project &&
          (this.props.project.team !== project.team || project.team === null)
        ) {
          this.setState({
            isChangingAssignments: false
          });
        }
      }
    } else if (
      this.props.addEmployeeToProjectErrors !==
      nextProps.addEmployeeToProjectErrors
    ) {
      this.setState(
        { addEmployeSpinner: false },
        nextProps.addEmployeeToProjectStatus
          ? () => {
              this.closeAddEmployeeToProjectModal();
            }
          : null
      );
    }
  }

  createLTEPicker = range => {
    const spansArray = [];
    for (let i = 1; i <= range; i++) {
      spansArray.push(
        <span
          style={{
            backgroundColor: i <= this.state.lteVal ? "lightseagreen" : null
          }}
          key={i}
          onClick={() => this.setState({ lteVal: i })}
        >
          {i === this.state.lteVal ? (
            <i>{(this.state.lteVal / range) * 100}%</i>
          ) : null}
        </span>
      );
    }
    return spansArray;
  };

  addEmployeeToProject = () => {
    this.setState({ addEmployeSpinner: true });
    const {
      addEmployeToProjectFormItems,
      lteVal,
      onlyActiveAssignments,
      editingEmployeeAssignment
    } = this.state;
    const { project, addEmployeeToProject, editEmployeeAssignment } = this.props;

    if(editingEmployeeAssignment ?
      editEmployeeAssignment(
        addEmployeToProjectFormItems[0].value,
        addEmployeToProjectFormItems[1].value,
        addEmployeToProjectFormItems[4].value,
        lteVal,
        addEmployeToProjectFormItems[2].value,
        this.state.editingAssignmentId,
        onlyActiveAssignments,
        project.id
      ) :
      addEmployeeToProject(
        addEmployeToProjectFormItems[3].value,
        project.id,
        addEmployeToProjectFormItems[0].value,
        addEmployeToProjectFormItems[1].value,
        addEmployeToProjectFormItems[4].value,
        lteVal,
        addEmployeToProjectFormItems[2].value,
        onlyActiveAssignments
      )
    );
  };

  calculateProjectStatus = (projectStatus, isDeleted) => {
    if (isDeleted === true)
      return [{ classVal: "spn-unactive", name: this.props.t("Deleted") }];
    if (projectStatus === 2)
      return [{ classVal: "spn-closed", name: this.props.t("Closed") }];
    if (projectStatus === 1)
      return [{ classVal: "spn-closed", name: this.props.t("Inactive") }];
    if (projectStatus === 0)
      return [{ classVal: "spn-active", name: this.props.t("Active") }];
  };

  clearEditModalData = () => {
    this.props.editProjectClearData(null, []);
    this.setState({ editModal: false });
  };
  componentWillUnmount() {
    this.props.clearProjectData(null, null, [], [], []);
  }

  closeAddEmployeeToProjectModal = () => {
    const addEmployeToProjectFormItems = [
      ...this.state.addEmployeToProjectFormItems
    ];
    addEmployeToProjectFormItems[2].value = [];
    addEmployeToProjectFormItems[3].value = "";
    for (let key in addEmployeToProjectFormItems)
      addEmployeToProjectFormItems[key].error = "";

    addEmployeToProjectFormItems[2].typedListVal = "";

    this.setState({
      addEmployeToProjectFormItems: addEmployeToProjectFormItems,
      addEmployeModal: false
    });
  };
  closeShareProjectModal = () => {
    this.setState({
      shareProjectModal: false
    });
  };
  handleChange = () => {
    const { matches } = this.state;
    this.setState({ matches: !matches, currentOpenedRow: -1 });
  };
  createProgressBtns = (number, color, startVal, index, listName) => {
    const btnsArray = [];
    const items = [...this.state[listName]];
    for (let i = 0; i < number; i++) {
      btnsArray.push(
        <span
          style={{ backgroundColor: i + 1 <= startVal ? `${color}` : null }}
          key={i}
        >
          {i + 1 === startVal ? <i>{(startVal / 5) * 100}%</i> : null}
        </span>
      );
    }
    return btnsArray;
  };
  addEmployee = employeeId => {
    const addEmployeToProjectFormItems = [
      ...this.state.addEmployeToProjectFormItems
    ];

    addEmployeToProjectFormItems[3].value = employeeId;
    this.setState({
      addEmployeModal: !this.state.addEmployeModal,
      addEmployeToProjectFormItems: addEmployeToProjectFormItems
    });
  };

  editEmployee = (employeeData) => {
    const addEmployeToProjectFormItems = [
      ...this.state.addEmployeToProjectFormItems
    ];

    addEmployeToProjectFormItems[0].value = employeeData.startDate;
    addEmployeToProjectFormItems[1].value = employeeData.endDate;
    addEmployeToProjectFormItems[2].minLength = 0;
    addEmployeToProjectFormItems[2].value = employeeData.responsibilities;
    addEmployeToProjectFormItems[3].value = employeeData.employeeId;
    addEmployeToProjectFormItems[4].value = employeeData.role;
    const lte = employeeData.assignedCapacity * 10;

    this.setState({
      editingEmployeeAssignment: true,
      deletingEmployeeAssignment: false,
      lteVal: lte,
      editingAssignmentId: employeeData.assignmentId,
      currentOpenedRow: -1,
      addEmployeModal: !this.state.addEmployeModal,
      addEmployeToProjectFormItems: addEmployeToProjectFormItems
    });
  }

  clearForm = (project) => {
    const addEmployeToProjectFormItems = [
      ...this.state.addEmployeToProjectFormItems
    ];

    if(moment(project.startDate).format("YYYY-MM-DD") === '0001-01-01')
    {
      addEmployeToProjectFormItems[0].value = moment();
      addEmployeToProjectFormItems[1].value = moment().add(1, 'days');
    }else{
      addEmployeToProjectFormItems[0].value = moment(project.startDate)._i;
      addEmployeToProjectFormItems[1].value = moment(
        project.endDate ? project.endDate : project.estimatedEndDate
      )._i;
    }

    addEmployeToProjectFormItems[2].value = [];
    addEmployeToProjectFormItems[3].value = '';
    addEmployeToProjectFormItems[4].value = '';
    const lte = 1;

    this.setState({
      lteVal: lte,
      currentOpenedRow: -1,
      editingEmployeeAssignment: false,
      deletingEmployeeAssignment: false,
      editingAssignmentId: null,
      addEmployeModal: !this.state.addEmployeModal,
      addEmployeToProjectFormItems: addEmployeToProjectFormItems
    });
  }

  deleteEmployeeAssignment = () => {
    const { deleteEmployeeAssignmentACreator, project } = this.props;
    const { onlyActiveAssignments, deletingAssignment } = this.state;

    this.setState({
      deletingEmployeeAssignment: true,
      editingEmployeeAssignment: false,
      deleteEmpAssignmentModalOpen: false
    })

    deleteEmployeeAssignmentACreator( deletingAssignment.assignmentId, project.id, onlyActiveAssignments)
  }

  setDeletingAssignmentId = (assignment) => {
    this.setState({
      deleteEmpAssignmentModalOpen: true,
      deletingAssignment: assignment
    })
  }

  render() {
    const { project, loading, loadProjectStatus, addEmployeeToProjectStatus,
      addEmployeeToProjectErrors, changeProjectState, changeProjectStateStatus,
      changeProjectStateErrors, getSuggestEmployeesStatus, suggestEmployees,
      addProjectOwnerToProjectStatus, addProjectOwnerToProjectErrors, t } = this.props;

    const { reactivate, close } = WebApi.projects.put;
    const { projectStatus, onlyActiveAssignments, matches, currentOpenedRow,
      isChangingAssignments, isLoadingProject } = this.state;
    return (
      <div
        onClick={
          addEmployeeToProjectStatus !== null
            ? () => this.props.addEmployeeToProjectAction(null, [])
            : null
        }
        className="project-details-container"
      >
        {isLoadingProject && <Spinner message={t("LoadingProjectMessage")} fontSize="7px" />}

        {loadProjectStatus && (
          <Aux>
            <header>
              <h1>
                {projectStatus && (
                  <span className={projectStatus[0].classVal}>
                    {projectStatus[0].name} {loading && <Spinner fontSize="1.77px" position="absolute" positionClass="abs-spinner"/>}
                  </span>
                )}

                <i className="fa fa-briefcase fa-2x" />
                <b title={project.name}>
                  {project.name.length > 60
                    ? project.name.slice(0, 40) + "..."
                    : project.name}
                </b>
              </h1>
              <nav>
                {(binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(
                  this.props.binPem
                ) ||
                  specialPermissioner().projects.isOwner(
                    this.props.project,
                    this.props.login
                  )) && (
                  <React.Fragment>
                    <button
                      onClick={() =>
                        this.setState({ editModal: !this.state.editModal })
                      }
                      className="option-btn normal-btn"
                    >
                      {t("EditProject")}
                    </button>

                    <button
                      onClick={() =>
                        this.setState({
                          shareProjectModal: !this.state.shareProjectModal
                        })
                      }
                      className="option-btn normal-btn"
                    >
                      {t('Share')}
                    </button>

                    {projectStatus &&
                      projectStatus[0].name !== t("Active") && (
                        <button
                          onClick={() =>
                            changeProjectState(reactivate, "reactivate", {
                              projectId: project.id,
                              onlyActiveAssignments: onlyActiveAssignments
                            })
                          }
                          className="option-btn green-btn"
                        >
                          {t("ActivateProject")}
                        </button>
                      )}

                    {projectStatus &&
                      projectStatus[0].name === t("Active") && (
                        <button
                          onClick={() =>
                            changeProjectState(close, "close", {
                              projectId: project.id,
                              onlyActiveAssignments: onlyActiveAssignments
                            })
                          }
                          className="option-btn option-dang"
                        >
                          {t("Close")}
                        </button>
                      )}

                    {projectStatus &&
                      projectStatus[0].name !== t("Deleted") &&
                      projectStatus[0].name !== t("Closed") && (
                        <button
                          onClick={() =>
                            this.setState({
                              deleteProjectModal: !this.state.deleteProjectModal
                            })
                          }
                          className="option-btn option-very-dang"
                        >
                          {t("DeleteProject")}
                        </button>
                      )}
                  </React.Fragment>
                )}
              </nav>
            </header>
            <main>
              <div className="project-details">
                <ProjectInformationsCart
                  key={1}
                  items={this.props.overViewKeys}
                  headerTitle={t("GeneralInfo")}
                  originalObject={project}
                  dateKeys={["startDate", "estimatedEndDate", "endDate"]}
                  t={t}
                />

                <ProjectInformationsCart
                  key={2}
                  items={this.props.responsiblePersonKeys}
                  headerTitle={t("ResponsiblePerson")}
                  originalObject={project.responsiblePerson}
                  t={t}
                />
                <article>
                  <h4>{t("Description")}</h4>
                  {project.description}
                </article>

                <Owners
                  addProjectOwnerToProjectErrors={
                    addProjectOwnerToProjectErrors
                  }
                  addProjectOwnerToProjectStatus={
                    addProjectOwnerToProjectStatus
                  }
                  addProjectOwner={this.props.addProjectOwner}
                  projectId={project.id}
                  owners={project.owners}
                  changeProjectState={changeProjectState}
                  WebApi={WebApi}
                  loggedUser={this.props.login}
                  projectId={project.id}
                  isProjectOwner={
                    binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(
                      this.props.binPem
                    ) ||
                    specialPermissioner().projects.isOwner(
                      this.props.project,
                      this.props.login
                    )
                  }
                />

                <Skills
                  onlyActiveAssignments={onlyActiveAssignments}
                  projectId={project.id}
                  changeProjectSkillsStatus={
                    this.props.changeProjectSkillsStatus
                  }
                  changeProjectSkillsErrors={
                    this.props.changeProjectSkillsErrors
                  }
                  changeProjectSkills={this.props.changeProjectSkills}
                  title={t("SkillsRequired")}
                  items={project.skills}
                  getAllSkills={this.props.getAllSkills}
                  loadedSkills={this.props.loadedSkills}
                  loadSkillsStatus={this.props.loadSkillsStatus}
                  loadSkillsErrors={this.props.loadSkillsErrors}
                  addSkillsToProject={this.props.addSkillsToProject}
                  addSkillsToProjectStatus={this.props.addSkillsToProjectStatus}
                  addSkillsToProjectErrors={this.props.addSkillsToProjectErrors}
                  addSkillsToProjectClear={this.props.addSkillsToProjectClear}
                  isProjectOwner={
                    binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(
                      this.props.binPem
                    ) ||
                    specialPermissioner().projects.isOwner(
                      this.props.project,
                      this.props.login
                    )
                  }
                />
              </div>

              <div className="right-project-spec">
                <div className="a-asign-container">
                  <label>{t("ShowActiveAssignments")}</label>
                  <input disabled={isChangingAssignments}
                    type="checkbox"
                    checked={onlyActiveAssignments}
                    onChange={this.togleActiveAssignments}
                  />
                  <span className="assingments-spinner-container">
                    {isChangingAssignments &&
                      <Spinner fontSize="1.77px" positionClass="abs-spinner"/>}
                  </span>
                </div>

                <Table
                  key={0}
                  projectId={project.id}
                  items={project.team}
                  title={t("ProjectTeam")}
                  thds={this.workerNames}
                  emptyMsg={t("EmptyProjectTeam")}
                  editEmployee={this.editEmployee}
                  deleteEmployeeAssignment={this.deleteEmployeeAssignment}
                  setDeletingAssignmentId={this.setDeletingAssignmentId}
                  togleAddEmployeeModal={() => this.clearForm(project)}
                  login={this.props.login}
                  isProjectOwner={
                    binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(
                      this.props.binPem
                    ) ||
                    specialPermissioner().projects.isOwner(
                      this.props.project,
                      this.props.login
                    )
                  }
                />

                <div className="table-container table">
                  {suggestEmployees && (
                    <label
                      className="switch"
                      title={!matches ? "showDeleted" : "showActive"}
                    >
                      <input
                        type="checkbox"
                        onChange={this.handleChange}
                        checked={!matches}
                      />
                      <div className="slider" />
                    </label>
                  )}

                  {suggestEmployees &&
                    matches &&
                    getSuggestEmployeesStatus && (
                      <div>
                        <h3>Employee with free capacity</h3>
                        <table key={2}>
                          <thead>
                            <tr>
                              <th>Employee</th>
                              <th>Left Capacity</th>
                              <th>Capacity</th>
                              <th>Seniority</th>
                            </tr>
                          </thead>
                          <tbody>
                            {suggestEmployees.allEmployees.map(
                              (employee, index) => {
                                return (
                                  <React.Fragment>
                                    <tr
                                      onClick={() =>
                                        this.setState({
                                          currentOpenedRow: index
                                        })
                                      }
                                      key={employee.fullName}
                                    >
                                      <td>{employee.fullName}</td>
                                      <td>{employee.leftCapacity}</td>
                                      <td>{employee.capacity}</td>
                                      <td>{employee.seniority}</td>
                                      <td>
                                        <i
                                          className="fa fa-plus"
                                          onClick={() =>
                                            this.addEmployee(employee.id)
                                          }
                                        />
                                      </td>
                                    </tr>
                                    {currentOpenedRow === index && (
                                      <tr className="abs-td">
                                        {employee.employeeSkills.length > 0 ? (
                                          <td colSpan="5">
                                            {employee.employeeSkills.map(
                                              skill => {
                                                return (
                                                  <React.Fragment>
                                                    <div
                                                      key={skill.skills.skillId}
                                                      className="progress-bar-container"
                                                    >
                                                      <b>
                                                        {skill.skills.skillName}
                                                      </b>
                                                      <ProgressPicker
                                                        createResult={this.createProgressBtns(
                                                          5,
                                                          getRandomColor(),
                                                          skill.skillLevel,
                                                          index,
                                                          "items"
                                                        )}
                                                      />
                                                    </div>
                                                  </React.Fragment>
                                                );
                                              }
                                            )}
                                          </td>
                                        ) : (
                                          <td colSpan="5" className="noSkills">
                                            "No skills to show"
                                          </td>
                                        )}
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  {suggestEmployees &&
                    !matches &&
                    getSuggestEmployeesStatus && (
                      <div>
                        <h3>
                          Employees with free capacity and skills matched to
                          this project
                        </h3>
                        <table key={1}>
                          <thead>
                            <tr>
                              <th>Employee</th>
                              <th>Left Capacity</th>
                              <th>Capacity</th>
                              <th>Seniority</th>
                            </tr>
                          </thead>
                          <tbody>
                            {suggestEmployees.matchedEmployees.map(
                              (employee, index) => {
                                return (
                                  <React.Fragment>
                                    <tr
                                      onClick={() =>
                                        currentOpenedRow === index
                                          ? this.setState({
                                              currentOpenedRow: -1
                                            })
                                          : this.setState({
                                              currentOpenedRow: index
                                            })
                                      }
                                      key={employee.id}
                                    >
                                      <td>{employee.fullName}</td>
                                      <td>{employee.leftCapacity}</td>
                                      <td>{employee.capacity}</td>
                                      <td>{employee.seniority}</td>
                                      <td>
                                        <i
                                          className="fa fa-plus"
                                          onClick={() =>
                                            this.addEmployee(employee.id)
                                          }
                                        />
                                      </td>
                                    </tr>
                                    {currentOpenedRow === index && (
                                      <tr className="abs-td">
                                        {employee.employeeSkills.length > 0 ? (
                                          <td colSpan="5">
                                            {employee.employeeSkills.map(
                                              (skill, index) => {
                                                return (
                                                  <React.Fragment>
                                                    <div
                                                      key={skill.skills.skillId}
                                                      className="progress-bar-container"
                                                    >
                                                      {skill.matched ? (
                                                        <h3>
                                                          {
                                                            skill.skills
                                                              .skillName
                                                          }
                                                        </h3>
                                                      ) : (
                                                        <h4>
                                                          {
                                                            skill.skills
                                                              .skillName
                                                          }
                                                        </h4>
                                                      )}
                                                      <ProgressPicker
                                                        createResult={this.createProgressBtns(
                                                          5,
                                                          getRandomColor(),
                                                          skill.skillLevel,
                                                          index,
                                                          "items"
                                                        )}
                                                      />
                                                    </div>
                                                  </React.Fragment>
                                                );
                                              }
                                            )}
                                          </td>
                                        ) : (
                                          <td colSpan="5" className="noSkills">
                                            "No skills to show"
                                          </td>
                                        )}
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                </div>
              </div>
            </main>

            <Modal
              key={1}
              open={this.state.editModal}
              classNames={{ modal: "Modal Modal-add-project" }}
              contentLabel="Edit project modal"
              onClose={this.clearEditModalData}
            >
              <ProjectDetailsBlock
                onlyActiveAssignments={onlyActiveAssignments}
                editProjectStatus={this.props.editProjectStatus}
                editProjectErrors={this.props.editProjectErrors}
                responsiblePerson={project.responsiblePerson}
                project={project}
                getContactPersonDataACreator={
                  this.props.getContactPersonDataACreator
                }
                editProject={this.props.editProject}
                closeEditProjectModal={this.clearEditModalData}
              />
            </Modal>

            <ConfirmModal
              open={this.state.deleteProjectModal}
              content="Delete project modal"
              onClose={() =>
                this.setState({
                  deleteProjectModal: !this.state.deleteProjectModal
                })
              }
              header={t("ConfirmDeleteProject")}
              operationName={t("Delete")}
              denyName={t("Cancel")}
              operation={() =>
                changeProjectState(WebApi.projects.delete.project, "delete", {
                  projectId: project.id,
                  onlyActiveAssignments: onlyActiveAssignments
                })
              }
            >
             {loading && <Spinner fontSize="3px" positionClass="abs-spinner"/>}
            </ConfirmModal>

            <Modal
              key={3}
              open={this.state.addEmployeModal}
              classNames={{ modal: "Modal Modal-add-owner" }}
              contentLabel="Add employee to project modal"
              onClose={this.closeAddEmployeeToProjectModal}
            >
              <header>
                <h3 className="section-heading">
                  {this.state.editingEmployeeAssignment ?
                     t("EditEmployee")
                     : t("AddEmployee")}
                </h3>
              </header>
              <Form
                btnTitle={this.state.editingEmployeeAssignment ? t("Save") : t("Add")}
                key={4}
                endDate={this.props.estimatedEndDate}
                shouldSubmit={false}
                dateIndexesToCompare={[0, 1]}
                onSubmit={this.addEmployeeToProject}
                isLoading={this.state.addEmployeSpinner}
                formItems={this.state.addEmployeToProjectFormItems}
                shouldCancelInputList={true}
              >
                <div className="lte-pic-container">
                  <label>{t("FTE")}</label>
                  <ProgressPicker
                    settings={{ width: "10%" }}
                    createResult={this.createLTEPicker(10)}
                  />
                </div>
              </Form>
            </Modal>

            <Modal
              key={5}
              open={this.state.shareProjectModal}
              classNames={{ modal: "Modal Modal-add-owner" }}
              contentLabel="Add employee to project modal"
              onClose={this.closeShareProjectModal}
            >
              <ShareProject projectId={this.props.match.params.id} />
            </Modal>

            <ConfirmModal
              key={6}
              open={this.state.deleteEmpAssignmentModalOpen}
              content="Delete employee assignment modal"
              onClose={() =>
                this.setState({
                  deleteEmpAssignmentModalOpen: !this.state.deleteEmpAssignmentModalOpen
                })
              }
              header={this.state.deletingAssignment && t("DeleteEmpAssignment") + this.state.deletingAssignment.firstName + " " + this.state.deletingAssignment.lastName + t("FromProject")}
              operationName={t("Delete")}
              denyName={t("Cancel")}
              operation={() =>
                this.deleteEmployeeAssignment()
              }
            />

            {addEmployeeToProjectStatus !== null &&
              addEmployeeToProjectStatus !== undefined && (
                <OperationStatusPrompt
                  operationPromptContent={
                    addEmployeeToProjectStatus
                      ? this.state.editingEmployeeAssignment ? t("AssignmentSaved") : this.state.deletingEmployeeAssignment ? t("AssignmentDeleted") : t("EmployeeAdded")
                      : addEmployeeToProjectErrors &&
                        addEmployeeToProjectErrors[0]
                  }
                  operationPrompt={addEmployeeToProjectStatus}
                />
              )}
          </Aux>
        )}

        {loadProjectStatus === false && (
          <NotFound404 />
          // <ServerError message={this.props.loadProjectErrors[0]} />
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    getSuggestEmployeesStatus: state.projectsReducer.getSuggestEmployeesStatus,
    suggestEmployees: state.projectsReducer.suggestEmployees,
    project: state.projectsReducer.project,
    loadProjectStatus: state.projectsReducer.loadProjectStatus,
    loadProjectErrors: state.projectsReducer.loadProjectErrors,
    responsiblePersonKeys: state.projectsReducer.responsiblePersonKeys,
    overViewKeys: state.projectsReducer.overViewKeys,

    loading: state.asyncReducer.loading,

    changeProjectStateStatus: state.projectsReducer.changeProjectStateStatus,
    changeProjectStateErrors: state.projectsReducer.changeProjectStateErrors,
    currentOperation: state.projectsReducer.currentOperation,

    addEmployeeToProjectStatus:
      state.projectsReducer.addEmployeeToProjectStatus,
    addEmployeeToProjectErrors:
      state.projectsReducer.addEmployeeToProjectErrors,

    addProjectOwnerToProjectStatus:
      state.projectsReducer.addProjectOwnerToProjectStatus,
    addProjectOwnerToProjectErrors:
      state.projectsReducer.addProjectOwnerToProjectErrors,

    changeProjectSkillsStatus: state.projectsReducer.changeProjectSkillsStatus,
    changeProjectSkillsErrors: state.projectsReducer.changeProjectSkillsErrors,

    editProjectStatus: state.projectsReducer.editProjectStatus,
    editProjectErrors: state.projectsReducer.editProjectErrors,

    loadedSkills: state.skillsReducer.loadedSkills,
    loadSkillsStatus: state.skillsReducer.loadSkillsStatus,
    loadSkillsErrors: state.skillsReducer.loadSkillsErrors,

    addSkillsToProjectStatus: state.projectsReducer.addSkillsToProjectStatus,
    addSkillsToProjectErrors: state.projectsReducer.addSkillsToProjectErrors,

    login: state.authReducer.login,
    binPem: state.authReducer.binPem
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getContactPersonDataACreator: clientId =>
      dispatch(getContactPersonDataACreator(clientId)),
    getProject: (projectId, onlyActiveAssignments) =>
      dispatch(getProjectACreator(projectId, onlyActiveAssignments)),
    editProject: (projectId, projectToSend, onlyActiveAssignments) =>
      dispatch(
        editProjectACreator(projectId, projectToSend, onlyActiveAssignments)
      ),
    getProjectDataACreator: (projectId, onlyActiveAssignments) => dispatch(getProjectDataACreator(projectId, onlyActiveAssignments)),
    editProjectClearData: (status, errors) =>
      dispatch(editProject(status, errors)),
    clearProjectData: (project, status, errors, personKeys, overViewKeys) =>
      dispatch(getProject(project, status, errors, personKeys, overViewKeys)),
    addEmployeeToProject: (
      empId,
      projId,
      strDate,
      endDate,
      role,
      assignedCapacity,
      responsibilites,
      onlyActiveAssignments
    ) =>
      dispatch(
        addEmployeeToProjectACreator(
          empId,
          projId,
          strDate,
          endDate,
          role,
          assignedCapacity,
          responsibilites,
          onlyActiveAssignments
        )
      ),
    addEmployeeToProjectAction: (status, errors) => dispatch(addEmployeeToProject(status, errors)),

    editEmployeeAssignment: ( startDate, endDate, role, assignedCapacity, responsibilites, assignmentId, onlyActiveAssignments, projectId) =>
      dispatch(editEmployeeAssignmentACreator(startDate,endDate,role,assignedCapacity,responsibilites,assignmentId,onlyActiveAssignments, projectId)),

    editEmployeeAssignmentAction: (status, errors) => dispatch(editEmployeeAssignment(status, errors)),

    deleteEmployeeAssignmentACreator: ( assignmentId, projectId, onlyActiveAssignments) => dispatch(deleteEmployeeAssignmentACreator(assignmentId, projectId, onlyActiveAssignments)),

    changeProjectSkills: (projectId, skills, onlyActiveAssignments) =>
      dispatch(changeProjectSkillsACreator(projectId, skills, onlyActiveAssignments)),

    addProjectOwner: (projectId, ownersIdsArray) =>
      dispatch(addProjectOwnerACreator(projectId, ownersIdsArray)),

    getAllSkills: currentAddedSkills =>
      dispatch(getAllSkillsACreator(currentAddedSkills)),
    getAllSkillsDataClear: (loadedSkills, loadSkillsStatus, loadSkillsErrors) =>
      dispatch(getAllSkills(loadedSkills, loadSkillsStatus, loadSkillsErrors)),
    addSkillsToProject: (projectId, currentSkills, onlyActiveAssignments) =>
      dispatch(
        addSkillsToProjectACreator(
          projectId,
          currentSkills,
          onlyActiveAssignments
        )
      ),
    addSkillsToProjectClear: (state, errors) =>
      dispatch(addSkillsToProject(state, errors)),

    changeProjectState: (funcName, currentOperation, model) =>
      dispatch(changeProjectStateACreator(funcName, currentOperation, model)),

    clearProjectState: () => dispatch(clearProjectState()),

    getSuggest: projectId => dispatch(getSuggestEmployeesACreator(projectId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("ProjectDetails")(ProjectDetails));
