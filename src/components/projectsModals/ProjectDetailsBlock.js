import React, { Component } from "react";
import Detail from "../common/Detail";
import ResultBlock from "./../common/ResultBlock";
import DatePicker from "react-datepicker";
import moment from "moment";
import "../../scss/components/projectsModals/ProjectDetailsBlock.scss";
import "react-datepicker/dist/react-datepicker.css";
const emptyField = "<brak>";
const active = "Aktywny";
const inActive = "Nieaktywny";

class ProjectDetailsBlock extends Component {
  constructor(props) {
    super(props);

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

    this.state = {
      id,
      name,
      client,
      description,
      responsiblePerson,
      createdBy: "tkonecki",
      startDate: moment(startDate),
      estimatedEndDate: moment(estimatedEndDate)
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleStartDate = date => {
    this.setState({
      startDate: date
    });
  };

  handleEndDate = date => {
    this.setState({
      estimatedEndDate: date
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
    console.log("NEW PROJECT:", project);
    this.props.editProject(project);
  };

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

            <Detail
              type="number"
              editable={this.props.editable}
              name="responsiblePerson"
              pretty="Osoba do kontaktu"
              reuired
              value={this.state.responsiblePerson || 1}
              handleChange={this.handleChange}
            />
            <div className="date-picker-container form-group row">
              <label className="col-sm-3 col-form-label">
                Data rozpoczęcia:
              </label>
              <div className="date-picker col-sm-9">
                <DatePicker
                  selected={this.state.startDate}
                  onChange={this.handleStartDate}
                  locale="pl"
                  key="start"
                  dateFormat="DD/MM/YYYY"
                  todayButton={"Dzisiaj"}
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
                  onChange={this.handleEndDate}
                  locale="pl"
                  key="end"
                  dateFormat="DD/MM/YYYY"
                  todayButton={"Dzisiaj"}
                />
              </div>
            </div>

            <div className="edit-project-button-container">
              <button className="">Potwierdź</button>
              <div className="col-sm-9 result-block">
                <ResultBlock
                  errorBlock={this.state.errorBlock}
                  errorOnly={false}
                  successMessage="Projekt edytowano pomyślnie"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ProjectDetailsBlock;
