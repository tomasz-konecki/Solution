import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as usersActions from "../../../../actions/usersActions";
import * as asyncActions from "../../../../actions/asyncActions";

import "../../../../scss/containers/UsersContainer.scss";
import Modal from "react-responsive-modal";
import UserSelector from "../../../../components/usersModals/UserSelector";
import UsersList from "../../../../components/users/UsersList";
<<<<<<< HEAD
import { ACTION_CONFIRMED } from './../../../../constants';
import DCMTWebApi from "../../../../api/";
=======
import { ACTION_CONFIRMED } from "./../../../../constants";
>>>>>>> c8e008ef18d8617b4d2283c6822e1a454f76266a

class UsersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      limit: 15,
      showModal: false
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
      DCMTWebApi.deleteUser(this.props.toConfirm.id)
        .then(response => {
          this.props.async.setActionConfirmationResult({
            response
          });
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

  pageChange(page) {
    this.setState(
      {
        currentPage: page
      },
      () =>
        this.props.userActions.loadUsers(
          this.state.currentPage,
          this.state.limit
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
  // dispatch: PropTypes.function,
  users: PropTypes.array
};

function mapStateToProps(state) {
  return {
    users: state.usersReducer.users,
    totalPageCount: state.usersReducer.totalPageCount,
    loading: state.asyncReducer.loading,
    confirmed: state.asyncReducer.confirmed,
    toConfirm: state.asyncReducer.toConfirm,
    isWorking: state.asyncReducer.isWorking,
    type: state.asyncReducer.type
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(usersActions, dispatch),
    async: bindActionCreators(asyncActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
