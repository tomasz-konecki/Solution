import React, { Component } from "react";
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
      startDate: moment(),
      estimatedEndDate: moment(),
      btnDisabled: false,
      btnInactiveStyle: "",
      validStyles: {
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
      },
      fieldsValid: {
        nameValid: true,
        firstNameValid: true,
        lastNameValid: true,
        emailValid: true,
        phoneNumberValid: true
      }
    };
  }

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
    const editable = this.props.editable;
    const {
      name,
      description,
      client,
      responsiblePerson,
      startDate,
      estimatedEndDate,
      validStyles,
      btnDisabled,
      btnInactiveStyle
    } = this.state;

    const { t } = this.props;

    return (
      <div className="project-details-block">
        <header>
          <h3>{t("EditProjectData")}</h3>
        </header>
        <div className="project-details-container">
          <form onSubmit={this.handleSubmit}>
            <Detail
              type="text"
              editable={editable}
              name="name"
              pretty={t("ProjectName")}
              reuired
              value={name}
              handleChange={e => {
                this.handleChange(e);
                this.validate(e);
              }}
            />
            <p className={["project-name", validStyles.name].join(" ")}>
              {t("CannotContainSpecial")}
            </p>

            <Detail
              type="textarea"
              editable={editable}
              name="description"
              pretty={t("Description")}
              reuired
              rows={3}
              cols={30}
              value={description}
              handleChange={e => {
                this.handleChange(e);
              }}
            />

            <Detail
              type="text"
              editable={editable}
              name="client"
              pretty={t("Client")}
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
                {t("ContactPerson")}:
              </label>

              <ResponsiblePersonBlock
                responsiblePerson={this.state.responsiblePerson}
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
                {t("StartDate")}:
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
                {t("EndDate")}:
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
                  todayButton={t("Today")}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>
            </div>

            <div className="edit-project-button-container">
              <button
                disabled={btnDisabled}
                className={["dcmt-button", btnInactiveStyle].join(" ")}
              >
                {t("Confirm")}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

ProjectDetailsBlock.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    client: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    responsiblePerson: PropTypes.object.isRequired,
    startDate: PropTypes.string.isRequired,
    estimatedEndDate: PropTypes.string.isRequired,
  }),
  editable: PropTypes.bool,
  editProject: PropTypes.func.isRequired
};

export default translate("ProjectDetailsBlock")(ProjectDetailsBlock);
