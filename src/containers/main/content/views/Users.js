import React, { Component } from "react";
import Modal from "react-responsive-modal";
import "../../../../scss/components/usersModals/usersModal.scss";

import UsersList from "../../../../components/users/UsersList";

import UsersSelector from "../../../../components/usersModals/UserSelector";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
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
        <UsersList openAddUserModal={this.handleOpenModal} users={this.props.users} />
        <Modal
          open={this.state.showModal}
          classNames={{ modal: "Modal" }}
          contentLabel="Users modal"
          onClose={this.handleCloseModal}
        >
          <UsersSelector />
        </Modal>
      </div>
    );
  }
}

export default Users;
