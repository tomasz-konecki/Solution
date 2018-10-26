import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as employeesActions from "../../actions/employeesActions";
import * as asyncActions from "../../actions/asyncActions";
import "../../scss/containers/UsersContainer.scss";
import { ACTION_CONFIRMED } from "./../../constants";
import EmployeesList from "./EmployeesList";
import EmployeeDetailsContainer from "./details/EmployeeDetailsContainer";
import { withRouter, Switch, Route } from "react-router-dom";
import { getUserCVACreator, getUserCv } from "../../actions/reportsActions";
import OperationLoader from "../common/operationLoader/operationLoader";
import NotFound404 from "../notFound404/NotFound404";

class EmployeesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      limit: 15,
      init: false,
      settings: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.validatePropsForAction(nextProps, "activateEmployee")) {
      this.props.async.setActionConfirmationProgress(true);
      this.props.employeeActions.activateEmployeeOnList(
        this.props.toConfirm.employee.id,
        "Junior",
        0.3,
        () => this.pageChange(this.state.currentPage, this.state.settings),
        this.props.async.setActionConfirmationResult
      );
    }
    if (this.validatePropsForAction(nextProps, "reActivateEmployee")) {
      this.props.async.setActionConfirmationProgress(true);
      this.props.employeeActions.reActivateEmployeeOnList(
        this.props.toConfirm.employee.id,
        () => this.pageChange(this.state.currentPage, this.state.settings),
        this.props.async.setActionConfirmationResult
      );
    }
    if (this.validatePropsForAction(nextProps, "deleteEmployeeOnList")) {
      this.props.async.setActionConfirmationProgress(true);
      this.props.employeeActions.deleteEmployeeOnList(
        this.props.toConfirm.employee.id,
        () => this.pageChange(this.state.currentPage, this.state.settings),
        this.props.async.setActionConfirmationResult
      );
    }
  }

  getSettings = settings => {
    this.setState({
      settings: settings
    });
  };

  validatePropsForAction(nextProps, action) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === action
    );
  }

  componentDidUpdate() {
    if (this.props.userDownloadCVLink && this.props.getUserCVStatus) {
      window.location.href = this.props.userDownloadCVLink;
      this.props.getUserCVClear("", null, []);
    }
  }

  getCV = (format, userId) => {
    this.props.getUserCV(format, userId);
  };

  activateEmployee = (employee, t) => {
    this.props.async.setActionConfirmation(true, {
      key: employee.isDeleted ? "reActivateEmployee" : "activateEmployee",
      string: `${t("ActivateEmployeeInfinitive")} ${employee.firstName} ${
        employee.lastName
      }`,
      employee,
      successMessage: t("EmployeeHasBeenActivated")
    });
  };

  removeEmployee = (employee, t) => {
    this.props.async.setActionConfirmation(true, {
      key: "deleteEmployeeOnList",
      string: `${t("DeleteEmployeeInfinitive")} ${employee.firstName} ${
        employee.lastName
      }`,
      employee,
      successMessage: t("EmployeeHasBeenDeleted")
    });
  };

  pageChange = (page, other) => {
    this.setState(
      {
        currentPage: page
      },
      () =>
        this.props.employeeActions.loadEmployees(
          this.state.currentPage,
          this.state.limit,
          other
        )
    );
  };

  pullEmployeesList = () => {
    if (!this.state.init) {
      this.setState(
        {
          init: true
        },
        this.pageChange(this.state.currentPage)
      );
    }

    return (
      <React.Fragment>
        {this.props.getUserCVStatus === false && (
          <OperationLoader
            operationError={this.props.getUserCVErrors[0]}
            close={() => this.props.getUserCVClear("", null, [])}
          />
        )}
        <EmployeesList
          getSettings={this.getSettings}
          employees={this.props.employees}
          currentPage={this.state.currentPage}
          totalPageCount={this.props.totalPageCount}
          pageChange={this.pageChange}
          loading={this.props.loading}
          resultBlock={this.props.resultBlock}
          getCV={this.getCV}
          activateEmployee={this.activateEmployee}
          removeEmployee={this.removeEmployee}
        />
      </React.Fragment>
    );
  };

  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={match.url + ""} component={this.pullEmployeesList} />
        <Route path={match.url + "/:id"} component={EmployeeDetailsContainer} />
      </Switch>
    );
  }
}

function mapStateToProps(state) {
  return {
    employees: state.employeesReducer.employees,
    totalPageCount: state.employeesReducer.totalPageCount,
    loading: state.asyncReducer.loading,
    confirmed: state.asyncReducer.confirmed,
    toConfirm: state.asyncReducer.toConfirm,
    isWorking: state.asyncReducer.isWorking,
    type: state.asyncReducer.type,
    resultBlock: state.employeesReducer.resultBlock,
    userDownloadCVLink: state.reportsReducer.userDownloadCVLink,
    getUserCVStatus: state.reportsReducer.getUserCVStatus,
    getUserCVErrors: state.reportsReducer.getUserCVErrors
  };
}

function mapDispatchToProps(dispatch) {
  return {
    employeeActions: bindActionCreators(employeesActions, dispatch),
    async: bindActionCreators(asyncActions, dispatch),
    getUserCV: (format, id) =>
      dispatch(employeesActions.downloadCV(format, id)),
    getUserCVClear: (link, status, errors) =>
      dispatch(getUserCv(link, status, errors))
  };
}

EmployeesContainer.propTypes = {
  employeeActions: PropTypes.object,
  totalPageCount: PropTypes.number,
  loading: PropTypes.bool,
  employees: PropTypes.array,
  userDownloadCVLink: PropTypes.string,
  getUserCVStatus: PropTypes.bool,
  getUserCVErrors: PropTypes.array,
  getUserCV: PropTypes.func,
  getUserCVClear: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EmployeesContainer));
