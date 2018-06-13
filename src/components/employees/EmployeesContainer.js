import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as employeesActions from "../../actions/employeesActions";
import * as asyncActions from "../../actions/asyncActions";
import "../../scss/containers/UsersContainer.scss";
import { ACTION_CONFIRMED } from "./../../constants";
import EmployeesList from "./EmployeesList";
import EmployeeDetailContainer from "./EmployeeDetailContainer";
import { withRouter, Switch, Route } from 'react-router-dom';

class EmployeesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      limit: 15,
      init: false
    };
  }

  componentDidMount() {

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

  pullEmployeesList = () => {
    if(!this.state.init){
      this.setState({
        init: true
      }, this.pageChange(this.state.currentPage));
    }
    return <EmployeesList
      employees={this.props.employees}
      currentPage={this.state.currentPage}
      totalPageCount={this.props.totalPageCount}
      pageChange={this.pageChange}
      loading={this.props.loading}
    />;
  }

  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={match.url + ""} render={this.pullEmployeesList} />
        <Route path={match.url + "/:id"} component={EmployeeDetailContainer} />
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
    type: state.asyncReducer.type
  };
}

function mapDispatchToProps(dispatch) {
  return {
    employeeActions: bindActionCreators(employeesActions, dispatch),
    async: bindActionCreators(asyncActions, dispatch)
  };
}

EmployeesContainer.propTypes = {
  employeeActions: PropTypes.object,
  totalPageCount: PropTypes.number,
  loading: PropTypes.bool,
  employees: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EmployeesContainer));
