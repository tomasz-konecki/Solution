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
          <div className="detail-container">
            <label>Imię:</label>
            <span>{this.state.firstName}</span>
          </div>
          <div className="detail-container">
            <label>Nazwisko:</label>
            <span>{this.state.lastName}</span>
          </div>
          <div className="detail-container">
            <label>Email:</label>
            <span>{this.state.email}</span>
          </div>
          <div className="detail-container">
            <label>Telefon:</label>
            <span>{this.state.phoneNumber}</span>
          </div>
          <div className="detail-container">
            <label>Role:</label>
            <span>{this.state.roles.join(", ")}</span>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            <div className="">
              <input
                type="checkbox"
                name="role"
                value="Developer"
                onChange={this.handleSelectRole}
              />
              <span>Programista</span>
            </div>
            <div className="">
              <input
                type="checkbox"
                name="role"
                value="Team Leader"
                onChange={this.handleSelectRole}
              />
              <span>Team leader</span>
            </div>
            <div className="">
              <input
                type="checkbox"
                name="role"
                value="Human Resources"
                onChange={this.handleSelectRole}
              />
              <span>Human Resources</span>
            </div>
            <div className="">
              <input
                type="checkbox"
                name="role"
                value="Tradesman"
                onChange={this.handleSelectRole}
              />
              <span>Handlowiec</span>
            </div>
            <div className="">
              <input
                type="checkbox"
                name="role"
                value="Administrator"
                onChange={this.handleSelectRole}
              />
              <span>Administrator</span>
            </div>

            <div className="form-navigation">
              <div className="submit-button-container">
                <button type="submit">Submit</button>
              </div>
              <div className="button-back-container">
                <button onClick={this.handleBack}>Back</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default StageTwo;
