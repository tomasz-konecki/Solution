import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as employeesActions from "../../actions/employeesActions";
import * as asyncActions from "../../actions/asyncActions";

import "../../scss/containers/UsersContainer.scss";
import { ACTION_CONFIRMED } from "./../../constants";
import DCMTWebApi from "../../api/";

class EmployeesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      limit: 15
    };
  }

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

  componentDidMount() {
    this.pageChange(this.state.currentPage);
  }

  render() {
    return (
      <div>
        <h2>Employees Container</h2>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    employees: state.employeesReducer.employees,
    totalPageCount: state.usersReducer.totalPageCount,
    loading: state.asyncReducer.loading,
    confirmed: state.asyncReducer.confirmed,
    toConfirm: state.asyncReducer.toConfirm,
    isWorking: state.asyncReducer.isWorking,
    type: state.asyncReducer.type
  };
}

function mapDispatchToProps(dispatch) {
  return {
    employeeActions: bindActionCreators(employeesActions, dispatch),
    async: bindActionCreators(asyncActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesContainer);
