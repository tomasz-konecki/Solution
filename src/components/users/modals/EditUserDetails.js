import React, { Component } from "react";
import UserDetailsBlock from "./UserDetailsBlock";
import UserRoleAssigner from "./UserRoleAssigner";
import LoaderHorizontal from "./../../common/LoaderHorizontal";
import ResultBlock from "./../../common/ResultBlock";

class EditUserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    return (
      <div className="stage-two-container">
        <div className="form-container">
          <UserDetailsBlock editable={false} user={this.props.user} />
          <UserRoleAssigner
            roles={this.props.user.roles}
            handleRoleChange={this.props.handleRoleChange}
          />
          <div className="edit-user-button-container">
            <button
              className="dcmt-button"
              onClick={this.props.changeUserRoles}
            >
              Potwierdź
            </button>
          </div>
          <div>
            <ResultBlock
              errorOnly={false}
              successMessage="Role edytowano pomyślnie"
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

export default EditUserDetails;
