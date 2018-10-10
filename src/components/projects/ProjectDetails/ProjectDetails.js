import React, { Component } from "react";
import "./ProjectDetails.scss";
import Aux from "../../../services/auxilary";
import ProjectInformationsCart from "./ProjectInformationsCart/ProjectInformationsCart";
import {
  cutNotNeededKeysFromArray,
  populateFormArrayWithValues
} from "../../../services/methods";
import Spinner from "../../common/spinner/spinner";
import Modal from "react-responsive-modal";
import Table from "../../common/table/table";
import ProjectDetailsBlock from "../modals/ProjectDetailsBlock";
import OperationLoader from "../../common/operationLoader/operationLoader";
import moment from "moment";
import Form from "../../form/form";
import ProgressPicker from "../../common/progressPicker/progressPicker";
import { validateInput } from "../../../services/validation";
import { errorCatcher } from "../../../services/errorsHandler";
import { getRandomColor } from "../../../services/methods";
import OperationStatusPrompt from "../../form/operationStatusPrompt/operationStatusPrompt";
import { connect } from "react-redux";
import {
  getContactPersonDataACreator,
  getProjectACreator,
  addEmployeeToProjectACreator,
  addEmployeeToProject,
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
import { translate } from "react-translate";
import specialPermissioner from "./../../../api/specialPermissioner";
import binaryPermissioner from "./../../../api/binaryPermissioner";
import Owners from "./Owners/Owners";
const workerNames = [
  "Nazwa",
  "Rola",
  "Doświadczenie",
  "Stanowisko",
  "Data rozpoczęcia",
  "Data zakończenia"
];

class ProjectDetails extends Component {
  state = {
    items: [],
    currentOpenedRow: -1,
    matches: false,
    isDeleted: false,
    isLoadingProject: true,
    editModal: false,
    deleteProjectModal: false,
    addEmployeModal: false,
    addEmployeToProjectFormItems: [
      {
        title: "Data rozpoczęcia pracy",
        name: "startDate",
        type: "text",
        placeholder: "wprowadź datę rozpoczęcia pracy...",
        mode: "date-picker",
        value: "",
        error: "",
        canBeBefore: true
      },
      {
        title: "Data zakończenia pracy",
        name: "endDate",
        type: "text",
        placeholder: "wprowadź datę zakończenia pracy...",
        mode: "date-picker",
        value: "",
        error: "",
        canBeBefore: false
      },
      {
        title: "Zakres obowiązków",
        type: "text",
        placeholder: "dodaj obowiązek..",
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
        title: "Pracownik",
        type: "text",
        placeholder: "znajdź pracownika...",
        mode: "type-ahead",
        value: "",
        error: "",
        inputType: "client",
        minLength: 3,
        maxLength: 100,
        canBeNull: false
      },
      {
        title: "Rola w projekcie",
        canBeNull: false,
        minLength: 3,
        maxLength: 100,
        error: "",
        type: "text",
        placeholder: "wybierz lub wpisz role w projekcie...",
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
    addEmployeSpinner: false,
    projectStatus: [],
    onlyActiveAssignments: true
  };
  componentDidMount() {
    this.props.getProject(
      this.props.match.params.id,
      this.state.onlyActiveAssignments
    );
    const { getSuggest } = this.props;
    getSuggest(this.props.match.params.id);
  }

  changeOnlyActiveAssignments = () => {
    const { onlyActiveAssignments } = this.state;
    const { id } = this.props.match.params;
    this.setState({ onlyActiveAssignments: !onlyActiveAssignments });
    this.props.getProject(id, !onlyActiveAssignments);
  };
  fillDates = (startDate, endDate, estimatedEndDate) => {
    const addEmployeToProjectFormItems = [
      ...this.state.addEmployeToProjectFormItems
    ];
    addEmployeToProjectFormItems[0].value = moment(startDate);
    addEmployeToProjectFormItems[1].value = moment(
      endDate ? endDate : estimatedEndDate
    );
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
          isLoadingProject: false,
          deleteProjectModal: false,
          addEmployeToProjectFormItems: this.fillDates(
            project.startDate,
            project.endDate,
            project.estimatedEndDate
          ),
          projectStatus: this.calculateProjectStatus(
            project.startDate,
            project.endDate,
            project.status,
            project.estimatedEndDate,
            project.isDeleted
          )
        });
      } else this.setState({ isLoadingProject: false });
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
      onlyActiveAssignments
    } = this.state;
    const { project, addEmployeeToProject } = this.props;
    addEmployeeToProject(
      addEmployeToProjectFormItems[3].value,
      project.id,
      addEmployeToProjectFormItems[0].value,
      addEmployeToProjectFormItems[1].value,
      addEmployeToProjectFormItems[4].value,
      lteVal,
      addEmployeToProjectFormItems[2].value,
      onlyActiveAssignments
    );
  };

  calculateProjectStatus = (
    startDate,
    endDate,
    projectStatus,
    estimatedEndDate,
    isDeleted
  ) => {
    if (isDeleted === true)
      return [{ classVal: "spn-unactive", name: "Usunięty" }];
    if (projectStatus === 2)
      return [{ classVal: "spn-closed", name: "Zamknięty" }];
    if (projectStatus === 1)
      return [{ classVal: "spn-closed", name: "Nieaktywny" }];
    if (projectStatus === 0)
      return [{ classVal: "spn-active", name: "Aktywny" }];
  };

  clearEditModalData = () => {
    this.props.editProjectClearData(null, []);
    this.setState({ editModal: false });
  };
  componentWillUnmount() {
    this.props.clearProjectData(null, null, [], [], []);
  }
  togleActiveAssign = () => {
    const { onlyActiveAssignments } = this.state;
    this.setState({
      onlyActiveAssignments: !onlyActiveAssignments,
      isLoadingProject: true
    });
    this.props.getProject(this.props.match.params.id, !onlyActiveAssignments);
  };

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
  handleChange = () => {
    const { matches } = this.state;
    this.setState({
      matches: !matches,
      currentOpenedRow: -1
    });
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
  render() {
    const {
      project,
      loading,
      loadProjectStatus,
      addEmployeeToProjectStatus,
      addEmployeeToProjectErrors,
      loadProjectErrors,
      changeProjectState,
      changeProjectStateStatus,
      changeProjectStateErrors,
      getSuggestEmployeesStatus,
      suggestEmployees,
      addProjectOwnerToProjectStatus,
      addProjectOwnerToProjectErrors
    } = this.props;

    const { reactivate, close } = WebApi.projects.put;
    const {
      projectStatus,
      onlyActiveAssignments,
      isChangingAssignment,
      matches,
      currentOpenedRow,
      isLoadingProject
    } = this.state;

    return (
      <div
        onClick={
          addEmployeeToProjectStatus !== null
            ? () => this.props.addEmployeeToProjectAction(null, [])
            : null
        }
        className="project-details-container"
      >
        {loadProjectStatus === null && <OperationLoader isLoading={true} />}

        {loadProjectStatus && (
          <Aux>
            <header>
              <h1>
                {projectStatus && (
                  <span className={projectStatus[0].classVal}>
                    {projectStatus[0].name}
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
                      Edytuj projekt
                    </button>

                    {projectStatus[0].name !== "Aktywny" && (
                      <button
                        onClick={() =>
                          changeProjectState(reactivate, "reactivate", {
                            projectId: project.id,
                            onlyActiveAssignments: onlyActiveAssignments
                          })
                        }
                        className="option-btn green-btn"
                      >
                        Aktywuj projekt
                      </button>
                    )}

                    {projectStatus[0].name === "Aktywny" && (
                      <button
                        onClick={() =>
                          changeProjectState(close, "close", {
                            projectId: project.id,
                            onlyActiveAssignments: onlyActiveAssignments
                          })
                        }
                        className="option-btn option-dang"
                      >
                        Zamknij
                      </button>
                    )}

                    {projectStatus[0].name !== "Usunięty" &&
                      projectStatus[0].name !== "Zamknięty" && (
                        <button
                          onClick={() =>
                            this.setState({
                              deleteProjectModal: !this.state.deleteProjectModal
                            })
                          }
                          className="option-btn option-very-dang"
                        >
                          Usuń projekt
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
                  headerTitle="Informacje ogólne"
                  originalObject={project}
                  dateKeys={["startDate", "estimatedEndDate", "endDate"]}
                />

                <ProjectInformationsCart
                  key={2}
                  items={this.props.responsiblePersonKeys}
                  headerTitle="Osoba odpowiedzialna"
                  originalObject={project.responsiblePerson}
                />
                <article>
                  <h4>Opis</h4>
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
                  title="Umiejętności na potrzeby projektu"
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
                  <label>Pokaż aktywne przypisania</label>
                  <input
                    type="checkbox"
                    checked={onlyActiveAssignments}
                    onChange={this.togleActiveAssign}
                  />
                </div>

                <Table
                  key={0}
                  projectId={project.id}
                  items={project.team}
                  title="Zespół projektowy"
                  thds={workerNames}
                  emptyMsg="Ten projekt nie ma jeszcze pracowników"
                  togleAddEmployeeModal={() =>
                    this.setState({
                      addEmployeModal: !this.state.addEmployeModal
                    })
                  }
                  isProjectOwner={specialPermissioner().projects.isOwner(
                    this.props.project,
                    this.props.login
                  )}
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
              header="Czy jesteś pewny, że chcesz usunąć ten projekt?"
              operationName="Usuń"
              operation={() =>
                changeProjectState(WebApi.projects.delete.project, "delete", {
                  projectId: project.id,
                  onlyActiveAssignments: onlyActiveAssignments
                })
              }
            />

            <Modal
              key={3}
              open={this.state.addEmployeModal}
              classNames={{ modal: "Modal Modal-add-owner" }}
              contentLabel="Add employee to project modal"
              onClose={this.closeAddEmployeeToProjectModal}
            >
              <header>
                <h3 className="section-heading">
                  Dodaj pracownika do projektu{" "}
                </h3>
              </header>
              <Form
                btnTitle="Dodaj"
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
                  <label>Długość etatu</label>
                  <ProgressPicker
                    settings={{ width: "10%" }}
                    createResult={this.createLTEPicker(10)}
                  />
                </div>
              </Form>
            </Modal>

            {addEmployeeToProjectStatus !== null &&
              addEmployeeToProjectStatus !== undefined && (
                <OperationStatusPrompt
                  operationPromptContent={
                    addEmployeeToProjectStatus
                      ? "Pomyślnie dodano pracownika do projektu"
                      : addEmployeeToProjectErrors &&
                        addEmployeeToProjectErrors[0]
                  }
                  operationPrompt={addEmployeeToProjectStatus}
                />
              )}
          </Aux>
        )}

        {loadProjectStatus === false && (
          <ServerError message={this.props.loadProjectErrors[0]} />
        )}

        {changeProjectStateStatus === false && (
          <OperationLoader
            operationError={
              changeProjectStateErrors.length > 0
                ? changeProjectStateErrors[0]
                : ""
            }
            close={this.props.clearProjectState}
          />
        )}
        {loading && <OperationLoader isLoading={loading} />}
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

    changeProjectStateStatus: state.projectsReducer.changeProjectStateStatus,
    changeProjectStateErrors: state.projectsReducer.changeProjectStateErrors,
    currentOperation: state.projectsReducer.currentOperation,
    loading: state.asyncReducer.loading,

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
    addEmployeeToProjectAction: (status, errors) =>
      dispatch(addEmployeeToProject(status, errors)),
    changeProjectSkills: (projectId, skills, onlyActiveAssignments) =>
      dispatch(
        changeProjectSkillsACreator(projectId, skills, onlyActiveAssignments)
      ),

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
)(ProjectDetails);
