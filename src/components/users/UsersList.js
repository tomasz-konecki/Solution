import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { connect } from "react-redux";
import Confirmation from "../common/modals/Confirmation";
import { setActionConfirmation } from "../../actions/asyncActions";
import Modal from "react-responsive-modal";
import EditUserDetails from "../usersModals/EditUserDetails";
import DCMTWebApi from "../../api";

class UsersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      user: {},
      responseBlock: {},
      loading: false
    };
  }

  handleGetUser = object => {
    // DCMTWebApi.getUser(object.id)
    //   .then(response => {
    //     if (response.status === 200) {
    //       this.setState({
    //         user: response.data.dtoObject
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     throw error;
    //   });
    this.setState({
      user: object
    });

    this.handleOpenModal();
  };

  handleRoleChange = roles => {
    let _user = this.state.user;
    _user.roles = roles;

    this.setState({
      user: _user
    });
  };

  changeUserRoles = () => {
    const { id, roles } = this.state.user;
    this.setState(
      {
        loading: true
      },
      () => {
        DCMTWebApi.changeUserRole(id, roles)
          .then(response => {
            this.setState({
              responseBlock: {
                response
              },
              loading: false
            });
            setTimeout(() => {
              this.handleCloseModal();
            }, 500);
          })
          .catch(error => {
            this.setState({
              responseBlock: error,
              loading: false
            });
          });
      }
    );
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const construct = {
      rowClass: "user-block",
      tableClass: "users-list-container",
      keyField: "id",
      pageChange: this.props.pageChange,
      operators: [
        {
          pretty: "DODAJ",
          click: () => {
            this.props.openAddUserModal();
          }
        }
        // {
        //   pretty: "ODŚWIEŻ",
        //   click: () => {
        //     this.props.pageChange(this.props.currentPage);
        //   }
        // }
      ],
      columns: [
        { width: 20, field: "firstName", pretty: "Imię" },
        { width: 30, field: "lastName", pretty: "Nazwisko" },
        { width: 30, field: "email", pretty: "Email" },
        { width: 19, field: "phoneNumber", pretty: "Telefon" },
        {
          width: 1,
          toolBox: [
            {
              icon: { icon: "times" },
              click: object => {
                this.props.dispatch(
                  setActionConfirmation(true, {
                    key: "deleteUser",
                    string: `Delete user ${object.firstName} ${
                      object.lastName
                    }`,
                    id: object.id,
                    successMessage: "Użytkownik został usunięty"
                  })
                );
              }
            },
            {
              icon: { icon: "edit", iconType: "far" },
              click: object => {
                this.handleGetUser(object);
              }
            }
          ],
          pretty: "Usuń/Edytuj"
        }
      ]
    };

    return (
      <div>
        <SmoothTable
          currentPage={this.props.currentPage}
          totalPageCount={this.props.totalPageCount}
          loading={this.props.loading}
          data={this.props.users}
          construct={construct}
        />
        <Modal
          open={this.state.showModal}
          classNames={{ modal: "Modal Modal-users" }}
          contentLabel="Edit users details"
          onClose={this.handleCloseModal}
        >
          <EditUserDetails
            closeModal={this.handleCloseModal}
            user={this.state.user}
            handleRoleChange={this.handleRoleChange}
            responseBlock={this.state.responseBlock}
            loading={this.state.loading}
            changeUserRoles={this.changeUserRoles}
          />
        </Modal>
      </div>
    );
  }
}

export default connect()(UsersList);
