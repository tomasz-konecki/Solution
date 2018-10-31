import React from "react";
import Detail from "../../common/Detail";
import ResultBlock from "./../../common/ResultBlock";
import DatePicker from "react-datepicker";
import moment from "moment";
import "../../../scss/components/projects/modals/ProjectDetailsBlock.scss";
import "react-datepicker/dist/react-datepicker.css";
import constraints from "../../../constraints";
import PropTypes from "prop-types";
import { translate } from "react-translate";
import WebApi from "../../../api";
import Form from "../../form/form";
import { validateInput } from "../../../services/validation";
import { mapObjectKeysToArrayByGivenIndexes } from "../../../services/methods";
import ContactList from "../../common/contactList/contactList";
import { errorCatcher } from "../../../services/errorsHandler";
import Spinner from '../../common/spinner/spinner';
const emptyField = "<brak>";
const active = "Aktywny";
const inActive = "Nieaktywny";

class ProjectDetailsBlock extends React.PureComponent {
  state = {
    editProjectArray: [
      {
        title: this.props.t("Name"),
        type: "text",
        placeholder: this.props.t("InsertProjectName"),
        value: "",
        error: "",
        inputType: null,
        minLength: 3,
        maxLength: 250,
        canBeNull: false
      },
      {
        title: this.props.t("Description"),
        type: "text",
        placeholder: this.props.t("InsertProjectDescription"),
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
        placeholder: this.props.t("InsertClientName"),
        mode: "drop-down-with-data",
        value: "",
        error: "",
        showCount: true,
        inputType: "client",
        minLength: 1,
        maxLength: 150,
        canBeNull: false,
        dataToMap: []
      },
      {
        title: this.props.t("Cloud"),
        type: "text",
        placeholder: this.props.t("ChooseCloud"),
        mode: "drop-down-with-data",
        value: "",
        error: "",
        showCount: true,
        inputType: "cloud",
        minLength: 1,
        maxLength: 150,
        canBeNull: true,
        dataToMap: [],
        disable: false
      },

      {
        title: this.props.t("StartDate"),
        name: "startDate",
        type: "text",
        placeholder: this.props.t("InsertStartDate"),
        mode: "date-picker",
        value: "",
        error: "",
        canBeBefore: true
      },
      {
        title: this.props.t("EndDate"),
        name: "endDate",
        type: "text",
        placeholder: this.props.t("wprowadź datę zakończenia projektu..."),
        mode: "date-picker",
        value: "",
        error: "",
        canBeBefore: false
      }
    ],
    isAutocorrect: false,
    fetchClientsError: "",
    isLoading: false,

    responsiblePersons: [],
    responsiblePersonArray: [
      {
        title: "Email",
        type: "text",
        placeholder: this.props.t("InsertEmail"),
        value: "",
        error: "",
        inputType: "email",
        minLength: 7,
        maxLength: 70,
        canBeNull: false
      },
      {
        title: this.props.t("FirstName"),
        type: "text",
        placeholder: this.props.t("InsertFirstName"),
        value: "",
        error: "",
        inputType: "firstName",
        minLength: 3,
        maxLength: 30,
        canBeNull: false
      },
      {
        title: this.props.t("LastName"),
        type: "text",
        placeholder: this.props.t("InsertLastName"),
        value: "",
        error: "",
        inputType: "lastName",
        minLength: 3,
        maxLength: 40,
        canBeNull: false
      },
      {
        title: this.props.t("PhoneNumber"),
        type: "text",
        placeholder: this.props.t("InsertPhoneNumber"),
        value: "",
        inputType: "phoneNumber",
        error: "",
        canBeNull: false,
        minLength: 7,
        maxLength: 20
      }
    ],

    showContactForm: false,
    selected: this.props.t("ResponsiblePerson"),
    isLoadingFormDataFirstTime: true
  };

  componentDidMount() {
    WebApi.clients.get.all().then(response => {
      const editProjectArray = [...this.state.editProjectArray];
      const responsiblePersonArray = [...this.state.responsiblePersonArray]
      const { project , responsiblePerson} = this.props;

      editProjectArray[0].value = project.name;
      editProjectArray[1].value = project.description;
      editProjectArray[2].value = project.client;
      editProjectArray[4].value = project.startDate;
      editProjectArray[5].value = project.estimatedEndDate;

      this.props.responsiblePerson && (
        responsiblePersonArray[0].value = responsiblePerson.email,
        responsiblePersonArray[1].value = responsiblePerson.firstName,
        responsiblePersonArray[2].value = responsiblePerson.lastName,
        responsiblePersonArray[3].value = responsiblePerson.phoneNumber
      )

      editProjectArray[2].dataToMap = response.replyBlock.data.dtoObjects;
      const currentSelectedClient = editProjectArray[2].dataToMap.find(client => (
        client.name === editProjectArray[2].value
      ));
      editProjectArray[3].dataToMap = currentSelectedClient.clouds;

        this.setState({ editProjectArray, responsiblePersonArray, isLoadingFormDataFirstTime: false });
    }).catch(() => this.setState({isLoadingFormDataFirstTime: false}));

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.editProjectErrors !== this.props.editProjectErrors) {
      this.setState(
        { isLoading: false },
        nextProps.editProjectStatus
          ? () => {
              setTimeout(() => {
                this.props.closeEditProjectModal();
              }, 2500);
            }
          : null
      );
    }
  }

  handleSubmit = () => {
    this.setState({
      isLoading: true,
      editProjectResult: { content: "", status: null }
    });
    const { editProjectArray, responsiblePersonArray } = this.state;
    const { project, onlyActiveAssignments, editProject, shouldOnlyEdit } = this.props;
    const projectToSend = {
      name: editProjectArray[0].value,
      description: editProjectArray[1].value,
      client: editProjectArray[3].value ? editProjectArray[3].value : editProjectArray[2].value,
      responsiblePerson: {
        firstName: responsiblePersonArray[1].value,
        lastName: responsiblePersonArray[2].value,
        email: responsiblePersonArray[0].value,
        phoneNumber: responsiblePersonArray[3].value
      },
      startDate: moment(editProjectArray[4].value).format(),
      estimatedEndDate: moment(editProjectArray[5].value).format()
    };


    if(!shouldOnlyEdit){
      editProject(
        project.id,
        projectToSend,
        onlyActiveAssignments
      );
    }
    else{
      editProject(
        projectToSend,
        project.id
      );
    }

  };

  goForClient = () => {
    const clientIdInForm = 2;
    const { getContactPersonDataACreator } = this.props;
    const editProjectArray = [...this.state.editProjectArray];

    const indexOfMatchedClient = editProjectArray[clientIdInForm].dataToMap.findIndex(i => {
      return i.name === editProjectArray[clientIdInForm].value
    });
    const allClientsContainsGivenClient = indexOfMatchedClient !== -1;

    if(allClientsContainsGivenClient){
      this.setState({isLoading: true});

      getContactPersonDataACreator(editProjectArray[clientIdInForm].
        dataToMap[indexOfMatchedClient].id).then(response => {
          if(response.length > 0){
             let responsiblePersons = [];
             const responsiblePersonArray = [...this.state.responsiblePersonArray];

             responsiblePersons = responsiblePersons.concat(response);

             responsiblePersonArray[0].value = response[0].email;
             responsiblePersonArray[1].value = response[0].firstName;
             responsiblePersonArray[2].value = response[0].lastName;
             responsiblePersonArray[3].value = response[0].phoneNumber;

             this.setState({
               responsiblePersons: responsiblePersons,
               responsiblePersonArray: responsiblePersonArray
             });
           }
           this.setState({isLoading: false});
         }).catch(() => {
           this.setState({ isLoading: false });
         })
       }
  };
  changeForm = () => {
    this.setState({
      showContactForm: !this.state.showContactForm,
      editProjectResult: { content: "", status: null }
    });
  };

  fetchContactDateByOtherClient = e => {
    const index = this.state.responsiblePersons.findIndex(i => {
      return i.email === e.target.value;
    });
    const responsiblePersonArray = [...this.state.responsiblePersonArray];
    responsiblePersonArray[0].value = this.state.responsiblePersons[
      index
    ].email;
    responsiblePersonArray[1].value = this.state.responsiblePersons[
      index
    ].firstName;
    responsiblePersonArray[2].value = this.state.responsiblePersons[
      index
    ].lastName;
    responsiblePersonArray[3].value = this.state.responsiblePersons[
      index
    ].phoneNumber;

    this.setState({
      responsiblePersonArray: responsiblePersonArray,
      selected: this.state.responsiblePersons[index].firstName
    });
  };
  render() {
    const { editProjectStatus, editProjectErrors, editable, t } = this.props;
    const { showContactForm, isLoadingFormDataFirstTime } = this.state;
    return (
      <div className="project-details-block">
        <header>
          <h3>{showContactForm ? t("AddContactPerson") : t("EditProjectData")}</h3>
        </header>

        {isLoadingFormDataFirstTime ? <Spinner fontSize="3px" positionClass="abs-spinner"/> :
          showContactForm ? (
            <Form
              btnTitle={t("Send")}
              key={1}
              shouldSubmit={true}
              onSubmit={this.handleSubmit}
              formItems={this.state.responsiblePersonArray}
              formTitle={t("ClientContactData")}
              isLoading={this.state.isLoading}
              submitResult={{
                status: editProjectStatus,
                content: editProjectStatus
                  ? t("ProjectHasBeenEdited")
                  : editProjectErrors && editProjectErrors[0]
              }}
            >
              <button
                onClick={this.changeForm}
                type="button"
                className="come-back-btn"
              >
                {t("Back")}
              </button>
              {this.state.responsiblePersons &&
              this.state.responsiblePersons.length > 0 ? (
                <ContactList
                  selected={this.state.selected}
                  onChange={e => this.fetchContactDateByOtherClient(e)}
                  items={this.state.responsiblePersons}
                  t={this.props.t}
                />
              ) : null}
            </Form>
          ) : (
            <Form
              key={2}
              dateIndexesToCompare={[3, 4]}
              onSubmit={this.changeForm}
              shouldSubmit={false}
              btnTitle={t("Next")}
              cloudIdInForm={3}
              isLoading={this.state.isLoading}
              endDate={this.props.estimatedEndDate}
              formItems={this.state.editProjectArray}
              clientsWhichMatch={this.state.clientsWhichMatch}
              onBlur={this.goForClient}
            />
          )
        }

      </div>
    );
  }
}
export default translate("ProjectDetailsBlock")(ProjectDetailsBlock);
