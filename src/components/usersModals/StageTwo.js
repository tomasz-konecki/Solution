import React, { Component } from "react";
import "../../scss/components/usersModals/StageTwo.scss";
import FoundUsersTable from "../users/FoundUsersTable";

class StageTwo extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      id: "",
      roles: []
    };
  }

  handleBack = () => {
    this.props.resetState();
  };

  handleSelectRole = event => {
    const itemExists =
      this.state.roles.findIndex(item => item === event.target.value) !== -1;

    const roles = itemExists
      ? this.state.roles.filter(item => item !== event.target.value)
      : [...this.state.roles, event.target.value];

    this.setState({
      roles
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state);
  };

  componentDidMount() {
    let {
      firstName,
      lastName,
      id,
      email,
      phoneNumber,
      role
    } = this.props.selectedUser;

    if (phoneNumber === null) {
      phoneNumber = "";
    }

    this.setState({
      firstName,
      lastName,
      email,
      phoneNumber,
      id
    });
  }

  render() {
    return (
      <div className="stage-two-container">
        <div className="user-details-container">
          <div className="first-name-container">
            <label>Imię:</label>
            <span>{this.state.firstName}</span>
          </div>
          <div className="last-name-container">
            <label>Nazwisko:</label>
            <span>{this.state.lastName}</span>
          </div>
          <div className="email-container">
            <label>Email:</label>
            <span>{this.state.email}</span>
          </div>
          <div className="phone-container">
            <label>Telefon:</label>
            <span>{this.state.phoneNumber}</span>
          </div>
          <div className="role-container">
            <label>Role:</label>
            <span>{`${this.state.roles}`}</span>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            <div className="">
              <input
                type="checkbox"
                name="role"
                value="programista"
                onChange={this.handleSelectRole}
              />
              <span>Programista</span>
            </div>
            <div className="">
              <input
                type="checkbox"
                name="role"
                value="team leader"
                onChange={this.handleSelectRole}
              />
              <span>Team leader</span>
            </div>
            <div className="">
              <input
                type="checkbox"
                name="role"
                value="HR"
                onChange={this.handleSelectRole}
              />
              <span>HR</span>
            </div>
            <div className="">
              <input
                type="checkbox"
                name="role"
                value="admnistrator"
                onChange={this.handleSelectRole}
              />
              <span>Administrator</span>
            </div>
            <div className="submit-button-container">
              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>

        <div className="button-back-container">
          <button onClick={this.handleBack}>Back</button>
        </div>
      </div>
    );
  }
}

export default StageTwo;
