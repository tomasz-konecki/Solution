import React from 'react'
import './employeeCertificates.scss';
import '../../../../scss/components/employees/certificates/modals/EmployeeAddCertificate.scss';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import moment from "moment";
import ResultBlock from "./../../../common/ResultBlock";
import { translate } from 'react-translate';
import { CSSTransitionGroup } from "react-transition-group";
import Button from "../../../common/button/button";
import { validateInput } from "../../../../services/validation";
import SmallSpinner from "../../../common/spinner/small-spinner";
import IntermediateBlock from "../../../common/IntermediateBlock";


class EmployeeAddCertificate extends React.Component{
    state = {
        name: "",
        description: "",
        certificateId: null,
        errorBlock: null,
        inputValue: {
            name: "",
            description: ""
          },
        inputError: {
            name: "",
            description: ""
          },
        date: moment(),
        isLoading: false,
        isFormValid: false,
        editing: false,
        modified: false
    }

    componentDidMount = () => {
        const { certificate } = this.props;
        if (this.props.certificate) {
          this.setState({
            isFormValid: true,
            editing: true,
            certificateId: certificate.id,
            inputValue: {
              name: certificate.name,
              description: certificate.description ? certificate.description : ""
            },
            date: moment(certificate.date)
          });
        }
      };

    handleChange = e => {
        e.preventDefault();
        let value = e.target.value;
        let { inputError, inputValue } = this.state;

        let error =
        e.target.name === "name"
            ? validateInput(value, false, 3, 50, "nameWithPolishLetters", this.props.t("Name"))
            : e.target.name === "description"
            ? validateInput(
                value,
                true,
                3,
                1500,
                "name",
                this.props.t("Description")
                )
            : null;

        let errorItem = error ? <span key={[e.target.name]}>{error}</span> : null;
        this.setState(
        {
            inputValue: { ...inputValue, [e.target.name]: value },
            inputError: {
            ...inputError,
            [e.target.name]: errorItem
            },
            isFormValid: false
        },
        () => this.makeFormValid()
        );
      };

    makeFormValid = () => {
        const { inputError, inputValue } = this.state;
        inputValue.name !== "" &&
        !inputError.name &&
        !inputError.description
          ? this.setState({
              isFormValid: true
            })
          : null;
      };

    createNewCertificate = () => {
        const date = this.state.date;
        const name = this.state.inputValue.name;
        const description = this.state.inputValue.description;
        const employeeId = this.props.userId;

        return {
          name,
          description,
          date,
          employeeId
        };
      };

    handleSubmit = event => {
        event.preventDefault();
        this.setState({
          isLoading: true,
          isFormValid: false
        });

        {this.state.editing
            ?
            this.props.editCertificate(this.state.certificateId, this.createNewCertificate(), this.props.userId)
            :
            this.props.addCertificate(this.createNewCertificate(),this.props.userId)
        }

      };

    handleDate = date => {
        this.setState({
            date: date
        });
      };

    pullDom = (t, inputError) => {
        return (
            <div>
            <header>
                {this.state.editing ? <h3>{t("EditingCertificate")} : </h3> : <h3 >{t("AddingCertificate")} : </h3>}
            </header>
            <form onSubmit={this.handleSubmit}>

                <div className="form-group row">
                    <label htmlFor="projectName" className="col-sm-3 col-form-label">
                        {t("Name")}
                    </label>
                    <div className="col-sm-9">
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={this.state.inputValue.name}
                        onChange={e => {
                            this.handleChange(e);
                            }}
                    />

                        <CSSTransitionGroup
                        transitionName="error-validation"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={10}
                        >
                        <div className="error">{this.state.inputError.name &&
                            inputError.name.props.children &&
                            this.state.inputError.name}
                        </div>
                        </CSSTransitionGroup>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="projectName" className="col-sm-3 col-form-label">
                        {t("Description")}
                    </label>
                    <div className="col-sm-9">
                    <textarea
                        rows="5"
                        cols="30"
                        className="form-control"
                        name="description"
                        value={this.state.inputValue.description}
                        maxLength="1500"
                        onChange={e => {
                            this.handleChange(e);
                            }}
                    />
                    <CSSTransitionGroup
                    transitionName="error-validation"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={10}
                    >
                    <div className="error">{this.state.inputError.description &&
                        inputError.description.props.children &&
                        this.state.inputError.description}
                    </div>
                    </CSSTransitionGroup>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="startDate" className="col-sm-3 col-form-label">
                        {t("Date")}
                    </label>
                    <div className="col-sm-9">
                    <DatePicker
                        selected={this.state.date}
                        selectsStart
                        startDate={this.state.date}
                        onChange={this.handleDate}
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
                    <div className="col-sm-9 result-block">
                    {
                    <ResultBlock
                        errorBlock={this.props.resultBlockAddCertificate}
                        errorOnly={false}
                        successMessage={t("CertificateAddedSuccessfully")}
                    />
                    }
                    </div>
                    <div className="project-submit-container col-sm-3">

                    <Button
                        disable={!this.state.isFormValid}
                        mainClass={["dcmt-button"]}
                    >
                        {this.state.editing ? t("Edit") : t("Add")} {this.state.isLoading && <SmallSpinner />}
                    </Button>
                    </div>
                </div>
            </form>
            </div>
        );
    };

    render(){
        const { t, resultBlock } = this.props;
        const { isLoading, inputError } = this.state;
        let info = null;

        if (this.props.resultBlockAddCertificate) {
            //if (this.props.resultBlockAddCertificate.replyBlock && this.props.resultBlockAddCertificate.replyBlock.status === 200) {

              info = (
                <CSSTransitionGroup
                  transitionName="example"
                  transitionAppear={true}
                  transitionAppearTimeout={1000}
                  transitionEnter={false}
                  transitionLeave={false}
                >
                  {(this.props.resultBlockAddCertificate.replyBlock && this.props.resultBlockAddCertificate.replyBlock.status === 200) ?
                  <div className="certificate-modified-success">
                    <span>
                      {this.state.editing
                        ? t("CertificateEditedSuccessfully")
                        : t("CertificateAddedSuccessfully")}
                    </span>
                  </div> :
                  <div className="certificate-modified-error">
                    <span>
                      {this.props.resultBlockAddCertificate}
                    </span>
                  </div>
                  }
                </CSSTransitionGroup>
              );
            //}
            if(this.state.isLoading){
                setTimeout(() => {
                    this.props.closeModal()
                  }, 2000);

              }
          }

        return (
            <div className="add-certificate-screen">
                <IntermediateBlock
                loaded={!isLoading}
                render={() => this.pullDom(t, inputError)}
                resultBlock={this.props.resultBlockAddCertificate}
                spinner="Cube"
                />
                {info}
            </div>
        )
    }
}

export default translate("EmployeeAddCertificate")(EmployeeAddCertificate);
