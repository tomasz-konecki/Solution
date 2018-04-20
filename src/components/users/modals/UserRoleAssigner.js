import React, { Component } from "react";
import DCMTWebApi from "../../../api";
import CheckBox from "../../common/CheckBox";
import PropTypes from 'prop-types';

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
    return (
      <div className="roles-container">
        <CheckBox
          type="checkbox"
          name="role"
          value="Developer"
          onChange={this.handleSelectRole}
          checked={this.props.roles.indexOf("Developer") !== -1}
        />

        <CheckBox
          type="checkbox"
          name="role"
          value="Team Leader"
          onChange={this.handleSelectRole}
          checked={this.props.roles.indexOf("Team Leader") !== -1}
        />

        <CheckBox
          type="checkbox"
          name="role"
          value="Human Resources"
          onChange={this.handleSelectRole}
          checked={this.props.roles.indexOf("Human Resources") !== -1}
        />

        <CheckBox
          type="checkbox"
          name="role"
          value="Tradesman"
          onChange={this.handleSelectRole}
          checked={this.props.roles.indexOf("Tradesman") !== -1}
        />

        <CheckBox
          type="checkbox"
          name="role"
          value="Administrator"
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

export default UserRoleAssigner;
