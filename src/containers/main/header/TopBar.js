import React from "react";
import Navigation from "../../../containers/main/header/nav/Navigation";

const TopBar = (props) => {
  return (
    <div className="top-bar">
      <Navigation logout={props.logout} />
    </div>
  );
};

export default TopBar;
