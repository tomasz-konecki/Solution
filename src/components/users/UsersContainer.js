import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as usersActions from "../../actions/usersActions";
import * as asyncActions from "../../actions/asyncActions";

import "../../scss/containers/UsersContainer.scss";
import Modal from "react-responsive-modal";
import UserSelector from "../../components/users/modals/UserSelector";
import UsersList from "../../components/users/UsersList";
import { ACTION_CONFIRMED } from './../../constants';
import WebApi from "../../api/";

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

      WebApi.users.delete.user(this.props.toConfirm.id)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(this.state.currentPage);
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
    if (this.validatePropsForUserReactivation(nextProps)) {
      this.props.async.setActionConfirmationProgress(true);

      WebApi.users.patch.reactivate(this.props.toConfirm.id)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(this.state.currentPage);
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
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

  render() {
    return (
      <div>
        <UsersList
          openAddUserModal={this.handleOpenModal}
          users={this.props.users}
          currentPage={this.state.currentPage}
          totalPageCount={this.props.totalPageCount}
          pageChange={this.pageChange}
          loading={this.props.loading}
          resultBlock={this.props.resultBlock}
        />
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
  loading: PropTypes.bool
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
    resultBlock: state.usersReducer.resultBlock
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(usersActions, dispatch),
    async: bindActionCreators(asyncActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
