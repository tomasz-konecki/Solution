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
import { bindActionCreators } from "redux";
import { loadClients } from "../../../actions/clientsActions";
import * as projectsActions from "../../../actions/projectsActions";
import {
  createProjectPhaseACreator,
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
import ContactList from "../../../components/common/contactList/contactList";
import { clearDataOfForm } from "../../../services/methods";

class ProjectDetails extends Component {
  workerNames = [
    this.props.t("Name"),
    this.props.t("Role"),
    this.props.t("Experience"),
    this.props.t("Position"),
    this.props.t("StartDate"),
    this.props.t("EndDate")
  ];
  projectPhasesNames = [
    this.props.t("Name"),
    this.props.t("StartDate"),
    this.props.t("EndDate"),
    this.props.t("Status")
  ]
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
    addNewProjectPhaseFormValues: [
      {
        title: this.props.t("ProjectName"),
        type: "text",
        placeholder: `${this.props.t("Insert")} ${this.props.t(
          "ProjectName"
        )}`,
        value: "",
        error: "",
        inputType: "nameWithPolishLetters",
        minLength: 3,
        maxLength: 25,
        canBeNull: false
      },
      {
        title: this.props.t("Description"),
        type: "text",
        placeholder: `${this.props.t("Insert")} ${this.props.t(
          "Description"
        )}`,
        mode: "textarea",
        value: "",
        error: "",
        inputType: null,
        minLength: 3,
        maxLength: 1500,
        canBeNull: false
      },      
      {
        title: this.props.t("StartDate"),
        name: "startDate",
        type: "text",
        placeholder: `${this.props.t("Insert")} ${this.props.t("StartDate")}`,
        mode: "date-picker",
        value: moment(),
        error: "",
        canBeBefore: true
      },
      {
        title: this.props.t("EndDate"),
        name: "endDate",
        type: "text",
        placeholder: `${this.props.t("Insert")} ${this.props.t("EndDate")}`,
        mode: "date-picker",
        value: moment(),
        error: "",
        canBeBefore: false
      }
      ],
      responsiblePersonFormValues: [
        {
          title: "Email",
          type: "text",
          placeholder: `${this.props.t("Insert")} Email
          `,
          value: "",
          error: "",
          inputType: "email",
          minLength: 7,
          maxLength: 70,
          canBeNull: false
        },
        {
          title: this.props.t("Name"),
          type: "text",
          placeholder: `${this.props.t("Insert")} ${this.props.t("Name")}`,
          value: "",
          error: "",
          inputType: "firstName",
          minLength: 3,
          maxLength: 30,
          canBeNull: false
        },
        {
          title: this.props.t("Surname"),
          type: "text",
          placeholder: `${this.props.t("Insert")} ${this.props.t("Surname")}`,
          value: "",
          error: "",
          inputType: "lastName",
          minLength: 3,
          maxLength: 40,
          canBeNull: false
        },
        {
          title: this.props.t("Phone"),
          type: "text",
          placeholder: `${this.props.t("Insert")} ${this.props.t("Phone")}`,
          value: "",
          inputType: "phoneNumber",
          error: "",
          canBeNull: false,
          minLength: 7,
          maxLength: 20
        }
      ],
      showAddPhaseModal: false,
      openFirstForm: true,
      selected: this.props.t("SelectPeopleToContact"),
      responsiblePersons: [],
      isLoading: false
  };
  componentDidMount() {
    this.loadProjectData("isLoadingProject",null);
    const { getSuggest } = this.props;
    getSuggest(this.props.match.params.id);
  }

  handleOpenModal() {
    this.props.loadClients();
    this.setState({ showAddPhaseModal: true });
  }

  handleCloseModal() {
    this.setState({ showAddPhaseModal: false });
  }
  changeForm = () => {
    this.goForClient();
    this.setState({ openFirstForm: !this.state.openFirstForm });
  };

  goForClient = () => {
    const { getContactPersonDataACreator, project, clients } = this.props;
    const matchedClient = clients.find(client => client.name === project.client);
    if (matchedClient) {
      const clientId = matchedClient.id
      this.setState({ isLoading: true });
      getContactPersonDataACreator(clientId)
      .then(response => {
        if (response.length > 0) {
          let responsiblePersons = [];
          const responsiblePersonFormValues = [
            ...this.state.responsiblePersonFormValues
          ];

          responsiblePersons = responsiblePersons.concat(response);

          responsiblePersonFormValues[0].value = response[0].email;
          responsiblePersonFormValues[1].value = response[0].firstName;
          responsiblePersonFormValues[2].value = response[0].lastName;
          responsiblePersonFormValues[3].value = response[0].phoneNumber;

          this.setState({
            responsiblePersons: responsiblePersons,
            responsiblePersonFormValues: responsiblePersonFormValues
          });
        }
          this.setState({ isLoading: false });
        })
        .catch(error => {
          this.setState({ isLoading: false });
        });
    }
  };

  fetchContactDateByOtherClient = e => {
    const { responsiblePersons } = this.state;
    const index = responsiblePersons.findIndex(i => {
      return i.firstName === e.target.value;
    });
    const responsiblePersonFormValues = [
      ...this.state.responsiblePersonFormValues
    ];
    responsiblePersonFormValues[0].value = responsiblePersons[index].email;
    responsiblePersonFormValues[1].value = responsiblePersons[index].firstName;
    responsiblePersonFormValues[2].value = responsiblePersons[index].lastName;
    responsiblePersonFormValues[3].value =
      responsiblePersons[index].phoneNumber;

    this.setState({
      responsiblePersonFormValues: responsiblePersonFormValues,
      selected: responsiblePersons[index].firstName
    });
  };

  addProjectPhase = () => {
    this.setState({ isLoading: true });
    const { responsiblePersonFormValues } = this.state;
    const addNewProjectPhaseFormValues = [...this.state.addNewProjectPhaseFormValues];
    const { projectActions, project, createProjectPhase } = this.props;
    let parentProjectData = null;
    if(project) {
      parentProjectData = {
        parentId: project.id,
        client: project.client
      }
    }
    createProjectPhase(
      addNewProjectPhaseFormValues,
      responsiblePersonFormValues,
      parentProjectData
    )
    .then(response => {
      clearDataOfForm(addNewProjectPhaseFormValues);
      setTimeout(() => {
        this.setState({
          showAddPhaseModal: false,
          openFirstForm: true,
          addNewProjectPhaseFormValues: addNewProjectPhaseFormValues
        });
        projectActions.createProjectPhase(null, []);
        this.loadProjectData("isLoadingProject",null);
      }, 1500);
    });
  };

  togleActiveAssignments = () => {
    const { onlyActiveAssignments } = this.state;
    this.setState({ onlyActiveAssignments: !onlyActiveAssignments }, () => this.loadProjectData("isChangingAssignments"));
  };

  loadProjectData = (operationName, projectId) => {
    this.setState({[operationName]: true});
    const { getProjectDataACreator, match } = this.props;
    const { onlyActiveAssignments } = this.state;
    if(projectId){
      getProjectDataACreator(projectId, onlyActiveAssignments).then(() => {
        this.setState({[operationName]: false});
      }).catch(() => this.setState({[operationName]: false}));
    } else {
      getProjectDataACreator(match.params.id, onlyActiveAssignments).then(() => {
        this.setState({[operationName]: false});
      }).catch(() => this.setState({[operationName]: false}));
    }
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
    if (this.props.match.params.id !== nextProps.match.params.id){
      this.loadProjectData("isLoadingProject", nextProps.match.params.id);
    }

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

  projectPhaseData = () => {
    const {project} = this.props;
    let projectPhases = project.projectPhases.map(phase => ({...phase}) );

    for(let phase of projectPhases) {
      for(let key in phase){
        if(phase[key] === null){
          delete(phase[key]);
        }
      }
    }
    return projectPhases;
  }

  pushIntoRoute = path => {
    const {history} = this.props;
    history.push(path);
  }

  render() {
    const { project, loading, loadProjectStatus, addEmployeeToProjectStatus,
      addEmployeeToProjectErrors, changeProjectState, changeProjectStateStatus,
      changeProjectStateErrors, getSuggestEmployeesStatus, suggestEmployees,
      addProjectOwnerToProjectStatus, addProjectOwnerToProjectErrors, t, createProjectStatus, createProjectErrors} = this.props;
    const projectPhases = project ? this.projectPhaseData() : null;
    const { reactivate, close } = WebApi.projects.put;
    const { projectStatus, onlyActiveAssignments, matches, currentOpenedRow,
      isChangingAssignments, isLoadingProject, openFirstForm, addNewProjectPhaseFormValues, responsiblePersonFormValues, isLoading, responsiblePersons, selected } = this.state;
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
                    {projectStatus[0].name}
                  </span>
                )}
                {project.parentName &&
                <div>
                  <span className="parent-name-span">{project.parentName}</span>
                  <i className="fas fa-arrow-circle-right"
                    onClick={() => this.pushIntoRoute(`/main/projects/${project.parentId}`)} /> 
                </div>}
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
                    {loading && <Spinner fontSize="1.77px" position="relative" positionClass="" />}
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
                  canEditFeedbacks={
                    binaryPermissioner(false)(0)(1)(1)(1)(1)(1)(this.props.binPem)
                  }
                  isDeveloper={
                    binaryPermissioner(false)(1)(0)(0)(0)(0)(0)(this.props.binPem)
                  }
                  onlyActiveAssignments={this.state.onlyActiveAssignments}
                />                                  
                 {project && !project.parentId ?
                    project.projectPhases.length > 0 ? (
                    <div className="table-container table">
                    <h3>{t("ProjectPhases")}</h3>
                    <table key={15}>
                    <thead>
                      <tr>
                        {this.projectPhasesNames.map((th, i) => <th key={i}>{th}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {projectPhases.map((phase) => (
                        <tr key={phase.id} onClick={() => this.pushIntoRoute(`/main/projects/${phase.id}`)}>
                          <td>{phase.name}</td>
                          <td>{phase.startDate.slice(0,10)}</td>
                          <td>{phase.estimatedEndDate.slice(0,10)}</td>
                          <td>{this.calculateProjectStatus(phase.status, phase.isDeleted)[0].name}</td>
                        </tr>
                      )
                        )}
                    </tbody>                        
                    </table>
                    <button className="add-programmer-btn" onClick={() => this.setState({showAddPhaseModal: true})}>{t("Add")}</button>
                  </div>
                  ): 
                  <div className="empty-project-phases-container">
                    <div>
                      <span>{t("EmptyProjectPhases")}</span>
                      <div  onClick={() => this.setState({showAddPhaseModal: true})}>
                        <i className="fas fa-briefcase fa-lg " /> 
                        <i className="fas fa-plus" />  
                      </div>                
                    </div>
                  </div>:
                  ''}
                    
                  
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
                                  <React.Fragment key={index}>
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
            key={10}
            open={this.state.showAddPhaseModal}
            classNames={{
              modal: `Modal ${openFirstForm ? "Modal-add-project" : ""}`
            }}
            contentLabel="Add project modal"
            onClose={() => this.setState({ showAddPhaseModal: false })}
          >
            <header>
              <h3>{openFirstForm ? t("AddProjectPhase") : t("ContactPerson")}</h3>
            </header>

          {openFirstForm ? (
            <Form
              btnTitle={t("Next")}
              key={11}
              shouldSubmit={false}
              dateIndexesToCompare={[2, 3]}
              onSubmit={this.changeForm}
              formItems={addNewProjectPhaseFormValues}
              endDate={moment()}
              onBlur={this.goForClient}
            />
          ) : (
            <Form
              btnTitle={t("Add")}
              key={12}
              shouldSubmit={true}
              formItems={responsiblePersonFormValues}
              onSubmit={this.addProjectPhase}
              isLoading={isLoading}
              submitResult={{
                status: createProjectStatus,
                content: createProjectStatus
                  ? t("ProjectPhaseHasBeenAdded")
                  : createProjectErrors && createProjectErrors[0]
              }}
            >
              <button
                onClick={this.changeForm}
                type="button"
                className="come-back-btn"
              >
                {t("Back")}
              </button>

              {responsiblePersons.length > 0 && (
                <ContactList
                  selected={selected}
                  onChange={e => this.fetchContactDateByOtherClient(e)}
                  items={responsiblePersons}
                  t={this.props.t}
                />
              )}
            </Form>
            )}
          </Modal>

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
    clients: state.clientsReducer.clients,

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

    createProjectStatus: state.projectsReducer.createProjectStatus,
    createProjectErrors: state.projectsReducer.createProjectErrors,

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
    loadClients: () => dispatch(loadClients()),
    createProjectPhase: (firstArray, secondArray, parentProjectData) => dispatch(createProjectPhaseACreator(firstArray, secondArray, parentProjectData)),
    projectActions: bindActionCreators(projectsActions, dispatch),
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
