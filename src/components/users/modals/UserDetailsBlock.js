import React, { Component } from "react";
import Detail from "../../common/Detail";

const emptyField = "<brak>";

class UserDetailsBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false
    };
  }

  parseRoles = () => {
    return this.props.user.roles.length !== 0
      ? this.props.user.roles.join(", ")
      : emptyField;
  };

  parsePhoneNumber = () => {
    return this.props.user.phoneNumber !== null
      ? this.props.user.phoneNumber
      : emptyField;
  };

  render() {
    return (
      <div>
        <header>
          <h3>Edycja danych użytkownika</h3>
        </header>
        <div className="user-details-container">
          <Detail
            type="text"
            editable={this.props.editable}
            pretty="Imię"
            required
            value={this.props.user.firstName}
          />

          <Detail
            type="text"
            editable={this.props.editable}
            pretty="Nazwisko"
            required
            value={this.props.user.lastName}
          />

          <Detail
            type="text"
            editable={this.props.editable}
            pretty="Email"
            required
            value={this.props.user.email}
          />

          <Detail
            type="text"
            editable={this.props.editable}
            pretty="Telefon"
            required
            value={this.parsePhoneNumber()}
          />

          <Detail
            type="text"
            editable={false}
            pretty="Role"
            value={this.parseRoles()}
          />
        </div>
      </div>
    );
  }
}

export default UserDetailsBlock;
