import React from "react";
import { Route, Link, withRouter } from "react-router-dom";
import LeftMenu from "./menu/LeftMenu";
import PropTypes from "prop-types";
import UsersContainer from "../../components/users/UsersContainer";
import ProjectsContainer from "../../components/projects/ProjectsContainer";
import Employees from "./content/views/Employees";
import Assign from "./content/views/Assign";
import Confirmation from "./../../components/common/modals/Confirmation";
import EmployeesContainer from "./../../components/employees/EmployeesContainer";

class Content extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { match } = this.props;
    return (
      <div className="content">
        <Confirmation />
        <Route path={match.url + "/users"} component={UsersContainer} />
        <Route path={match.url + "/employees"} component={EmployeesContainer} />
        <Route path={match.url + "/projects"} component={ProjectsContainer} />
        <Route path={match.url + "/assign"} component={Assign} />
      </div>
    );
  }
}

Content.propTypes = {
  match: PropTypes.object
};

export default withRouter(Content);
