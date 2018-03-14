import React, { Component } from "react";
import "../../scss/components/usersModals/StageTwo.scss";
import FoundUsersTable from "../users/FoundUsersTable";
import DCMTWebApi from "../../api";
import UserDetailsBlock from "./UserDetailsBlock";
import UserRoleAssigner from "./UserRoleAssigner";
import LoaderHorizontal from "../../components/common/LoaderHorizontal";

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

  handleBack = () => {
    this.props.resetState();
  };

  handleError = error => {
    let errorMessage = "Coś poszło nie tak";
    if (error.response.data.errorOccured === true) {
      const { errors } = error.response.data;
      errorMessage = errors[Object.keys(errors)[0]];
    }
    this.setState({
      result: errorMessage,
      resultColor: "failure",
      isLoading: false
    });
  };

  getResponse = newUser => {
    DCMTWebApi.addUser(newUser.id, newUser.roles)
      .then(response => {
        if (response.status === 201) {
          this.setState({
            result: "Użytkownik dodany pomyślnie",
            resultColor: "success",
            isLoading: false
          });
        }
      })
      .catch(error => {
        this.handleError(error);
      });
  };

  handleRoleChange = roles => {
    this.setState({ roles });
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.roles.length === 0) {
      alert("Dodaj role!");
    } else {
      this.setState({ isLoading: true });
      const newUser = this.state;
      console.table(newUser);
      this.getResponse(newUser);
    }
  };

  render() {
    return (
      <div className="stage-two-container">
        <div className="form-container">
          <UserDetailsBlock
            parseRoles={this.parseRoles}
            user={this.state}
            editable={false}
          />
          <UserRoleAssigner
            roles={this.state.roles}
            resetState={this.props.resetState}
            handleRoleChange={this.handleRoleChange}
          />
          <div className="form-navigation">
            <div className="button-back-container">
              <button onClick={this.handleBack}>Back</button>
            </div>
            <div
              className={["add-user-result", this.state.resultColor].join(" ")}
            >
              {this.state.result}
            </div>
            <div className="submit-button-container">
              <button type="submit" onClick={this.handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="stage-two-loader-container">
          {this.state.isLoading === true && <LoaderHorizontal />}
        </div>
      </div>
    );
  }
}

export default StageTwo;
