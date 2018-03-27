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
      responsiblePerson: {},
      createdBy: "tkonecki",
      startDate: moment(),
      estimatedEndDate: moment()
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

  componentDidMount() {
    console.log("ProjectDetailsBlock:");
    console.table(this.props.project);
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
    return (
      <div className="project-details-block">
        <header>
          <h3>Edycja danych projektu</h3>
        </header>
        <div className="project-details-container">
          <form onSubmit={this.handleSubmit}>
            <Detail
              type="text"
              editable={this.props.editable}
              name="name"
              pretty="Nazwa projektu"
              reuired
              value={this.state.name}
              handleChange={this.handleChange}
            />

            <Detail
              type="textarea"
              editable={this.props.editable}
              name="description"
              pretty="Opis"
              reuired
              rows={3}
              cols={30}
              value={this.state.description}
              handleChange={this.handleChange}
            />

            <Detail
              type="text"
              editable={this.props.editable}
              name="client"
              pretty="Klient"
              reuired
              value={this.state.client}
              handleChange={this.handleChange}
            />
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">
                Osoba do kontaktu:
              </label>

              <ResponsiblePersonBlock
                responsiblePerson={this.state.responsiblePerson}
                setResponsiblePerson={this.setResponsiblePerson}
              />
            </div>

            <div className="date-picker-container form-group row">
              <label className="col-sm-3 col-form-label">
                Data rozpoczęcia:
              </label>
              <div className="date-picker col-sm-9">
                <DatePicker
                  selected={this.state.startDate}
                  selectsStart
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
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

            <div className="date-picker-container form-group row">
              <label className="col-sm-3 col-form-label">
                Data zakończenia:
              </label>
              <div className="date-picker col-sm-9">
                <DatePicker
                  selected={this.state.estimatedEndDate}
                  selectsEnd
                  startDate={this.state.startDate}
                  endDate={this.state.estimatedEndDate}
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

            <div className="edit-project-button-container form-group row">
              {/* <div className="col-sm-3 result-block">
                <ResultBlock
                  errorBlock={this.state.errorBlock}
                  errorOnly={false}
                  successMessage="Projekt edytowano pomyślnie"
                />
              </div> */}
              <div className="col-sm-3 edit-button-container">
                <button className="dcmt-button">Potwierdź</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ProjectDetailsBlock;
