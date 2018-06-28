import React, { Component } from "react";
import UserDetailsBlock from "./UserDetailsBlock";
import UserRoleAssigner from "./UserRoleAssigner";
import LoaderHorizontal from "./../../common/LoaderHorizontal";
import ResultBlock from "./../../common/ResultBlock";
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

class EditUserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    const { t } = this.props;
    return (
      <div className="stage-two-container">
        <div className="form-container">
          <UserDetailsBlock editable={false} user={this.props.user} /> 
          <UserRoleAssigner
            roles={this.props.user.roles !== undefined ? this.props.user.roles : []}
            handleRoleChange={this.props.handleRoleChange}
          />
          <div className="edit-user-button-container">
            {
              this.props.user.roles !== undefined ? this.props.user.roles[0] !== undefined ? <button
                className="dcmt-button"
                onClick={this.props.changeUserRoles}
              >
                {t("Confirm")}
              </button> : null : null
            }
          </div>
          <div>
            <ResultBlock
              errorOnly={false}
              successMessage={t("RolesSuccessfullyEdited")}
              errorBlock={this.props.responseBlock}
            />
          </div>

          <br />
          <div>{this.props.loading && <LoaderHorizontal />}</div>
        </div>
      </div>
    );
  }
}

EditUserDetails.propTypes = {
  user: PropTypes.object.isRequired,
  handleRoleChange: PropTypes.func.isRequired,
  changeUserRoles: PropTypes.func.isRequired,
  responseBlock: PropTypes.object,
  loading: PropTypes.bool
};

export default translate("EditUserDetails")(EditUserDetails);
