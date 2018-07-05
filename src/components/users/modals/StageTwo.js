import React, { Component } from "react";
import "../../../scss/components/users/modals/StageTwo.scss";
import FoundUsersTable from "../FoundUsersTable";
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
      this.props.doAddUser(this.state);
    }
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
                type="modalInParent"
                errorBlock={this.props.errorBlock}
                errorOnly={false}
                successMessage={t("UserAddedSuccessfully")}
              />
            </div>
            <div className="submit-button-container">
              {
                this.state.roles[0] !== undefined ?
                <button
                  className="dcmt-button"
                  type="submit"
                  onClick={this.handleSubmit}
                >
                  {t("Add")}
                </button>
                : null
              }
            </div>
          </div>
        </div>

        <div className="stage-two-loader-container">
          {this.props.isLoading === true && <LoaderHorizontal />}
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
