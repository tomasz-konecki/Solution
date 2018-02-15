import React from "react";
import Logo from "./Logo";
import TopBar from "./TopBar";

const Header = () => {
  return (
    <div className="header">
      <Logo />
      <TopBar />
    </div>
  );
};

export default Header;
