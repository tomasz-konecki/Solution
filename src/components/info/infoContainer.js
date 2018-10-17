import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AllRoles from "./AllRoles/AllRoles";
import YourPermissions from "./YourPermissions/YourPermissions";

class Info extends React.PureComponent {
  state = {};
  render() {
    console.log(this.props);
    return (
      <div className="content-container info-container">
        <YourPermissions />
        <AllRoles />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.authReducer
  };
}

Info.propTypes = {
  auth: PropTypes.object
};

export default connect(mapStateToProps)(Info);
