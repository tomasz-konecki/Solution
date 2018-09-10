import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { translate } from "react-translate";
import { Link } from 'react-router-dom';
class LoggedInUser extends Component {
  render() {
    const { t, firstName, login, lastName } = this.props;
    return (
      <span className="logged-in-user">
        {t("LoggedIn") + ": "}
        <strong className="underline-anchors">
          <Link to={`/main/employees/${login}`}>{firstName + " " + lastName}</Link>
        </strong>
      </span>
    );
  }
}

const mapStateToProps = state => {
  return {
    firstName: state.authReducer.firstName,
    lastName: state.authReducer.lastName,
    login: state.authReducer.login
  };
};

LoggedInUser.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(
  translate("LoggedInUser")(LoggedInUser)
);
