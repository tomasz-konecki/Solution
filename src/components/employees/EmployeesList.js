import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { connect } from "react-redux";
import Confirmation from "../common/modals/Confirmation";
import { setActionConfirmation } from "../../actions/asyncActions";
import Modal from "react-responsive-modal";
import DCMTWebApi from "../../api";
import EmployeesRowUnfurl from './EmployeesRowUnfurl';

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
      rowDetailUnfurl: true,
      unfurler: EmployeesRowUnfurl,
      operators: [],
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
          pretty: "Stanowisko",
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
