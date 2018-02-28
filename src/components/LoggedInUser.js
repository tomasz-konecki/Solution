import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class LoggedInUser extends Component {
  render() {
    return (
      <span className="logged-in-user">
        Zalogowany: <strong>{this.props.user}</strong>
      </span>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.authReducer.extra
  };
};

LoggedInUser.propTypes = {
  user: PropTypes.string
};

export default connect(mapStateToProps)(LoggedInUser);
