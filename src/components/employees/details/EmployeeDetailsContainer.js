import React from "react";
import "./EmployeeDetailsContainer.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import * as asyncActions from "../../../actions/asyncActions";
import EmployeeContent from "./employeeContent/employeeContent";
import EmployeeTable from "./employeeTable/employeeTable";
import {
  getEmployeePromise,
  loadCertificates,
  deleteCertificate,
  addCertificate,
  editCertificate,
  editStatistics,
  deleteEmployee,
  activateEmployee,
  reactivateEmployee,
  loadAssignmentsACreator,
  loadAssignments,
  deleteQuaterACreator,
  reactivateQuaterACreator,
  changeEmployeeSkillsACreator,
  updateSkype,
  getCertificates
} from "../../../actions/employeesActions";
import Spinner from "../../common/spinner/spinner";
import OperationStatusPrompt from "../../form/operationStatusPrompt/operationStatusPrompt";
import EmployeeSkills from "./employeeSkills/employeeSkills";
import EmployeeCertificates from "./employeeCertificates/employeeCertificates";
import { ACTION_CONFIRMED } from "./../../../constants";
import { translate } from "react-translate";
import NotFound404 from "../../notFound404/NotFound404";

class EmployeeDetailsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingFirstTimeEmployee: true,
      isChangingEmployeeData: false,
      editSkypeFormItems: [
        {
          title: "SkypeId",
          type: "text",
          placeholder: this.props.t("InsertSkypeId"),
          mode: "text",
          value: "",
          error: "",
          inputType: null,
          minLength: 3,
          maxLength: 20,
          canBeNull: false
        }
      ]
    };
  }

  componentDidMount() {
    const { getEmployeePromise, loadCertificates, match } = this.props;
    getEmployeePromise(match.params.id);
    loadCertificates(match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.validatePropsForAction(nextProps, "deleteCertificate")) {
      this.props.async.setActionConfirmationProgress(true);
      this.props.deleteCertificate(this.props.toConfirm.certificate.id, this.props.match.params.id);
    }

    if (nextProps.employeeErrors !== this.props.employeeErrors) {
      this.setState({
        isLoadingFirstTimeEmployee: false,
        isChangingEmployeeData: false
      });
    } else if (nextProps.employeeOperationStatus === false) {
      this.setState({ isChangingEmployeeData: false });
    } /*
        else if(nextProps.match !== this.props.match)
        {
            console.log("nextProps.match : " + nextProps.match)
            this.setState({isLoadingFirstTimeEmployee: true});
            this.props.getEmployeePromise(nextProps.match.params.id);
        }*/
    if (nextProps.employee) {
      if (
        nextProps.employee.skypeId &&
        !this.state.editSkypeFormItems[0].value
      ) {
        let form = this.state.editSkypeFormItems;
        form[0].value = nextProps.employee.skypeId;
        this.setState({
          editSkypeFormItems: form
        });
      }
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

  editCapacity = capacity => {
    const { employee, editStatistics } = this.props;
    editStatistics(employee.id, employee.seniority, capacity, employee.clouds);
  };
  activateEmployee = () => {
    const { employee, activateEmployee } = this.props;
    this.setState({ isChangingEmployeeData: true });
    activateEmployee(employee.id, "Junior", 0.3);
  };
  reactivateEmployee = () => {
    this.setState({ isChangingEmployeeData: true });
    const { employee, reactivateEmployee } = this.props;
    reactivateEmployee(employee.id);
  };
  deleteEmployee = () => {
    this.setState({ isChangingEmployeeData: true });
    const { employee, deleteEmployee } = this.props;
    deleteEmployee(employee.id);
  };

  editSeniority = seniority => {
    const { employee, editStatistics } = this.props;
    editStatistics(
      employee.id,
      seniority,
      employee.baseCapacity,
      employee.clouds
    );
  };

  deleteCertificate = (certificate, message, successMessage) => {
    this.props.async.setActionConfirmation(true, {
      key: "deleteCertificate",
      string: `${message} : ${certificate.name}`,
      certificate,
      successMessage: successMessage
    });
  };

  editSkypeId = () => {
    const { employee, updateSkype } = this.props;
    const { value } = this.state.editSkypeFormItems[0];
    updateSkype(value, employee.id);
  };

  render() {
    const {
      isLoadingFirstTimeEmployee,
      isChangingEmployeeData,
      editSkypeFormItems
    } = this.state;
    const {
      employeeStatus,
      employeeErrors,
      employee,
      employeeOperationStatus,
      employeeOperationErrors,
      employeeResultMessage,
      reactivateQuaterMessage,
      loadAssignmentsStatus,
      loadAssignmentsErrors,
      loadedAssignments,
      deleteQuaterStatus,
      deleteQuaterErrors,
      deleteQuaterACreator,
      reactivateQuaterACreator,
      reactivateQuaterStatus,
      reactivateQuaterErrors,
      changeEmployeeSkillsACreator,
      changeSkillsStatus,
      changeSkillsErrors,
      t,
      updateSkypeIdResult,
      certificates
    } = this.props;

    return (
      <div className="employee-details-container">
        {isLoadingFirstTimeEmployee ? (
          <Spinner />
        ) : !employeeStatus ? (
          <NotFound404 type={"MissingEmployee"} />
        ) : (
          employeeStatus && (
            <React.Fragment>
              <h1>{t("EmployeeDetails")}</h1>

              <EmployeeContent
                status={status}
                reactivateQuaterACreator={reactivateQuaterACreator}
                reactivateQuaterStatus={reactivateQuaterStatus}
                reactivateQuaterErrors={reactivateQuaterErrors}
                deleteQuaterStatus={deleteQuaterStatus}
                deleteQuaterErrors={deleteQuaterErrors}
                deleteQuaterACreator={deleteQuaterACreator}
                employee={employee}
                editCapacity={this.editCapacity}
                deleteEmployee={this.deleteEmployee}
                editSeniority={this.editSeniority}
                employeeErrors={employeeErrors}
                activateEmployee={this.activateEmployee}
                isChangingEmployeeData={isChangingEmployeeData}
                reactivateEmployee={this.reactivateEmployee}
                editSkypeFormItems={editSkypeFormItems}
                editSkypeId={this.editSkypeId}
                t={t}
                skypeIdAddLoading={updateSkypeIdResult && updateSkypeIdResult.loading}
                updateSkypeIdResult={updateSkypeIdResult && updateSkypeIdResult.resultBlock}
              />

              <EmployeeSkills
                employeeHasAccount={employee.seniority}
                employeeDeleted={employee.isDeleted}
                changeSkillsStatus={changeSkillsStatus}
                employeeId={employee.id}
                changeSkillsErrors={changeSkillsErrors}
                changeEmployeeSkillsACreator={changeEmployeeSkillsACreator}
                skills={employee.skills}
                limit={5}
              />

              <EmployeeTable
                employeeStatus={employeeStatus}
                loadAssignmentsClear={this.props.loadAssignmentsClear}
                loadAssignmentsACreator={() =>
                  this.props.loadAssignmentsACreator(employee.id)
                }
                loadAssignmentsStatus={loadAssignmentsStatus}
                loadAssignmentsErrors={loadAssignmentsErrors}
                loadedAssignments={loadedAssignments}
                tableTitle={t("ActiveProjects")}
              />

              <EmployeeCertificates
                certificates={certificates}
                loadCertificatesStatus={this.props.loadCertificatesStatus}
                loadCertificatesErrors={this.props.loadCertificatesErrors}
                loadCertificates={this.props.loadCertificates}
                addCertificate={this.props.addCertificate}
                editCertificate={this.props.editCertificate}
                deleteCertificate={this.deleteCertificate}
                userId={this.props.match.params.id}
                resultBlockAddCertificate={this.props.resultBlockAddCertificate}
              />
            </React.Fragment>
          )
        )}

        {employeeStatus === false && (
          <NotFound404 type={"MissingEmployee"} />
          // <OperationStatusPrompt
          //   operationPromptContent={employeeErrors[0]}
          //   operationPrompt={false}
          // />
        )}

        {employeeOperationStatus !== null &&
          employeeOperationStatus !== undefined && (
            <OperationStatusPrompt
              operationPromptContent={
                employeeOperationStatus
                  ? employeeResultMessage
                  : employeeOperationErrors[0]
              }
              operationPrompt={employeeOperationStatus}
            />
          )}

        {reactivateQuaterStatus !== null &&
          reactivateQuaterStatus !== undefined && (
            <OperationStatusPrompt
              operationPromptContent={
                reactivateQuaterStatus
                  ? t("QuarterTalkHasBeenActiaved")
                  : reactivateQuaterErrors[0]
              }
              operationPrompt={reactivateQuaterStatus}
            />
          )}

        {changeSkillsStatus === false && (
          <OperationStatusPrompt
            operationPromptContent={changeSkillsErrors[0]}
            operationPrompt={changeSkillsStatus}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    employeeStatus: state.employeesReducer.employeeStatus,
    employeeErrors: state.employeesReducer.employeeErrors,
    employee: state.employeesReducer.employee,

    employeeOperationStatus: state.employeesReducer.employeeOperationStatus,
    employeeOperationErrors: state.employeesReducer.employeeOperationErrors,
    employeeResultMessage: state.employeesReducer.employeeResultMessage,

    loadAssignmentsStatus: state.employeesReducer.loadAssignmentsStatus,
    loadAssignmentsErrors: state.employeesReducer.loadAssignmentsErrors,
    loadedAssignments: state.employeesReducer.loadedAssignments,

    loadCertificatesStatus: state.employeesReducer.loadCertificatesStatus,
    loadCertificatesErrors: state.employeesReducer.loadCertificatesErrors,
    certificates: state.employeesReducer.certificates,
    resultBlockAddCertificate: state.employeesReducer.resultBlockAddCertificate,

    deleteQuaterStatus: state.employeesReducer.deleteQuaterStatus,
    deleteQuaterErrors: state.employeesReducer.deleteQuaterErrors,

    reactivateQuaterStatus: state.employeesReducer.reactivateQuaterStatus,
    reactivateQuaterErrors: state.employeesReducer.reactivateQuaterErrors,
    reactivateQuaterMessage: state.employeesReducer.reactivateQuaterMessage,

    changeSkillsStatus: state.employeesReducer.changeSkillsStatus,
    changeSkillsErrors: state.employeesReducer.changeSkillsErrors,

    updateSkypeIdResult: state.employeesReducer.updateSkypeIdResult,

    resultBlock: state.employeesReducer.resultBlock,
    confirmed: state.asyncReducer.confirmed,
    toConfirm: state.asyncReducer.toConfirm,
    isWorking: state.asyncReducer.isWorking,
    type: state.asyncReducer.type,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    async: bindActionCreators(asyncActions, dispatch),
    getEmployeePromise: employeeId => dispatch(getEmployeePromise(employeeId)),
    editStatistics: (employeeId, seniority, capacity, currentClouds) =>
      dispatch(editStatistics(employeeId, seniority, capacity, currentClouds)),
    deleteEmployee: employeeId => dispatch(deleteEmployee(employeeId)),
    activateEmployee: (employeeId, seniority, capacity) =>
      dispatch(activateEmployee(employeeId, seniority, capacity)),
    reactivateEmployee: employeeId => dispatch(reactivateEmployee(employeeId)),
    loadAssignmentsACreator: employeeId =>
      dispatch(loadAssignmentsACreator(employeeId)),
    loadAssignmentsClear: (status, errors, assignments) =>
      dispatch(loadAssignments(status, errors, assignments)),
    deleteQuaterACreator: (quarterId, employeeId) =>
      dispatch(deleteQuaterACreator(quarterId, employeeId)),
    reactivateQuaterACreator: (quaterId, employeeId, message) =>
      dispatch(reactivateQuaterACreator(quaterId, employeeId, message)),
    changeEmployeeSkillsACreator: (employeeId, currentArray) =>
      dispatch(changeEmployeeSkillsACreator(employeeId, currentArray)),
    updateSkype: (skypeId, employeeId) =>
      dispatch(updateSkype(skypeId, employeeId)),
    loadCertificates: employeeId => dispatch(loadCertificates(employeeId)),
    addCertificate: (certificate,userId) => dispatch(addCertificate(certificate,userId)),
    editCertificate: (certificateId, certificate, userId) => dispatch(editCertificate(certificateId,certificate,userId)),
    deleteCertificate: (certificateId, userId) => dispatch(deleteCertificate(certificateId, userId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("EmployeeDetails")(EmployeeDetailsContainer));
