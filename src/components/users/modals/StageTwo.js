import React, { Component } from "react";
import "../../../scss/components/users/modals/StageTwo.scss";
import FoundUsersTable from "../FoundUsersTable";
import DCMTWebApi from "../../../api";
import UserDetailsBlock from "./UserDetailsBlock";
import UserRoleAssigner from "./UserRoleAssigner";
import LoaderHorizontal from "../../../components/common/LoaderHorizontal";
import ResultBlock from "../../common/ResultBlock";
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

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
      alert(this.props.t("AddRoles"));
    } else {
      this.setState({ isLoading: true });
      this.props.doAddUser(this.state);
    }
  };

  stopLoading = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { t } = this.props;
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
                {t("Back")}
              </button>
            </div>
            <div>
              <ResultBlock
                errorBlock={this.props.errorBlock}
                errorOnly={false}
                successMessage={t("UserAddedSuccessfully")}
              />
            </div>
            <div className="submit-button-container">
              <button
                className="dcmt-button"
                type="submit"
                onClick={this.handleSubmit}
              >
                {t("Add")}
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

StageTwo.propTypes = {
  selectedUser: PropTypes.object.isRequired,
  resetState: PropTypes.func.isRequired,
  doAddUser: PropTypes.func.isRequired,
  errorBlock: PropTypes.object
};

export default translate("StageTwo")(StageTwo);
