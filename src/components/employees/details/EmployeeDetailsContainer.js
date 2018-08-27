import React from "react";
import "./EmployeeDetailsContainer.scss";
import { connect } from "react-redux";
import EmployeeContent from "./employeeContent/employeeContent";
import EmployeeTable from "./employeeTable/employeeTable";
import {
  getEmployeePromise,
  editStatistics,
  deleteEmployee,
  activateEmployee,
  reactivateEmployee,
  loadAssignmentsACreator,
  loadAssignments,
  deleteQuaterACreator,
  reactivateQuaterACreator,
  changeEmployeeSkillsACreator
} from "../../../actions/employeesActions";
import Spinner from "../../common/spinner/spinner";
import OperationStatusPrompt from "../../form/operationStatusPrompt/operationStatusPrompt";
import Button from "../../common/button/button";
import EmployeeSkills from "./employeeSkills/employeeSkills";
import { translate } from "react-translate";

class EmployeeDetailsContainer extends React.Component {
  state = {
    isLoadingFirstTimeEmployee: true,
    isChangingEmployeeData: false,
    editSkypeFormItems: [
      {
        title: "SkypeId",
        type: "text",
        placeholder: this.props.t("Insert SkypeId"),
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
  componentDidMount() {
    const { getEmployeePromise, match } = this.props;
    getEmployeePromise(match.params.id);

    // this.props.employee.skypeId ? this.props.employee.skypeId : "",
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.employeeErrors !== this.props.employeeErrors)
      this.setState({
        isLoadingFirstTimeEmployee: false,
        isChangingEmployeeData: false
      });
    else if (nextProps.employeeOperationStatus === false)
      this.setState({ isChangingEmployeeData: false });
    else if (nextProps.match !== this.props.match) {
      this.setState({ isLoadingFirstTimeEmployee: true });
      this.props.getEmployeePromise(nextProps.match.params.id);
    }
  }
  editSeniority = seniority => {
    const { employee, editStatistics } = this.props;
    editStatistics(
      employee.id,
      seniority,
      employee.baseCapacity,
      employee.clouds
    );
  };
  editCapacity = capacity => {
    const { employee, editStatistics } = this.props;
    editStatistics(employee.id, employee.seniority, capacity, employee.clouds);
  };
  editSkypeId = () => {
    const { value } = this.state.editSkypeFormItems;
    console.log(value);
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

  render() {
    console.log(this.props);
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
      t
    } = this.props;

    return (
      <div className="employee-details-container">
        {isLoadingFirstTimeEmployee ? (
          <Spinner />
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
            </React.Fragment>
          )
        )}

        {employeeStatus === false && (
          <OperationStatusPrompt
            operationPromptContent={employeeErrors[0]}
            operationPrompt={false}
          />
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

    deleteQuaterStatus: state.employeesReducer.deleteQuaterStatus,
    deleteQuaterErrors: state.employeesReducer.deleteQuaterErrors,

    reactivateQuaterStatus: state.employeesReducer.reactivateQuaterStatus,
    reactivateQuaterErrors: state.employeesReducer.reactivateQuaterErrors,
    reactivateQuaterMessage: state.employeesReducer.reactivateQuaterMessage,

    changeSkillsStatus: state.employeesReducer.changeSkillsStatus,
    changeSkillsErrors: state.employeesReducer.changeSkillsErrors
  };
};

const mapDispatchToProps = dispatch => {
  return {
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
      dispatch(changeEmployeeSkillsACreator(employeeId, currentArray))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("EmployeeDetails")(EmployeeDetailsContainer));
