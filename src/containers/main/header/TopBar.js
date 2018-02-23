import React from "react";
import Icon from "../../../components/common/Icon";
import LoggedInUser from "../../../components/LoggedInUser";

const TopBar = (props) => {
  return (
    <div className="top-bar">
      <LoggedInUser/>
      <button className="nav-compact" onClick={props.logout}><span>Wyloguj</span><Icon iconType="fas" icon="sign-out-alt"/></button>
    </div>
  );
};

export default TopBar;
