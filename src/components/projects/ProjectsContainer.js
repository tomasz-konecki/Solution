import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as projectsActions from "../../actions/projectsActions";
import { loadClients } from "../../actions/clientsActions";
import * as asyncActions from "../../actions/asyncActions";
import * as persistHelpActions from "../../actions/persistHelpActions";
import Modal from "react-responsive-modal";
import ProjectsList from "../../components/projects/ProjectsList";
import WebApi from "../../api/";
import "../../scss/containers/ProjectsContainer.scss";
import { fetchFormClientsACreator } from "../../actions/persistHelpActions";
import { ACTION_CONFIRMED } from "./../../constants";
import { Route, Switch, withRouter } from "react-router-dom";
import ProjectDetails from "./ProjectDetails/ProjectDetails";
import Form from "../form/form";
import moment from "moment";
import { validateInput } from "../../services/validation";
import ContactList from "../../components/common/contactList/contactList";
import { translate } from "react-translate";
import { clearDataOfForm } from "../../services/methods";

const ClientId = 2;
const CloudId = 3;

class ProjectsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      currentPage: 1,
      limit: 15,
      init: false,
      addNewProjectFormValues: [
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
          title: this.props.t("Client"),
          type: "text",
          placeholder: this.props.t("ClientPlaceHolder"),
          mode: "drop-down-with-data",
          value: "",
          showCount: true,
          error: "",
          inputType: "client",
          minLength: 1,
          maxLength: 150,
          canBeNull: false,
          dataToMap: []
        },
        {
          title: this.props.t("Cloud"),
          type: "text",
          placeholder: this.props.t("CloudPlaceHolder"),
          mode: "drop-down-with-data",
          value: "",
          showCount: true,
          error: "",
          inputType: "cloud",
          minLength: 1,
          maxLength: 150,
          canBeNull: true,
          dataToMap: [],
          disable: true
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
      openFirstForm: true,
      selected: this.props.t("SelectPeopleToContact"),
      responsiblePersons: [],
      isLoading: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clients !== this.props.clients) {
      const addNewProjectFormValues = [...this.state.addNewProjectFormValues];
      addNewProjectFormValues[ClientId].dataToMap = [...nextProps.clients];
      this.setState({ addNewProjectFormValues: addNewProjectFormValues });
    }
    if (this.validatePropsForAction(nextProps, "deleteProject")) {
      this.props.async.setActionConfirmationProgress(true);
      WebApi.projects.delete
        .deleteProject(this.props.toConfirm.id)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(this.state.currentPage);
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
    if (this.validatePropsForAction(nextProps, "closeProject")) {
      this.props.async.setActionConfirmationProgress(true);
      WebApi.projects.put
        .closeProject(this.props.toConfirm.id)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(this.state.currentPage);
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
    if (this.validatePropsForAction(nextProps, "reactivateProject")) {
      this.props.async.setActionConfirmationProgress(true);
      WebApi.projects.put
        .reactivateProject(this.props.toConfirm.id)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(this.state.currentPage);
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
    if (this.validatePropsForAction(nextProps, "deleteProjectOwner")) {
      this.props.async.setActionConfirmationProgress(true);
      const { ownerId, projectId } = this.props.toConfirm;
      WebApi.projects.delete
        .owner(projectId, ownerId)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(this.state.currentPage);
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
    if (this.validatePropsForAction(nextProps, "putProjectSkills")) {
      this.props.async.setActionConfirmationProgress(true);
      const { projectId, skillsArray } = this.props.toConfirm;
      WebApi.projects.put
        .skills(projectId, skillsArray)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(this.state.currentPage);
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
    if (nextProps.createProjectErrors !== this.props.createProjectErrors) {
      this.setState({ isLoading: false });
    }
  }

  validatePropsForAction(nextProps, action) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === action
    );
  }

  pageChange(page = this.state.currentPage, other = {}) {
    this.setState(
      {
        currentPage: page
      },
      () =>
        this.props.projectActions.loadProjects(
          this.state.currentPage,
          this.state.limit,
          other
        )
    );
  }

  handleOpenModal() {
    this.props.loadClients();
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }
  changeForm = () => {
    this.goForClient();
    this.setState({ openFirstForm: !this.state.openFirstForm });
  };

  goForClient = () => {
    const clientIdInForm = 2;

    const { projectActions } = this.props;
    const addNewProjectFormValues = [...this.state.addNewProjectFormValues];

    const indexOfMatchedClient = addNewProjectFormValues[
      clientIdInForm
    ].dataToMap.findIndex(i => {
      return i.name === addNewProjectFormValues[clientIdInForm].value;
    });

    const allClientsContainsGivenClient = indexOfMatchedClient !== -1;

    if (allClientsContainsGivenClient) {
      this.setState({ isLoading: true });

      projectActions
        .getContactPersonDataACreator(
          addNewProjectFormValues[clientIdInForm].dataToMap[
            indexOfMatchedClient
          ].id
        )
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

  handleSubmit = () => {
    this.setState({ isLoading: true });
    const { responsiblePersonFormValues } = this.state;
    const addNewProjectFormValues = [...this.state.addNewProjectFormValues];
    const { history, match, projectActions, clientsActions } = this.props;

    projectActions
      .createProjectACreator(
        addNewProjectFormValues,
        responsiblePersonFormValues
      )
      .then(response => {
        clearDataOfForm(addNewProjectFormValues);
        addNewProjectFormValues[CloudId].disable = true;
        setTimeout(() => {
          this.setState({
            showModal: false,
            openFirstForm: true,
            addNewProjectFormValues: addNewProjectFormValues
          });
          projectActions.createProject(null, []);
          history.push(match.url + "/" + response.id);
        }, 1500);
      });
  };

  pullDOM = () => {
    const {
      addNewProjectFormValues,
      responsiblePersonFormValues,
      openFirstForm,
      selected,
      responsiblePersons,
      isLoading
    } = this.state;
    const { t, createProjectStatus, createProjectErrors } = this.props;
    const today = new Date();
    if (!this.state.init) {
      this.setState(
        {
          init: true
        },
        this.pageChange(this.state.currentPage)
      );
    }
    return (
      <div>
        <ProjectsList
          push={this.props.history.push}
          openAddProjectModal={this.handleOpenModal}
          projects={this.props.projects}
          currentPage={this.state.currentPage}
          totalPageCount={this.props.totalPageCount}
          pageChange={this.pageChange}
          loading={this.props.loading}
          projectActions={this.props.projectActions}
          limit={this.state.limit}
        />
        <Modal
          key={1}
          open={this.state.showModal}
          classNames={{
            modal: `Modal ${openFirstForm ? "Modal-add-project" : ""}`
          }}
          contentLabel="Add project modal"
          onClose={() => this.setState({ showModal: false })}
        >
          <header>
            <h3>{openFirstForm ? t("AddProject") : t("ContactPerson")}</h3>
          </header>

          {openFirstForm ? (
            <Form
              btnTitle={t("Next")}
              key={1}
              shouldSubmit={false}
              dateIndexesToCompare={[3, 4]}
              onSubmit={this.changeForm}
              cloudIdInForm={CloudId}
              formItems={addNewProjectFormValues}
              endDate={today.getDate()}
              onBlur={this.goForClient}
            />
          ) : (
            <Form
              btnTitle={t("Add")}
              key={2}
              shouldSubmit={true}
              formItems={responsiblePersonFormValues}
              onSubmit={this.handleSubmit}
              isLoading={isLoading}
              submitResult={{
                status: createProjectStatus,
                content: createProjectStatus
                  ? t("ProjectHasBeenAdded")
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
      </div>
    );
  };

  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={match.url + ""} component={this.pullDOM} />
        <Route path={match.url + "/:id"} component={ProjectDetails} />
      </Switch>
    );
  }
}

function mapStateToProps(state) {
  return {
    projects: state.projectsReducer.projects,
    totalPageCount: state.projectsReducer.totalPageCount,
    loading: state.asyncReducer.loading,
    confirmed: state.asyncReducer.confirmed,
    toConfirm: state.asyncReducer.toConfirm,
    isWorking: state.asyncReducer.isWorking,
    type: state.asyncReducer.type,
    clients: state.clientsReducer.clients,

    fetchedFormClients: state.persistHelpReducer.fetchedFormClients,
    fetchStatus: state.persistHelpReducer.fetchStatus,
    fetchError: state.persistHelpReducer.fetchError,

    createProjectStatus: state.projectsReducer.createProjectStatus,
    createProjectErrors: state.projectsReducer.createProjectErrors,

    contactPersonData: state.projectsReducer.contactPersonData,
    getContactPersonDataStatus:
      state.projectsReducer.getContactPersonDataStatus,
    getContactPersonDataErrors: state.projectsReducer.getContactPersonDataErrors
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectsActions, dispatch),
    async: bindActionCreators(asyncActions, dispatch),
    persistHelpActions: bindActionCreators(persistHelpActions, dispatch),
    loadClients: () => dispatch(loadClients())
  };
}

ProjectsContainer.propTypes = {
  async: PropTypes.shape({
    setActionConfirmationResult: PropTypes.func,
    setActionConfirmationProgress: PropTypes.func,
    fetchFormClients: PropTypes.func
  }),
  toConfirm: PropTypes.object,
  projectActions: PropTypes.object,
  projects: PropTypes.arrayOf(PropTypes.object),
  totalPageCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  fetchedFormClients: PropTypes.arrayOf(PropTypes.object),
  fetchStatus: PropTypes.bool,
  fetchError: PropTypes.arrayOf(PropTypes.string),
  persistHelpActions: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("AddProjectScreen")(withRouter(ProjectsContainer)));
