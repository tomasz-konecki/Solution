import React, { Component } from 'react';
import { connect } from 'react-redux';

class LoggedInUser extends Component {
  render() {
    return (
      <span className="logged-in-user">Zalogowany: <strong>{this.props.user}</strong></span>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.extra
  };
};

export default connect(mapStateToProps)(LoggedInUser);
