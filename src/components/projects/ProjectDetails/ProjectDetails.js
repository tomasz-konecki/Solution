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
import AddEmployeeToProject from "../../employees/modals/AddEmployeeToProject";
import AssignmentModal from "../../assign/AssignmentModal";
import OperationLoader from "../../common/operationLoader/operationLoader";
import moment from "moment";
import Form from "../../form/form";
import ProgressPicker from "../../common/progressPicker/progressPicker";
import { validateInput } from "../../../services/validation";
import { errorCatcher } from "../../../services/errorsHandler";
import OperationStatusPrompt from "../../form/operationStatusPrompt/operationStatusPrompt";
import { connect } from "react-redux";
import {
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
  clearProjectState
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
        canBeNull: true,
        type: "text",
        placeholder: "wprowadź role w projekcie...",
        mode: "select",
        value: "Developer",
        selectValues: [
          "Developer",
          "Tradesman",
          "Human Resources",
          "Team Leader",
          "Administrator",
          "Manager"
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
    ){
      this.setState({ addEmployeSpinner: false }, 
        nextProps.addEmployeeToProjectStatus ? 
        () => {
          this.closeAddEmployeeToProjectModal();
        } : null);
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
    this.props.addEmployeeToProject(
      this.state.addEmployeToProjectFormItems[3].value,
      this.props.project.id,
      this.state.addEmployeToProjectFormItems[0].value,
      this.state.addEmployeToProjectFormItems[1].value,
      this.state.addEmployeToProjectFormItems[4].value,
      this.state.lteVal,
      this.state.addEmployeToProjectFormItems[2].value,
      this.state.onlyActiveAssignments
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
    const addEmployeToProjectFormItems = [...this.state.addEmployeToProjectFormItems];
    addEmployeToProjectFormItems[2].value = [];
    addEmployeToProjectFormItems[3].value = "";
    for(let key in addEmployeToProjectFormItems)
      addEmployeToProjectFormItems[key].error = "";

    addEmployeToProjectFormItems[2].typedListVal = "";   

    this.setState({addEmployeToProjectFormItems: addEmployeToProjectFormItems, addEmployeModal: false});
  }
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
      changeProjectStateErrors
    } = this.props;

    const { reactivate, close } = WebApi.projects.put;
    const {
      projectStatus,
      onlyActiveAssignments,
      isChangingAssignment
    } = this.state;
    const { owner } = WebApi.projects.delete;
   


    return (
      <div
        onClick={
          addEmployeeToProjectStatus !== null
            ? () => this.props.addEmployeeToProjectAction(null, [])
            : null
        }
        className="project-details-container"
      >
        {this.state.isLoadingProject && <OperationLoader isLoading={true} />}
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
                <b title={project.name}>{project.name.length > 60 ? project.name.slice(0, 40) + "..." : project.name}</b>
              </h1>
              <nav>
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
                <h4>Właściciele</h4>
                <div className="owners-list">
                  {project.owners.map((i, index) => {
                    return (
                      <button key={i.id} className="owner-btn">
                        {i.fullName}
                        {project.owners.length > 1 && 
                          <i
                          onClick={() =>
                            changeProjectState(owner, "deleteOwner", {
                              projectId: project.id,
                              ownerId: project.owners[index].id,
                              onlyActiveAssignments: onlyActiveAssignments
                            })
                          }
                          >
                          Usuń
                        </i>
                        }
                        
                      </button>
                    );
                  })}
                </div>
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
                />
              </div>
            </main>

            <Modal
              key={1}
              open={this.state.editModal}
              classNames={{ modal: "Modal Modal-add-owner" }}
              contentLabel="Edit project modal"
              onClose={this.clearEditModalData}
            >
              <ProjectDetailsBlock
                onlyActiveAssignments={onlyActiveAssignments}
                editProjectStatus={this.props.editProjectStatus}
                editProjectErrors={this.props.editProjectErrors}
                project={project}
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

    changeProjectSkillsStatus: state.projectsReducer.changeProjectSkillsStatus,
    changeProjectSkillsErrors: state.projectsReducer.changeProjectSkillsErrors,

    editProjectStatus: state.projectsReducer.editProjectStatus,
    editProjectErrors: state.projectsReducer.editProjectErrors,

    loadedSkills: state.skillsReducer.loadedSkills,
    loadSkillsStatus: state.skillsReducer.loadSkillsStatus,
    loadSkillsErrors: state.skillsReducer.loadSkillsErrors,

    addSkillsToProjectStatus: state.projectsReducer.addSkillsToProjectStatus,
    addSkillsToProjectErrors: state.projectsReducer.addSkillsToProjectErrors
  };
};

const mapDispatchToProps = dispatch => {
  return {
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

    clearProjectState: () => dispatch(clearProjectState())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectDetails);
