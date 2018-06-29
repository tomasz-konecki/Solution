import React, { Component } from "react";
import Detail from "../../common/Detail";
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

const emptyField = "<brak>";

class UserDetailsBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false
    };
  }

  parseRoles = () => {
    return this.props.user.roles !==  undefined ? this.props.user.roles.length !== 0
      ? this.props.user.roles.join(", ")
      : emptyField : null;
  };

  parsePhoneNumber = () => {
    return this.props.user.phoneNumber !== null
      ? this.props.user.phoneNumber
      : emptyField;
  };

  render() {
    const { t } = this.props;
    let rolesDetails = this.props.user.roles !== undefined ? (
      <Detail
        type="text"
        editable={false}
        pretty={t("Roles")}
        value={this.parseRoles()}
       />
    ): null;
    
    return (
      <div>
        <header>
          <h3>{t("EditUsersData")}</h3>
        </header>
        <div className="user-details-container">
          <Detail
            type="text"
            editable={this.props.editable}
            pretty={t("Name")}
            required
            value={this.props.user.firstName}
          />

          <Detail
            type="text"
            editable={this.props.editable}
            pretty={t("Surname")}
            required
            value={this.props.user.lastName}
          />

          <Detail
            type="text"
            editable={this.props.editable}
            pretty={t("Email")}
            required
            value={this.props.user.email}
          />

          <Detail
            type="text"
            editable={this.props.editable}
            pretty={t("Phone")}
            required
            value={this.parsePhoneNumber()}
          />

          {rolesDetails}
        </div>
      </div>
    );
  }
}

UserDetailsBlock.propTypes = {
  user: PropTypes.object.isRequired,
  editable: PropTypes.bool
};

export default translate("UserDetailsBlock")(UserDetailsBlock);
