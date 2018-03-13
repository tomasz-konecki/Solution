import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { connect } from "react-redux";
import { loadUsers } from "../../actions/usersActions";

class UsersList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const construct = {
      rowClass: "user-block",
      tableClass: "users-list-container",
      keyField: "id",
      operators: [
        {
          pretty: "DODAJ",
          click: () => {
            this.props.openAddUserModal();
          }
        },
        {
          pretty: "ODŚWIEŻ",
          click: () => {
            this.props.dispatch(loadUsers(1, 25));
          }
        }
      ],
      columns: [
        { width: 20, field: "firstName", pretty: "Imię" },
        { width: 30, field: "lastName", pretty: "Nazwisko" },
        { width: 30, field: "email", pretty: "Email" },
        { width: 19, field: "phoneNumber", pretty: "Telefon" },
        {
          width: 1,
          toolBox: [
            { icon: { icon: "times" }, click: () => {} },
            {
              icon: { icon: "edit", iconType: "far" },
              click: object => {
                alert(object.firstName);
              }
            }
          ],
          pretty: "Usuń/Edytuj"
        }
      ]
    };

    return <SmoothTable currentPage loading={this.props.loading} construct={construct} data={this.props.users} />;
  }
}

export default connect()(UsersList);
