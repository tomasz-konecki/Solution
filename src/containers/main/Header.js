import React from "react";
import Logo from "../../components/common/Logo";
import TopBar from "./TopBar";

const Header = () => {
  return (
    <div className="header">
      <Logo size="vector_cut" title/>
      <TopBar />
    </div>
  );
};

export default Header;
