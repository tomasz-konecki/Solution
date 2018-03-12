import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as usersActions from "../../../../actions/usersActions";

import "../../../../scss/containers/UsersContainer.scss";
import Modal from "react-responsive-modal";
import UserSelector from "../../../../components/usersModals/UserSelector";
import UsersList from "../../../../components/users/UsersList";

class UsersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    this.props.userActions.loadUsers(1, 25);
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
          loading={this.props.loading}
        />
        <Modal
          open={this.state.showModal}
          classNames={{ modal: "Modal" }}
          contentLabel="Users modal"
          onClose={this.handleCloseModal}
        >
          <UserSelector />
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
    loading: state.asyncReducer.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(usersActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
