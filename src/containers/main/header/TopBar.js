import React from "react";
import Navigation from "../../../containers/main/header/nav/Navigation";
import Icon from "../../../components/common/Icon";

const TopBar = (props) => {
  return (
    <div className="top-bar">
      <button className="nav-compact" onClick={props.logout}><span>Wyloguj</span><Icon iconType="fas" icon="sign-out-alt"/></button>
    </div>
  );
};

export default TopBar;
