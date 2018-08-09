import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { connect } from "react-redux";
import Confirmation from "../common/modals/Confirmation";
import { setActionConfirmation } from "../../actions/asyncActions";
import Modal from "react-responsive-modal";
import EmployeesRowUnfurl from "./EmployeesRowUnfurl";
import PropTypes from "prop-types";
import { translate } from "react-translate";
import "../../scss/components/employees/employeesList.scss";
import IntermediateBlock from "./../common/IntermediateBlock";
import binaryPermissioner from "./../../api/binaryPermissioner";

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
      showDeletedCheckbox: true,
      showAllCheckbox: true,
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
          multiState: {
            true: t("AccountActive"),
            false: t("AccountInactive"),
            "": t("SelectStatus")
          },
          type: "multiState",
          filter: true
        },
        {
          width: 1,
          toolBox: [
            {
              icon: { icon: "download" },
              title: t("DownloadCV"),
              click: object => {
                this.props.getCV(object.id);
              },
              comparator: object => !!object.seniority
            },
            {
              icon: { icon: "plus-square" },
              title: t("ActivateEmployee"),
              click: object => {
                this.props.activateEmployee(object, t);
              },
              comparator: object => !object.seniority
            },
            {
              icon: { icon: "minus-square" },
              title: t("DeleteEmployee"),
              click: object => {
                this.props.removeEmployee(object, t);
              },
              comparator: object => !object.isDeleted && object.seniority
            }
          ],
          pretty: t("Options")
        }
      ]
    };
    let render = () => (
      <div>
        <SmoothTable
          currentPage={this.props.currentPage}
          totalPageCount={this.props.totalPageCount}
          loading={this.props.loading}
          data={this.props.employees}
          construct={construct}
          showRaportButton={true}
        />
      </div>
    );
    return (
      <IntermediateBlock
        loaded={true}
        render={render}
        resultBlock={this.props.resultBlock}
        _className={"content-container"}
      />
    );
  }
}

EmployeesList.propTypes = {
  pageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPageCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  employees: PropTypes.array,
  getCV: PropTypes.func.isRequired,
  activateEmployee: PropTypes.func.isRequired,
  removeEmployee: PropTypes.func.isRequired
};

export default translate("EmployeesList")(EmployeesList);
