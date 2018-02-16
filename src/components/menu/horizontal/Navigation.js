import React from "react";
import Logo from "../../common/Logo";
import Icon from "../../common/Icon";

const Navigation = props => (
  <nav className="top-nav right">
    <button className="nav-compact"><Icon iconType="fas" icon="sign-out-alt"/>Wyloguj</button>
  </nav>
);

export default Navigation;
