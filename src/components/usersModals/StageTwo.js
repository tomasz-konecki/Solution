import React, { Component } from "react";
import "../../scss/components/usersModals/StageTwo.scss";
import FoundUsersTable from "../users/FoundUsersTable";
import DCMTWebApi from "../../api";
import UserDetailsBlock from "./UserDetailsBlock";
import UserRoleAssigner from "./UserRoleAssigner";
import LoaderHorizontal from "../../components/common/LoaderHorizontal";
import ResultBlock from "../common/ResultBlock";

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
      isLoading: false
    };
  }

  componentDidMount() {
    let {
      firstName,
      lastName,
      id,
      email,
      phoneNumber,
      roles
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

  handleRoleChange = roles => {
    this.setState({ roles });
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.roles.length === 0) {
      alert("Dodaj role!");
    } else {
      this.setState({ isLoading: true });
      this.props.doAddUser(this.state);
    }
  };

  stopLoading = () => {
    this.setState({ isLoading: false });
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
              <button className="dcmt-button" onClick={this.handleBack}>
                Powrót
              </button>
            </div>
            <div>
              <ResultBlock
                errorBlock={this.props.errorBlock}
                errorOnly={false}
                successMessage={"Użytkownik dodany pomyślnie"}
              />
            </div>
            <div className="submit-button-container">
              <button
                className="dcmt-button"
                type="submit"
                onClick={this.handleSubmit}
              >
                Dodaj
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
