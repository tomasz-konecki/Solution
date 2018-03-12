import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class LoggedInUser extends Component {
  render() {
    return (
      <span className="logged-in-user">
        Zalogowany: <strong>{this.props.firstName + " " + this.props.lastName}</strong>
      </span>
    );
  }
}

const mapStateToProps = state => {
  return {
    firstName: state.authReducer.firstName,
    lastName: state.authReducer.lastName
  };
};

LoggedInUser.propTypes = {
  user: PropTypes.string
};

export default connect(mapStateToProps)(LoggedInUser);
