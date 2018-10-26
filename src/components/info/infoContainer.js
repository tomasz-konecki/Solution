import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { translate } from "react-translate";

import AllRoles from "./AllRoles/AllRoles";
import YourPermissions from "./YourPermissions/YourPermissions";
import SpecyficFunctions from "./SpecyficFunctions/SpecyficFunctions";

import "./infoContainer.scss";

class Info extends React.PureComponent {
  state = {
    theHighestRole: ""
  };

  componentDidMount = () => {
    const { roles } = this.props.auth;

    this.setState({ theHighestRole: this.returnTheHighestRole(roles) });
  };

  returnTheHighestRole = roles => {
    if (roles.includes("Administrator")) {
      return "Administrator";
    } else if (roles.includes("Manager")) {
      return "Manager";
    } else if (roles.includes("Team Leader")) {
      return "Team Leader";
    } else if (roles.includes("Tradesman")) {
      return "Tradesman";
    } else if (roles.includes("Human Resources")) {
      return "Human Resources";
    } else if (roles.includes("Developer")) {
      return "Developer";
    } else {
      return this.props.t("RoleError");
    }
  };

  render() {
    const { theHighestRole } = this.state;
    const { t } = this.props;
    return (
      <div className="content-container" id="info-container">
        <YourPermissions role={theHighestRole} t={t} />
        <div className="info-content">
          <AllRoles t={t} />
          <SpecyficFunctions t={t} />
        </div>
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
  auth: PropTypes.object,
  t: PropTypes.func
};

export default connect(mapStateToProps)(translate("Info")(Info));
