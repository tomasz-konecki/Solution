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
        {this.props.editable ? (
          <form>
            <div className="detail-container">
              <label>Imię:</label>
              <input
                type="text"
                placeholder={this.props.user.firstName}
                required
              />
            </div>
            <div className="detail-container">
              <label>Nazwisko:</label>
              <input
                type="text"
                placeholder={this.props.user.lastName}
                required
              />
            </div>
            <div className="detail-container">
              <label>Email:</label>
              <input type="text" placeholder={this.props.user.email} required />
            </div>
            <div className="detail-container">
              <label>Telefon</label>
              <input
                type="text"
                placeholder={this.props.user.phoneNumber}
                required
              />
            </div>
            <div className="detail-container">
              <label>Role:</label>
              <span>{this.parseRoles()}</span>
            </div>
          </form>
        ) : (
          <div>
            <div className="detail-container">
              <label>Imię:</label>
              <span>{this.props.user.firstName}</span>
            </div>
            <div className="detail-container">
              <label>Nazwisko:</label>
              <span>{this.props.user.lastName}</span>
            </div>
            <div className="detail-container">
              <label>Email:</label>
              <span>{this.props.user.email}</span>
            </div>
            <div className="detail-container">
              <label>Telefon:</label>
              <span>{this.parsePhoneNumber()}</span>
            </div>
            <div className="detail-container">
              <label>Role:</label>
              <span>{this.parseRoles()}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserDetailsBlock;
