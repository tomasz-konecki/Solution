import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as projectsActions from "../../actions/projectsActions";
import * as asyncActions from "../../actions/asyncActions";
import * as persistHelpActions from '../../actions/persistHelpActions';
import Modal from "react-responsive-modal";
import AddProjectScreen from "../../components/projects/modals/AddProjectScreen";
import ProjectsList from "../../components/projects/ProjectsList";
import WebApi from "../../api/";
import ProjectDetailContainer from "./ProjectDetailContainer";
import ProjectDetails from "./ProjectDetails/ProjectDetails";
import "../../scss/containers/ProjectsContainer.scss";
import { fetchFormClientsACreator } from '../../actions/persistHelpActions';
import { ACTION_CONFIRMED } from "./../../constants";
import { Route, Switch, withRouter } from "react-router-dom";
import Form from '../form/form';
import moment from 'moment';
import { validateInput } from '../../services/validation';
import ContactList from '../../components/common/contactList/contactList';
const ClientId = 2;


class ProjectsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      currentPage: 1,
      limit: 15,
      init: false,
      addNewProjectArray: [
        {title: "Nazwa", type: "text", placeholder: "wprowadź nazwę projektu...", value: "", error: "", inputType: "name", minLength: 3, maxLength: 25, canBeNull: false},
        {title: "Opis", type: "text", placeholder: "wprowadź opis projektu...", mode: "textarea", value: "", error: "", inputType: null, minLength: 3, maxLength: 1500, canBeNull: false},
        {title: "Klient", type: "text", placeholder: "wprowadź klienta...", mode: "drop-down-with-data", value: "", error: "", inputType: "client", minLength: 3, maxLength: 100, canBeNull: false},
        {title: "Data rozpoczęcia", name: "startDate", type: "text", placeholder: "wprowadź datę rozpoczęcia projektu...", mode: "date-picker", value: moment(), error: "", canBeBefore: true},
        {title: "Data zakończenia ", name: "endDate", type: "text", placeholder: "wprowadź datę zakończenia projektu...", mode: "date-picker", value: moment(), error: "", canBeBefore: false},
      ],
      responsiblePersonsArray: [
        {title: "Email", type: "text", placeholder: "wprowadź adres email...", value: "", error: "", inputType: "email", minLength: 7, maxLength: 70, canBeNull: false},
        {title: "Imię", type: "text", placeholder: "wprowadź imię...", value: "", error: "", inputType: "firstName", minLength: 3, maxLength: 30, canBeNull: false},
        {title: "Nazwisko", type: "text", placeholder: "wprowadź nazwisko...", value: "", error: "", inputType: "lastName", minLength: 3, maxLength: 40, canBeNull: false},
        {title: "Numer telefonu", type: "text", placeholder: "wprowadź numer telefonu...", value: "", inputType: "phoneNumber", error: "", canBeNull: false, 
        minLength: 7, maxLength: 20}
      ],
      openFirstForm: true,
      selected: "Wybierz osoby do kontaktu",
      responsiblePersons: [],
      isLoading: false
    };
    
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }
  componentDidMount(){
    const { fetchStatus, persistHelpActions } = this.props;
    if(!fetchStatus) 
      persistHelpActions.fetchFormClientsACreator();
  }
  onChangeClient = event => {
    const addNewProjectArray = [...this.state.addNewProjectArray];
    addNewProjectArray[ClientId].value = event.target.value;
    addNewProjectArray[ClientId].error = validateInput(event.target.value,
      addNewProjectArray[ClientId].canBeNull, 
      addNewProjectArray[ClientId].minLength,
      addNewProjectArray[ClientId].maxLength,
      addNewProjectArray[ClientId].inputType, 
      addNewProjectArray[ClientId].title);
      
  
    this.setState({
      addNewProjectArray: addNewProjectArray
    });
     
  }
  componentWillReceiveProps(nextProps) {
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
    if(nextProps.createProjectErrors !== this.props.createProjectErrors){
      this.setState({isLoading: false});
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
    persistHelpActions.fetchFormClientsACreator();
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }
  changeForm = () => {
    this.setState({openFirstForm: !this.state.openFirstForm});
  }
  
  goForClient = () => {
    const { fetchedFormClients } = this.props;
    const { responsiblePersonsArray, addNewProjectArray } = this.state;
    
    const index = fetchedFormClients.findIndex(i => {
      return i.name === addNewProjectArray[ClientId].value;
    });
    if(index !== -1){
      this.setState({isLoading: true});
      WebApi.responsiblePerson.get.byClient(fetchedFormClients[index].id).
      then(response => {
          if(response.replyBlock.data.dtoObjects.length > 0){
            let responsiblePersons = [];
        
            responsiblePersons = responsiblePersons.concat(response.replyBlock.data.dtoObjects);
            const responsiblePersonsArray = [...this.state.responsiblePersonsArray];
            responsiblePersonsArray[0].value = response.replyBlock.data.dtoObjects[0].email;
            responsiblePersonsArray[1].value = response.replyBlock.data.dtoObjects[0].firstName;
            responsiblePersonsArray[2].value = response.replyBlock.data.dtoObjects[0].lastName;
            responsiblePersonsArray[3].value = response.replyBlock.data.dtoObjects[0].phoneNumber;
            
            this.setState({
              responsiblePersons: responsiblePersons,
              responsiblePersonsArray: responsiblePersonsArray,
              isLoading: false
            });
          }
          else
            this.setState({isLoading: false});
      }).catch(error => {
        this.setState({isLoading: false});
      });
    }
    
  }

  fetchContactDateByOtherClient = e => {
    const { responsiblePersons } = this.state;
    const index = responsiblePersons.findIndex(i => {
      return i.firstName === e.target.value
    });
    const responsiblePersonsArray = [...this.state.responsiblePersonsArray];
    responsiblePersonsArray[0].value = responsiblePersons[index].email;
    responsiblePersonsArray[1].value = responsiblePersons[index].firstName;
    responsiblePersonsArray[2].value = responsiblePersons[index].lastName;
    responsiblePersonsArray[3].value = responsiblePersons[index].phoneNumber;

    this.setState({responsiblePersonsArray: responsiblePersonsArray,
      selected: responsiblePersons[index].firstName});
  }

  handleSubmit = () => {
    this.setState({isLoading: true});
    const { responsiblePersonsArray, addNewProjectArray } = this.state;
    const { history, match, projectActions } = this.props;
    projectActions.createProjectACreator(addNewProjectArray, responsiblePersonsArray,
      history, match.url);
  }


  pullDOM = () => {
    const { addNewProjectArray, responsiblePersonsArray, 
      openFirstForm, selected, responsiblePersons, isLoading } = this.state;
    const { createProjectStatus, createProjectErrors } = this.props;
    const today = new Date()
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
          classNames={{ modal: "Modal Modal-add-owner" }}
          contentLabel="Add project modal"
          onClose={() => this.setState({showModal: false})}
        >
          <header>
            <h3>Dodaj projekt</h3>
          </header>

          {openFirstForm ? 
            <Form btnTitle="Dalej" key={1} shouldSubmit={false} 
            dateIndexesToCompare={[3,4]} onSubmit={this.changeForm}
            formItems={addNewProjectArray} 
            endDate={today.getDate()}
            clientsWhichMatch={this.props.fetchedFormClients}
            onChangeClient={event => this.onChangeClient(event)} 
            onBlur={this.goForClient} /> :

            <Form btnTitle="Dodaj" key={2} shouldSubmit={true} 
            formItems={responsiblePersonsArray} onSubmit={this.handleSubmit}
            isLoading={isLoading} submitResult={{
              status: createProjectStatus,
              content: createProjectStatus ? "Pomyślnie dodano projekt. Jesteś przekierowywany..." : 
              createProjectErrors && createProjectErrors[0]
            }}>
              <button onClick={this.changeForm} 
                type="button" className="come-back-btn">
                  Cofnij
              </button>

              {responsiblePersons.length > 0 && 
                <ContactList 
                  selected={selected}
                  onChange={e => this.fetchContactDateByOtherClient(e)} 
                  items={responsiblePersons} 
                /> 
              }
            </Form>
          }
        </Modal>
      </div>
    );
  };

  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={match.url + ""} component={this.pullDOM} />
        <Route exact path={match.url + "/:id"} component={ProjectDetails} />
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

    fetchedFormClients: state.persistHelpReducer.fetchedFormClients,
    fetchStatus: state.persistHelpReducer.fetchStatus,
    fetchError: state.persistHelpReducer.fetchError,

    createProjectStatus: state.projectsReducer.createProjectStatus,
    createProjectErrors: state.projectsReducer.createProjectErrors
  }
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectsActions, dispatch),
    async: bindActionCreators(asyncActions, dispatch),
    persistHelpActions: bindActionCreators(persistHelpActions, dispatch)
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectsContainer));
