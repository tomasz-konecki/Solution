import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "../../../scss/components/projects/modals/AddProjectScreen.scss";
import "react-datepicker/dist/react-datepicker.css";
import LoaderHorizontal from "../../../components/common/LoaderHorizontal";
import DCMTWebApi from "../../../api";
import ResultBlock from "./../../common/ResultBlock";
import ResponsiblePersonBlock from "./ResponsiblePersonBlock";
import constraints from "../../../constraints";

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
      isLoading: false,
      errorBlock: null,
      btnDisabled: true,
      btnInactiveStyle: "project-button-inactive",
      validStyles: {
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
      },
      fieldsValid: {
        nameValid: false,
        firstNameValid: false,
        emailValid: false,
        phoneNumberValid: false
      }
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

  handleAddProject = newProject => {
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

  createNewProject = () => {
    const {
      name,
      description,
      client,
      responsiblePerson,
      startDate,
      estimatedEndDate
    } = this.state;

    return {
      name,
      description,
      client,
      responsiblePerson,
      startDate,
      estimatedEndDate
    };
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      isLoading: true
    });

    this.handleAddProject(this.createNewProject());
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

  checkAllFields = (fieldName, test) => {
    let field = fieldName + "Valid";
    let object = {};

    object[field] = test;

    let fieldsValid = Object.assign({}, this.state.fieldsValid, object);

    this.setState(
      {
        fieldsValid
      },
      () => {
        this.validateForm();
      }
    );
  };

  validateForm = () => {
    const {
      nameValid,
      firstNameValid,
      lastNameValid,
      emailValid,
      phoneNumberValid
    } = this.state.fieldsValid;

    if (
      nameValid &&
      firstNameValid &&
      lastNameValid &&
      emailValid &&
      phoneNumberValid
    ) {
      this.setState({
        btnDisabled: false,
        btnInactiveStyle: ""
      });
    } else {
      this.setState({
        btnDisabled: true,
        btnInactiveStyle: "project-button-inactive"
      });
    }
  };

  validate = e => {
    const patterns = constraints.projetctFormPattern;
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    let styles = "";
    let object = {};
    let test = patterns[fieldName].test(fieldValue);

    test ? (styles = "") : (styles = "invalid");

    object[fieldName] = styles;

    this.setState(
      {
        validStyles: object
      },
      this.checkAllFields(fieldName, test)
    );
  };

  render() {
    const {
      responsiblePerson,
      validStyles,
      startDate,
      estimatedEndDate,
      errorBlock,
      isLoading,
      btnDisabled,
      btnInactiveStyle
    } = this.state;

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
                onChange={e => {
                  this.handleChange(e);
                  this.validate(e);
                }}
              />
              <p className={validStyles.name}>
                Nazwa projektu nie może zawierać znaków specjalnych.
              </p>
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
                onChange={e => {
                  this.handleChange(e);
                  this.validate(e);
                }}
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

            <ResponsiblePersonBlock
              setResponsiblePerson={this.setResponsiblePerson}
              responsiblePerson={responsiblePerson}
              validate={this.validate}
              styles={validStyles}
              handleChange={e => {
                this.setResponsiblePerson(e);
                this.validate(e);
              }}
            />
          </div>

          <div className="form-group row">
            <label htmlFor="startDate" className="col-sm-3 col-form-label">
              Data rozpoczęcia:
            </label>
            <div className="col-sm-9">
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
            <div className="col-sm-9">
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

          <div className="loading-bar-container">
            {isLoading === true && <LoaderHorizontal />}
          </div>

          <div className="form-group row">
            <div className="col-sm-9 result-block">
              <ResultBlock
                errorBlock={errorBlock}
                errorOnly={false}
                successMessage="Projekt dodano pomyślnie"
              />
            </div>
            <div className="project-submit-container col-sm-3">
              <button
                disabled={btnDisabled}
                className={["dcmt-button", btnInactiveStyle].join(" ")}
              >
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
