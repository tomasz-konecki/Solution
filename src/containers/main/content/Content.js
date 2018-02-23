import React from "react";
import { Route, Link, withRouter } from "react-router-dom";
import LeftMenu from "../menu/LeftMenu";
import Users from "./views/Users";
import Employees from "./views/Employees";
import Projects from "./views/Projects";
import Assign from "./views/Assign";

const Content = props => {
  const { match } = props;

  return (
    <div className="content">
      <aside className="left">
        <LeftMenu />
      </aside>
      <aside className="right">
        <Route path={match.url + "/users"} render={Users} />
        <Route path={match.url + "/employees"} render={Employees} />
        <Route path={match.url + "/projects"} render={Projects} />
        <Route path={match.url + "/assign"} render={Assign} />
      </aside>
    </div>
  );
};

export default withRouter(Content);
