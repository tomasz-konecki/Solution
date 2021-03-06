import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { connect } from "react-redux";
import Confirmation from "../common/modals/Confirmation";
import { setActionConfirmation } from "../../actions/asyncActions";
import Modal from "react-responsive-modal";
import EmployeesRowUnfurl from './EmployeesRowUnfurl';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

class EmployeesList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { t } = this.props;
    const construct = {
      rowClass: "employee-block",
      tableClass: "employees-list-container",
      keyField: "id",
      pageChange: this.props.pageChange,
      defaultSortField: "lastName",
      defaultSortAscending: true,
      filtering: true,
      filterClass: "EmployeeFilter",
      rowDetailUnfurl: true,
      unfurler: EmployeesRowUnfurl,
      handles: {
        refresh: () => {
          this.props.pageChange();
        }
      },
      operators: [],
      columns: [
        {
          width: 20,
          field: "firstName",
          pretty: t("Name"),
          type: "text",
          filter: true
        },
        {
          width: 20,
          field: "lastName",
          pretty: t("Surname"),
          type: "text",
          filter: true
        },
        {
          width: 20,
          field: "title",
          pretty: t("Position"),
          type: "text",
          filter: true
        },
        {
          width: 20,
          field: "localization",
          pretty: t("Location"),
          type: "text",
          filter: true
        },
        {
          width: 10,
          field: "hasAccount",
          pretty: t("Status"),
          multiState: { true: t("AccountActive"), false: t("AccountInactive") },
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

EmployeesList.propTypes = {
  pageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPageCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  employees: PropTypes.array
};

export default translate("EmployeesList")(EmployeesList);
