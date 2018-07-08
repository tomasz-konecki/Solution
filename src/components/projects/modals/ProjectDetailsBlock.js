import React from "react";
import Detail from "../../common/Detail";
import ResultBlock from "./../../common/ResultBlock";
import DatePicker from "react-datepicker";
import moment from "moment";
import "../../../scss/components/projects/modals/ProjectDetailsBlock.scss";
import "react-datepicker/dist/react-datepicker.css";
import ResponsiblePersonBlock from "./ResponsiblePersonBlock";
import constraints from "../../../constraints";
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import WebApi from "../../../api";
import Form from '../../form/form';
import { validateInput } from '../../../services/validation';
import { mapObjectKeysToArrayByGivenIndexes } from '../../../services/methods';
import ContactList from '../../common/contactList/contactList';
import {errorCatcher} from '../../../services/errorsHandler';
const emptyField = "<brak>";
const active = "Aktywny";
const inActive = "Nieaktywny";

class ProjectDetailsBlock extends React.PureComponent {
      state = {
        editProjectArray: [
          {title: "Nazwa", type: "text", placeholder: "wprowadź nazwę projektu...", value: "", error: "", inputType: "name", minLength: 3, maxLength: 25, canBeNull: false},
          {title: "Opis", type: "text", placeholder: "wprowadź opis projektu...", mode: "textarea", value: "", error: "", inputType: null, minLength: 3, maxLength: 1500, canBeNull: false},
          {title: "Klient", type: "text", placeholder: "wprowadź klienta...", mode: "drop-down-with-data", value: "", error: "", inputType: "client", minLength: 3, maxLength: 100, canBeNull: false},
          {title: "Data rozpoczęcia", name: "startDate", type: "text", placeholder: "wprowadź datę rozpoczęcia projektu...", mode: "date-picker", value: "", error: "", canBeBefore: true},
          {title: "Data zakończenia ", name: "endDate", type: "text", placeholder: "wprowadź datę zakończenia projektu...", mode: "date-picker", value: "", error: "", canBeBefore: false},
        ],
        fetchedClients: [],
        clientError: "",
        clientsWhichMatch: [],
        isAutocorrect: false,
        fetchClientsError: "",
        autoCorrect: true,
        isLoading: false,

        responsiblePersons: [],

        responsiblePersonArray: [
          {title: "Email", type: "text", placeholder: "wprowadź adres email...", value: "", error: "", inputType: "email", minLength: 7, maxLength: 70, canBeNull: false},
          {title: "Imię", type: "text", placeholder: "wprowadź imię...", value: "", error: "", inputType: "firstName", minLength: 3, maxLength: 30, canBeNull: false},
          {title: "Nazwisko", type: "text", placeholder: "wprowadź nazwisko...", value: "", error: "", inputType: "lastName", minLength: 3, maxLength: 40, canBeNull: false},
          {title: "Numer telefonu", type: "text", placeholder: "wprowadź numer telefonu...", value: "", inputType: "phoneNumber", error: "", canBeNull: false, 
          minLength: 7, maxLength: 20}
        ],

        showContactForm: false,
        selected: "Wybierz osoby do kontaktu"
      }
 
  componentDidMount() {
    WebApi.clients.get.all().then(response => {
      this.setState({fetchedClients: response.replyBlock.data.dtoObjects});
      this.goForClient();
    });

    const editProjectArray = [...this.state.editProjectArray];
    const keys = mapObjectKeysToArrayByGivenIndexes(this.props.project, [1, 2, 3, 4, 5]);
    for(let i = 0; i < keys.length; i++){
      editProjectArray[i].value = this.props.project[keys[i]];
    }
    this.setState({editProjectArray: editProjectArray});
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.editProjectErrors !== this.props.editProjectErrors){
      this.setState({isLoading: false});
    }
  }
  
  handleSubmit = () => {
      this.setState({isLoading: true, 
        editProjectResult: {content: "", status: null}});
      const projectToSend = {
        name: this.state.editProjectArray[0].value,
        description: this.state.editProjectArray[1].value,
        client: this.state.editProjectArray[2].value,
        responsiblePerson: {
          firstName: this.state.responsiblePersonArray[1].value,
          lastName: this.state.responsiblePersonArray[2].value,
          email: this.state.responsiblePersonArray[0].value,
          phoneNumber: this.state.responsiblePersonArray[3].value,
        },
        startDate: moment(this.state.editProjectArray[3].value).format(),
        estimatedEndDate: moment(this.state.editProjectArray[4].value).format()
      }
      this.props.editProject(this.props.project.id, projectToSend);
  }
  onChangeClient = event => {
    const ClientId = 2;
    const editProjectArray = [...this.state.editProjectArray];
    editProjectArray[ClientId].value = event.target.value;
    editProjectArray[ClientId].error = validateInput(event.target.value,
      editProjectArray[ClientId].canBeNull, 
      editProjectArray[ClientId].minLength,
      editProjectArray[ClientId].maxLength,
      editProjectArray[ClientId].inputType, 
      editProjectArray[ClientId].title);
    const clientsWhichMatch = [];
    if(this.state.fetchedClients.length > 0 && this.state.autoCorrect){
      for(let key in this.state.fetchedClients){
        if(this.state.fetchedClients[key].name){
          if(this.state.fetchedClients[key].name.search(event.target.value) !== -1){
            clientsWhichMatch.push(this.state.fetchedClients[key]);
          }
        }
      }      
    }
    this.setState({
      editProjectArray: editProjectArray,
      clientsWhichMatch: clientsWhichMatch,
      clientError: editProjectArray[ClientId].error ? true : false
    });
     
  }
  
  goForClient = () => {
    const index = this.state.fetchedClients.findIndex(i => {
      return i.name === this.state.editProjectArray[2].value;
    });
    if(index !== -1){
      WebApi.responsiblePerson.get.byClient(this.state.fetchedClients[index].id).
      then(response => {
          if(response.replyBlock.data.dtoObjects.length > 0){
            let responsiblePersons = [];
        
            responsiblePersons = responsiblePersons.concat(response.replyBlock.data.dtoObjects);
            const responsiblePersonArray = [...this.state.responsiblePersonArray];
            responsiblePersonArray[0].value = response.replyBlock.data.dtoObjects[0].email;
            responsiblePersonArray[1].value = response.replyBlock.data.dtoObjects[0].firstName;
            responsiblePersonArray[2].value = response.replyBlock.data.dtoObjects[0].lastName;
            responsiblePersonArray[3].value = response.replyBlock.data.dtoObjects[0].phoneNumber;
            
            this.setState({
              responsiblePersons: responsiblePersons,
              responsiblePersonArray: responsiblePersonArray
            });
          }
      }).catch(error => {
        
      })
    }
    
  }
  changeForm = () => {
    this.setState({showContactForm: !this.state.showContactForm, 
      editProjectResult: {content: "", status: null}});
  }

  fetchContactDateByOtherClient = e => {
    const index = this.state.responsiblePersons.findIndex(i => {
      return i.firstName === e.target.value
    });
    const responsiblePersonArray = [...this.state.responsiblePersonArray];
    responsiblePersonArray[0].value = this.state.responsiblePersons[index].email;
    responsiblePersonArray[1].value = this.state.responsiblePersons[index].firstName;
    responsiblePersonArray[2].value = this.state.responsiblePersons[index].lastName;
    responsiblePersonArray[3].value = this.state.responsiblePersons[index].phoneNumber;

    this.setState({responsiblePersonArray: responsiblePersonArray,
      selected: this.state.responsiblePersons[index].firstName});
  }
  render() {
    const editable = this.props.editable;
    const { t } = this.props;
    const { editProjectStatus } = this.props;
    const { editProjectErrors } = this.props;
    return (
      <div className="project-details-block">
        <header>
          <h3>{t("EditProjectData")}</h3>
        </header>

        {this.state.showContactForm ?
          <Form btnTitle="Prześlij"
          key={1}
          shouldSubmit={true}
          onSubmit={this.handleSubmit}
          formItems={this.state.responsiblePersonArray} 
          formTitle="Dane kontaktowe do klienta"
          isLoading={this.state.isLoading}
          submitResult={{
            status: editProjectStatus,
            content: editProjectStatus ? "Pomyślnie dokonano edycji projektu" : 
              editProjectErrors[0]
          }}>

              <button onClick={this.changeForm} 
                type="button" className="come-back-btn">
                  Cofnij
              </button>
              {this.state.responsiblePersons && 
              this.state.responsiblePersons.length > 0 ? 
              <ContactList 
              selected={this.state.selected}
              onChange={e => this.fetchContactDateByOtherClient(e)} 
              items={this.state.responsiblePersons} 
              /> 
               
              : null}
          </Form>
          
          : 
          
          <Form 
          key={2}
          dateIndexesToCompare={[3,4]}
          onSubmit={this.changeForm}
          shouldSubmit={false}
          btnTitle="Dalej"
          isLoading={this.state.isLoading}
          endDate={this.props.estimatedEndDate}
          formItems={this.state.editProjectArray} 
          clientsWhichMatch={this.state.clientsWhichMatch}
          onChangeClient={event => this.onChangeClient(event)}
          onBlur={this.goForClient}
          />
        }
        
        
      </div>
    );
  }
}
export default translate("ProjectDetailsBlock")(ProjectDetailsBlock);
