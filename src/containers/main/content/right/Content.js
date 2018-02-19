import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LeftMenu from "../left/LeftMenu";
import { withRouter } from 'react-router';

const Content = (props) => {
  const { match } = props;
  return (
    <div className="content">
      <aside className="left">
        <LeftMenu />
      </aside>
      <aside className="right">
        ;
      </aside>
    </div>
  );
};

export default Content;
