import React from "react";
import { Route, Link, withRouter } from "react-router-dom";
import LeftMenu from "../menu/LeftMenu";
import UsersContainer from "./containers/UsersContainer";
import Employees from "./views/Employees";
import Projects from "./views/Projects";
import Assign from "./views/Assign";

class Content extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { match } = this.props;
    return (
      <div className="content">
        <LeftMenu className="left-menu" extended={false} />
        <aside className="right">
          <Route path={match.url + "/users"} component={UsersContainer} />
          <Route path={match.url + "/employees"} component={Employees} />
          <Route path={match.url + "/projects"} component={Projects} />
          <Route path={match.url + "/assign"} component={Assign} />
        </aside>
      </div>
    );
  }
}

export default withRouter(Content);
