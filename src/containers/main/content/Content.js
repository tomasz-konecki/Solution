import React from "react";
import { Route, Link, withRouter } from "react-router-dom";
import LeftMenu from "../menu/LeftMenu";
import PropTypes from "prop-types";
import UsersContainer from "./containers/UsersContainer";
import ProjectsContainer from "./containers/ProjectsContainer";
import Employees from "./views/Employees";
import Assign from "./views/Assign";

class Content extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { match } = this.props;
    return (
      <div className="content">
        <Route path={match.url + "/users"} component={UsersContainer} />
        <Route path={match.url + "/employees"} component={Employees} />
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
