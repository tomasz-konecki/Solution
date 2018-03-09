import React from "react";
import Icon from "../../../components/common/Icon";
import LoggedInUser from "../../../components/LoggedInUser";
import PropTypes from 'prop-types';

const TopBar = (props) => {
  return (
    <div className="top-bar">
      <LoggedInUser/>
      <button className="nav-compact" onClick={props.logout}><span>Wyloguj</span><Icon iconType="fas" icon="sign-out-alt"/></button>
    </div>
  );
};

TopBar.propTypes = {
  logout: PropTypes.func
};

export default TopBar;
