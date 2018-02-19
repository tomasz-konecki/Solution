import React from "react";
import Logo from "../../../../components/common/Logo";
import Icon from "../../../../components/common/Icon";

const Navigation = props => (
  <nav className="top-nav right">
    <button className="nav-compact" onClick={props.logout}><Icon iconType="fas" icon="sign-out-alt"/>Wyloguj</button>
  </nav>
);

export default Navigation;
