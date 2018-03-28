import React, { Component } from "react";
import Detail from "../common/Detail";
import ResultBlock from "./../common/ResultBlock";
import DatePicker from "react-datepicker";
import moment from "moment";
import "../../scss/components/projectsModals/ProjectDetailsBlock.scss";
import "react-datepicker/dist/react-datepicker.css";
import ResponsiblePersonBlock from "./ResponsiblePersonBlock";
const emptyField = "<brak>";
const active = "Aktywny";
const inActive = "Nieaktywny";

class ProjectDetailsBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      name: "",
      client: "",
      description: "",
      responsiblePerson: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
      },
      createdBy: "tkonecki",
      startDate: moment(),
      estimatedEndDate: moment(),
      validStyles: {
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
      }
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  setResponsiblePerson = event => {
    let person = {
      [event.target.name]: event.target.value
    };

    this.setState({
      responsiblePerson: {
        ...this.state.responsiblePerson,
        ...person
      }
    });
  };

  handleStartDate = date => {
    this.setState({
      startDate: date
    });
  };

  handleEndDate = date => {
    const a = this.state.startDate;
    const b = date;
    let estimatedEndDate = moment();

    a.diff(b) > 0
      ? (estimatedEndDate = this.state.estimatedEndDate)
      : (estimatedEndDate = date);

    this.setState({
      estimatedEndDate
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const project = Object.assign(
      {},
      this.state,
      { startDate: moment.utc(this.state.startDate) },
      { estimatedEndDate: moment.utc(this.state.estimatedEndDate) }
    );

    this.props.editProject(project);
  };

  validate = e => {
    const patterns = {
      name: /^[0-9a-z\s\-]+$/i,
      client: /(.*?)/,
      firstName: /^[a-z]+$/i,
      lastName: /^[a-z]+$/i,
      email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
      phoneNumber: /^\d{9,11}$/
    };

    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    let styles = "";
    let object = {};

    !patterns[fieldName].test(fieldValue)
      ? (styles = "invalid")
      : (styles = "");

    object[fieldName] = styles;

    // console.log(object);

    this.setState({
      validStyles: object
    });
  };

  componentDidMount() {
    const {
      id,
      name,
      client,
      description,
      responsiblePerson,
      startDate,
      estimatedEndDate
    } = this.props.project;

    this.setState({
      id,
      name,
      client,
      description,
      responsiblePerson,
      startDate: moment(startDate),
      estimatedEndDate: moment(estimatedEndDate)
    });
  }

  render() {
    const editable = this.props.editable;
    const {
      name,
      description,
      client,
      responsiblePerson,
      startDate,
      estimatedEndDate,
      validStyles
    } = this.state;

    return (
      <div className="project-details-block">
        <header>
          <h3>Edycja danych projektu</h3>
        </header>
        <div className="project-details-container">
          <form onSubmit={this.handleSubmit}>
            <Detail
              type="text"
              editable={editable}
              name="name"
              pretty="Nazwa projektu"
              reuired
              value={name}
              handleChange={e => {
                this.handleChange(e);
                this.validate(e);
              }}
            />
            <p
              className={["project-name", this.state.validStyles.name].join(
                " "
              )}
            >
              Nazwa projektu nie może zawierać znaków specjalnych.
            </p>

            <Detail
              type="textarea"
              editable={editable}
              name="description"
              pretty="Opis"
              reuired
              rows={3}
              cols={30}
              value={description}
              handleChange={e => {
                this.handleChange(e);
                this.validate(e);
              }}
            />

            <Detail
              type="text"
              editable={editable}
              name="client"
              pretty="Klient"
              reuired
              value={client}
              handleChange={e => {
                this.handleChange(e);
                this.validate(e);
              }}
            />
            <div className="form-group row">
              <label
                htmlFor="responsiblePerson"
                className="col-sm-3 col-form-label"
              >
                Osoba do kontaktu:
              </label>

              <ResponsiblePersonBlock
                responsiblePerson={responsiblePerson}
                setResponsiblePerson={this.setResponsiblePerson}
                styles={validStyles}
                validate={this.validate}
                handleChange={e => {
                  this.setResponsiblePerson(e);
                  this.validate(e);
                }}
              />
            </div>

            <div className="form-group row">
              <label className="col-sm-3 col-form-label">
                Data rozpoczęcia:
              </label>
              <div className="date-picker col-sm-9">
                <DatePicker
                  selected={startDate}
                  selectsStart
                  startDate={startDate}
                  endDate={estimatedEndDate}
                  onChange={this.handleStartDate}
                  locale="pl"
                  dateFormat="DD/MM/YYYY"
                  todayButton={"Dzisiaj"}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="endDate" className="col-sm-3 col-form-label">
                Data zakończenia:
              </label>
              <div className="date-picker col-sm-9">
                <DatePicker
                  selected={estimatedEndDate}
                  selectsEnd
                  startDate={startDate}
                  endDate={estimatedEndDate}
                  onChange={this.handleEndDate}
                  locale="pl"
                  dateFormat="DD/MM/YYYY"
                  todayButton={"Dzisiaj"}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>
            </div>

            <div className="edit-project-button-container">
              <button className="dcmt-button">Potwierdź</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ProjectDetailsBlock;
