import React, { Component } from "react";
import ReactModal from "react-modal";
import "../../../../scss/components/usersModals/usersModal.scss";

import UsersList from "../../../../components/users/UsersList";

import UsersSelector from "../../../../components/usersModals/UserSelector";

// const customStyles = {
//   content: {
//     height: "400px",
//     top: "50%",
//     left: "50%",
//     overflow: "none",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)"
//   }
// };

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
        <button onClick={this.handleOpenModal}>Add user</button>
        <UsersList users={this.props.users} />
        <ReactModal
          isOpen={this.state.showModal}
          className="UsersModal"
          contentLabel="Users modal"
          ariaHideApp={false}
          onRequestClose={this.handleCloseModal}
        >
          <header>
            <span>Users</span>
            <button onClick={this.handleCloseModal}>Close</button>
          </header>
          <UsersSelector />
        </ReactModal>
      </div>
    );
  }
}

export default Users;
