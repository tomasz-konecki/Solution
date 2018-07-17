import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as usersActions from "../../actions/usersActions";
import * as asyncActions from "../../actions/asyncActions";
import { getUserCVACreator, getUserCv } from "../../actions/reportsActions";
import "../../scss/containers/UsersContainer.scss";
import Modal from "react-responsive-modal";
import UserSelector from "../../components/users/modals/UserSelector";
import UsersList from "../../components/users/UsersList";
import { ACTION_CONFIRMED } from "./../../constants";
import WebApi from "../../api/";
import OperationLoader from "../common/operationLoader/operationLoader";

class UsersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      limit: 15,
      showModal: false,
      passedSettings: {}
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }

  componentDidMount() {
    this.pageChange(this.state.currentPage);
  }

  componentWillReceiveProps(nextProps) {
    if (this.validatePropsForUserDeletion(nextProps)) {
      this.props.async.setActionConfirmationProgress(true);

      WebApi.users.delete
        .user(this.props.toConfirm.id)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(
            this.state.currentPage,
            Object.assign({ isDeleted: false })
          );
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
    if (this.validatePropsForUserRequestDeletion(nextProps)) {
      this.props.async.setActionConfirmationProgress(true);
      WebApi.users.delete
        .request(this.props.toConfirm.id)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(
            this.state.currentPage,
            Object.assign({ isNotActivated: true })
          );
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
    if (this.validatePropsForUserReactivation(nextProps)) {
      this.props.async.setActionConfirmationProgress(true);

      WebApi.users.patch
        .reactivate(this.props.toConfirm.id)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(
            this.state.currentPage,
            Object.assign({ isDeleted: true })
          );
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
  }
  componentDidUpdate() {
    if (this.props.userDownloadCVLink && this.props.getUserCVStatus) {
      window.location.href = this.props.userDownloadCVLink;
      this.props.getUserCVClear("", null, []);
    }
  }
  validatePropsForUserDeletion(nextProps) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === "deleteUser"
    );
  }

  validatePropsForUserReactivation(nextProps) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === "reactivateUser"
    );
  }

  validatePropsForUserRequestDeletion(nextProps) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === "deleteUserRequest"
    );
  }

  pageChange(page, other) {
    this.setState(
      {
        currentPage: page
      },
      () =>
        this.props.userActions.loadUsers(
          this.state.currentPage,
          this.state.limit,
          other
        )
    );
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }
  getCV = userId => {
    this.props.getUserCV(userId);
  };
  render() {
    let usersList = (
      <UsersList
        show={this.props.show}
        getCV={this.getCV}
        openAddUserModal={this.handleOpenModal}
        users={this.props.users}
        currentPage={
          this.state.currentPage !== undefined ? this.state.currentPage : 1
        }
        totalPageCount={
          this.props.totalPageCount !== undefined
            ? this.props.totalPageCount
            : 1
        }
        pageChange={this.pageChange}
        loading={this.props.loading}
        resultBlock={this.props.resultBlock}
      />
    );
    return (
      <div>
        {this.props.getUserCVStatus === false && (
          <OperationLoader
            operationError={this.props.getUserCVErrors[0]}
            close={() => this.props.getUserCVClear("", null, [])}
          />
        )}
        {usersList}
        <Modal
          open={this.state.showModal}
          classNames={{ modal: "Modal Modal-users" }}
          contentLabel="Users modal"
          onClose={this.handleCloseModal}
        >
          <UserSelector closeModal={this.handleCloseModal} />
        </Modal>
      </div>
    );
  }
}

UsersContainer.propTypes = {
  users: PropTypes.array,
  async: PropTypes.object,
  toConfirm: PropTypes.object,
  userActions: PropTypes.object,
  totalPageCount: PropTypes.number,
  loading: PropTypes.bool,
  userDownloadCVLink: PropTypes.string,
  getUserCVStatus: PropTypes.bool,
  getUserCVErrors: PropTypes.array,
  getUserCV: PropTypes.func,
  getUserCVClear: PropTypes.func
};

function mapStateToProps(state) {
  return {
    users: state.usersReducer.users,
    totalPageCount: state.usersReducer.totalPageCount,
    loading: state.asyncReducer.loading,
    confirmed: state.asyncReducer.confirmed,
    toConfirm: state.asyncReducer.toConfirm,
    isWorking: state.asyncReducer.isWorking,
    type: state.asyncReducer.type,
    resultBlock: state.usersReducer.resultBlock,
    show: state.usersReducer.show,
    userDownloadCVLink: state.reportsReducer.userDownloadCVLink,
    getUserCVStatus: state.reportsReducer.getUserCVStatus,
    getUserCVErrors: state.reportsReducer.getUserCVErrors
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(usersActions, dispatch),
    async: bindActionCreators(asyncActions, dispatch),
    getUserCV: userId => dispatch(getUserCVACreator(userId)),
    getUserCVClear: (link, status, errors) =>
      dispatch(getUserCv(link, status, errors))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersContainer);
