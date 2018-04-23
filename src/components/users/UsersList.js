import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { connect } from "react-redux";
import Confirmation from "../common/modals/Confirmation";
import { setActionConfirmation } from "../../actions/asyncActions";
import Modal from "react-responsive-modal";
import EditUserDetails from "../users/modals/EditUserDetails";
import DCMTWebApi from "../../api";
import PropTypes from 'prop-types';

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
      defaultSortField: "lastName",
      defaultSortAscending: true,
      filtering: true,
      filterClass: "UserFilter",
      showDeletedCheckbox: true,
      disabledRowComparator: (object) => {
        return object.isDeleted;
      },
      operators: [
        {
          pretty: "DODAJ",
          click: () => {
            this.props.openAddUserModal();
          }
        }
      ],
      columns: [
        { width: 20, field: "firstName", pretty: "Imię", type: "text", filter: true },
        { width: 30, field: "lastName", pretty: "Nazwisko", type: "text", filter: true },
        { width: 30, field: "email", pretty: "Email", type: "text", filter: true },
        { width: 19, field: "phoneNumber", pretty: "Telefon", type: "text", filter: true },
        {
          width: 1,
          toolBox: [
            {
              icon: { icon: "sync-alt" },
              title: "Reaktywuj użytkownika",
              click: object => {
                this.props.dispatch(
                  setActionConfirmation(true, {
                    key: "reactivateUser",
                    string: `Reaktywować użytkownika ${object.firstName} ${
                      object.lastName
                    }`,
                    id: object.id,
                    successMessage: "Użytkownik został reaktywowany"
                  })
                );
              },
              comparator: object => object.isDeleted
            },
            {
              icon: { icon: "times" },
              title: "Usuń użytkownika",
              click: object => {
                this.props.dispatch(
                  setActionConfirmation(true, {
                    key: "deleteUser",
                    string: `Usunąć użytkownika ${object.firstName} ${
                      object.lastName
                    }`,
                    id: object.id,
                    successMessage: "Użytkownik został usunięty"
                  })
                );
              },
              comparator: object => !object.isDeleted
            },
            {
              icon: { icon: "edit", iconType: "far" },
              title: "Edytuj użytkownika",
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

UsersList.propTypes = {
  pageChange: PropTypes.func.isRequired,
  openAddUserModal: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPageCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default connect()(UsersList);
