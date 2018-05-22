import React, { Component } from "react";
import CheckBox from "../../common/CheckBox";
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

class UserRoleAssigner extends Component {
  constructor(props) {
    super(props);
  }

  handleSelectRole = event => {
    const itemExists =
      this.props.roles.findIndex(item => item === event.target.value) !== -1;

    const roles = itemExists
      ? this.props.roles.filter(item => item !== event.target.value)
      : [...this.props.roles, event.target.value];
    this.props.handleRoleChange(roles);
  };

  render() {
    const { t } = this.props;
    return (
      <div className="roles-container">
        <CheckBox
          type="checkbox"
          name="role"
          value={t("Developer")}
          onChange={this.handleSelectRole}
          checked={this.props.roles.indexOf("Developer") !== -1}
        />

        <CheckBox
          type="checkbox"
          name="role"
          value={t("TeamLeader")}
          onChange={this.handleSelectRole}
          checked={this.props.roles.indexOf("Team Leader") !== -1}
        />

        <CheckBox
          type="checkbox"
          name="role"
          value={t("HumanResources")}
          onChange={this.handleSelectRole}
          checked={this.props.roles.indexOf("Human Resources") !== -1}
        />

        <CheckBox
          type="checkbox"
          name="role"
          value={t("Tradesman")}
          onChange={this.handleSelectRole}
          checked={this.props.roles.indexOf("Tradesman") !== -1}
        />

        <CheckBox
          type="checkbox"
          name="role"
          value={t("Administrator")}
          onChange={this.handleSelectRole}
          checked={this.props.roles.indexOf("Administrator") !== -1}
        />
      </div>
    );
  }
}

UserRoleAssigner.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleRoleChange: PropTypes.func.isRequired
};

export default translate("UserRoleAssigner")(UserRoleAssigner);
