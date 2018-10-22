import React, { Component } from "react";
import UserDetailsBlock from "./UserDetailsBlock";
import UserRoleAssigner from "./UserRoleAssigner";
import LoaderHorizontal from "./../../common/LoaderHorizontal";
import ResultBlock from "./../../common/ResultBlock";
import PropTypes from "prop-types";
import { translate } from "react-translate";
import WebApi from "api/index";

class EditUserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      responseBlock: {},
      disabledButton: false,
      addedNewUser: false
    };
  }
  changeUserRoles = () => {
    const { id, roles } = this.props.user;
    this.setState(
      {
        loading: true,
        disabledButton: !this.props.disabledButton
      },
      () => {
        WebApi.users.patch
          .roles(id, roles)
          .then(response => {
            this.props.pageChange(this.props.currentPage, this.props.settings),
              this.setState({
                responseBlock: response,
                loading: false
              });
            setTimeout(() => {
              this.props.closeModal();
            }, 1500);
          })
          .catch(error => {
            if (
              "userNotFoundError" in
              error.replyBlock.data.errorObjects[0].errors
            ) {
              WebApi.users.post
                .add(id, roles)
                .then(response => {
                  this.setState({
                    responseBlock: response,
                    addedNewUser: true,
                    loading: false
                  });

                  setTimeout(() => {
                    this.props.closeModal({ afterClose: "reloadList" });
                  }, 1500);
                })
                .catch(errorResponse => {
                  this.setState({
                    responseBlock: errorResponse,
                    loading: false
                  });
                });
            } else {
              this.setState({
                responseBlock: error,
                loading: false
              });
            }
          });
      }
    );
  };

  render() {
    const { t } = this.props;
    return (
      <div className="stage-two-container">
        <div className="form-container">
          <UserDetailsBlock editable={false} user={this.props.user} />
          <UserRoleAssigner
            roles={
              this.props.user.roles !== undefined ? this.props.user.roles : []
            }
            handleRoleChange={this.props.handleRoleChange}
          />
          <div className="edit-user-button-container">
            {this.props.user.roles !== undefined ? (
              this.props.user.roles[0] !== undefined ? (
                <button
                  className="dcmt-button"
                  onClick={this.changeUserRoles}
                  disabled={this.state.disabledButton}
                >
                  {t("Confirm")}
                </button>
              ) : null
            ) : null}
          </div>
          <div className="edit-user-result-modal">
            <ResultBlock
              type="modalInParent"
              errorOnly={false}
              successMessage={this.state.addedNewUser ? t("UserSuccesfullyAdded") : t("RolesSuccessfullyEdited")}
              errorBlock={this.state.responseBlock}
            />
          </div>
          <div>{this.state.loading && <LoaderHorizontal />}</div>
        </div>
      </div>
    );
  }
}

EditUserDetails.propTypes = {
  user: PropTypes.object.isRequired,
  handleCloseModal: PropTypes.func,
  handleRoleChange: PropTypes.func.isRequired,
  responseBlock: PropTypes.object,
  loading: PropTypes.bool,
  pageChange: PropTypes.func
};

export default translate("EditUserDetails")(EditUserDetails);
