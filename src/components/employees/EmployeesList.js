import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { connect } from "react-redux";
import Confirmation from "../common/modals/Confirmation";
import { setActionConfirmation } from "../../actions/asyncActions";
import Modal from "react-responsive-modal";
import DCMTWebApi from "../../api";

class EmployeesList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const construct = {
      rowClass: "employee-block",
      tableClass: "employees-list-container",
      keyField: "id",
      pageChange: this.props.pageChange,
      defaultSortField: "lastName",
      defaultSortAscending: true,
      filterClass: "EmployeeFilter",
      operators: [
        // {
        //   pretty: "DODAJ",
        //   click: () => {
        //     this.props.openAddUserModal();
        //   }
        // }
      ],
      columns: [
        {
          width: 20,
          field: "firstName",
          pretty: "Imię",
          type: "text",
          filter: true
        },
        {
          width: 20,
          field: "lastName",
          pretty: "Nazwisko",
          type: "text",
          filter: true
        },
        {
          width: 20,
          field: "title",
          pretty: "Tytuł",
          type: "text",
          filter: true
        },
        {
          width: 20,
          field: "localization",
          pretty: "Lokalizacja",
          type: "text",
          filter: true
        },
        {
          width: 10,
          field: "hasAccount",
          pretty: "Status",
          multiState: { true: "Konto aktywne", false: "Konto nieaktywne" },
          type: "multiState",
          filter: true
        }
        // {
        //   width: 1,
        //   toolBox: [
        //     {
        //       icon: { icon: "times" },
        //       click: object => {
        //         this.props.dispatch(
        //           setActionConfirmation(true, {
        //             key: "deleteUser",
        //             string: `Usunąć użytkownika ${object.firstName} ${
        //               object.lastName
        //             }`,
        //             id: object.id,
        //             successMessage: "Użytkownik został usunięty"
        //           })
        //         );
        //       }
        //     },
        //     {
        //       icon: { icon: "edit", iconType: "far" },
        //       click: object => {
        //         this.handleGetUser(object);
        //       }
        //     }
        //   ],
        //   pretty: "Usuń/Edytuj"
        // }
      ]
    };
    return (
      <div>
        <SmoothTable
          currentPage={this.props.currentPage}
          totalPageCount={this.props.totalPageCount}
          loading={this.props.loading}
          data={this.props.employees}
          construct={construct}
        />
      </div>
    );
  }
}

export default EmployeesList;
