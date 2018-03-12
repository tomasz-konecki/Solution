import React from "react";
import Icon from "../../../components/common/Icon";
import LoggedInUser from "../../../components/LoggedInUser";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout as logoutAction } from '../../../actions/authActions';

const TopBar = (props) => {
  const logout = () => {
    props.dispatch(logoutAction());
  };
  return (
    <div className="top-bar">
      <LoggedInUser/>
      <button className="nav-compact" onClick={logout}>
        <span>Wyloguj</span>
        <Icon iconType="fas" icon="sign-out-alt"/>
      </button>
    </div>
  );
};

TopBar.propTypes = {
  dispatch: PropTypes.func
};

export default connect()(TopBar);
