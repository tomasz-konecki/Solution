import React, { Component } from "react";
import "../../scss/components/usersModals/StageTwo.scss";
import FoundUsersTable from "../users/FoundUsersTable";
import LoaderHorizontal from "../../components/common/LoaderHorizontal";
import DCMTWebApi from "../../api";

class StageTwo extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      id: "",
      roles: [],
      isLoading: false,
      result: "",
      resultColor: "green"
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

  handleStatus = status => {
    status === 201
      ? this.setState({ result: "Użytkownik dodany pomyślnie" })
      : this.setState({ result: "Coś poszło nie tak...", resultColor: "red" });
  };

  getResponse = newUser => {
    DCMTWebApi.addUser(newUser.id, newUser.roles)
      .then(response => {
        this.handleStatus(response.status);
      })
      .then(() => {
        this.setState({
          isLoading: false
        });
      })
      .catch(error => {
        throw error;
      });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    if (this.state.roles.length === 0) {
      alert("Dodaj role!");
    } else {
      const newUser = this.state;
      console.table(newUser);
      this.getResponse(newUser);
    }
  };

  parseRoles = () => {
    return this.state.roles.length !== 0
      ? this.state.roles.join(", ")
      : "<brak>";
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
            <span>{this.parseRoles()}</span>
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
              <div className="button-back-container">
                <button onClick={this.handleBack}>Back</button>
              </div>
              <div
                className={["add-user-result", this.state.resultColor].join(
                  " "
                )}
              >
                {this.state.result}
              </div>
              <div className="submit-button-container">
                <button type="submit">Submit</button>
              </div>
            </div>
          </form>
        </div>
        <div className="stage-two-loader-container">
          {this.state.isLoading === true && <LoaderHorizontal />}
        </div>
      </div>
    );
  }
}

export default StageTwo;
