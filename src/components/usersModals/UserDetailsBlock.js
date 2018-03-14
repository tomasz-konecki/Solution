import React, { Component } from "react";
const emptyField = "<brak>";

class UserDetailsBlock extends Component {
  constructor(props) {
    super(props);
  }

  parseRoles = () => {
    return this.props.user.roles.length !== 0
      ? this.props.user.roles.join(", ")
      : emptyField;
  };

  parsePhoneNumber = () => {
    return this.props.user.phoneNumber.length !== 0
      ? this.props.user.phoneNumber
      : emptyField;
  };

  render() {
    return (
      <div className="user-details-container">
        <form>
          <div className="detail-container">
            <label>Imię:</label>
            {this.props.editable ? (
              <input
                type="text"
                placeholder={this.props.user.firstName}
                required
              />
            ) : (
              <span>{this.props.user.firstName}</span>
            )}
          </div>
          <div className="detail-container">
            <label>Nazwisko:</label>
            {this.props.editable ? (
              <input
                type="text"
                placeholder={this.props.user.lastName}
                required
              />
            ) : (
              <span>{this.props.user.lastName}</span>
            )}
          </div>
          <div className="detail-container">
            <label>Email:</label>
            {this.props.editable ? (
              <input type="text" placeholder={this.props.user.email} required />
            ) : (
              <span>{this.props.user.email}</span>
            )}
          </div>
          <div className="detail-container">
            <label>Telefon</label>
            {this.props.editable ? (
              <input
                type="text"
                placeholder={this.props.user.phoneNumber}
                required
              />
            ) : (
              <span>{this.props.user.phoneNumber}</span>
            )}
          </div>
          <div className="detail-container">
            <label>Role:</label>
            <span>{this.parseRoles()}</span>
          </div>
        </form>
      </div>
    );
  }
}

export default UserDetailsBlock;
