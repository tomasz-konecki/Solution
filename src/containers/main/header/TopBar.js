import React from "react";
import Icon from "../../../components/common/Icon";
import LoggedInUser from "../../../components/LoggedInUser";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout as logoutAction } from "../../../actions/authActions";
import { translate } from 'react-translate';

const TopBar = ({ t, dispatch }) => {
  const logout = () => {
    dispatch(logoutAction());
  };
  return (
    <div className="top-bar">
      <LoggedInUser />
      <button className="dcmt-button nav-compact" onClick={logout}>
        <span>{t("Logout")}</span>
        <Icon iconType="fas" icon="sign-out-alt" />
      </button>
    </div>
  );
};

TopBar.propTypes = {
  dispatch: PropTypes.func
};

export default connect()(translate("TopBar")(TopBar));
