import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LeftMenu from "../menu/LeftMenu";

const Content = (props) => {
  const { match } = props;

  return (
    <div className="content">
      <aside className="left">
        <LeftMenu />
      </aside>
      <aside className="right">
        <Route path={match.url + 'users'} render={Users}/>
      </aside>
    </div>
  );
};

const Users = () => (
  <div>Users</div>
);

export default Content;
