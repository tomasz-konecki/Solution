import React from "react";
import Logo from "../../../components/common/Logo";
import TopBar from "./TopBar";

const Header = (props) => {
  return (
    <div className="header">
      <Logo size="vector_cut" title/>
      <TopBar logout={props.logout} />
    </div>
  );
};

export default Header;
