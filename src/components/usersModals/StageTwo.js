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
      role: "teamLeader"
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleBack() {
    this.props.resetState();
  }

  handleChange(field, event) {
    let object = {};
    object[field] = event.target.value;
    this.setState(object);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
  }

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
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              disabled
              type="text"
              value={this.state.firstName}
              onChange={event => this.handleChange("firstName", event)}
            />
          </label>
          <label>
            Last name:
            <input
              disabled
              type="text"
              value={this.state.lastName}
              onChange={event => this.handleChange("lastName", event)}
            />
          </label>
          <label>
            Email:
            <input
              disabled
              type="text"
              value={this.state.email}
              onChange={event => this.handleChange("email", event)}
            />
          </label>
          <label>
            Phone number
            <input
              disabled
              type="text"
              value={this.state.phoneNumber}
              onChange={event => this.handleChange("phoneNumber", event)}
            />
          </label>
          <hr />

          <select
            value={this.state.role}
            onChange={event => this.handleChange("role", event)}
          >
            <option>teamLeader</option>
            <option>developer</option>
            <option>HR</option>
            <option>administrator</option>
          </select>

          <input type="submit" value="Submit" />
        </form>

        <div className="button-back-container">
          <button onClick={this.handleBack}>Back</button>
        </div>
      </div>
    );
  }
}

export default StageTwo;
