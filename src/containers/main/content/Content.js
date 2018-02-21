import React from "react";
import { Route, Link, withRouter } from "react-router-dom";
import LeftMenu from "../menu/LeftMenu";
import Users from "./views/Users";

const Content = (props) => {
  const { match } = props;

  return (
    <div className="content">
      <aside className="left">
        <LeftMenu />
      </aside>
      <aside className="right">
        <Route path={match.url + '/users'} render={Users}/>
      </aside>
    </div>
  );
};

export default withRouter(Content);
