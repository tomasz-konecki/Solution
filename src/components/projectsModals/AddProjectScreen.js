import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "../../scss/components/projectsModals/AddProjectScreen.scss";
import "react-datepicker/dist/react-datepicker.css";
import LoaderHorizontal from "../../components/common/LoaderHorizontal";
import DCMTWebApi from "../../api";
import ResultBlock from "./../common/ResultBlock";
import ResponsiblePersonBlock from "./ResponsiblePersonBlock";

class AddProjectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      client: "",
      responsiblePerson: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
      },
      startDate: moment(),
      estimatedEndDate: moment(),
      createdBy: "tkonecki",
      isActive: true,
      isLoading: false,
      errorBlock: null
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
    const a = this.state.startDate;
    const b = date;
    let estimatedEndDate = moment();

    a.diff(b) > 0
      ? (estimatedEndDate = this.state.startDate)
      : (estimatedEndDate = date);

    this.setState({
      estimatedEndDate
    });
  };

  getResponse = newProject => {
    DCMTWebApi.addProject(newProject)
      .then(response => {
        this.props.projectActions.loadProjects(
          this.props.currentPage,
          this.props.limit
        );
        this.setState({
          errorBlock: { response },
          isLoading: false
        });
        setTimeout(() => {
          this.props.closeModal();
        }, 500);
      })
      .catch(errorBlock => {
        this.setState({
          errorBlock,
          isLoading: false
        });
      });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      isLoading: true
    });

    const newProject = this.state;
    this.getResponse(newProject);
  };

  setResponsiblePerson = person => {
    this.setState({
      responsiblePerson: {
        ...this.state.responsiblePerson,
        ...person
      }
    });
  };

  render() {
    return (
      <div className="add-project-screen">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label htmlFor="projectName" className="col-sm-3 col-form-label">
              Nazwa projektu:
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                name="name"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="description" className="col-sm-3 col-form-label">
              Opis:
            </label>
            <div className="col-sm-9">
              <textarea
                rows="5"
                cols="30"
                className="form-control"
                name="description"
                maxLength="1500"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="client" className="col-sm-3 col-form-label">
              Klient:
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                name="client"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              htmlFor="responsiblePerson"
              className="col-sm-3 col-form-label"
            >
              Osoba do kontaktu:
            </label>

            <div className="col-sm-9">
              <ResponsiblePersonBlock
                setResponsiblePerson={this.setResponsiblePerson}
                respPerson={this.state.responsiblePerson}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="startDate" className="col-sm-3 col-form-label">
              Data rozpoczęcia:
            </label>
            <div className="col-sm-9">
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

          <div className="form-group row">
            <label htmlFor="endDate" className="col-sm-3 col-form-label">
              Data zakończenia:
            </label>
            <div className="col-sm-9">
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

          <div className="loading-bar-container">
            {this.state.isLoading === true && <LoaderHorizontal />}
          </div>

          <div className="form-group row">
            <div className="col-sm-9 result-block">
              <ResultBlock
                errorBlock={this.state.errorBlock}
                errorOnly={false}
                successMessage="Projekt dodano pomyślnie"
              />
            </div>
            <div className="project-submit-container col-sm-3">
              <button className="project-submit-button dcmt-button">
                Dodaj
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default AddProjectScreen;
