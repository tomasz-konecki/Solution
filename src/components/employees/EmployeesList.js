import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { connect } from "react-redux";
import Confirmation from "../common/modals/Confirmation";
import { setActionConfirmation } from "../../actions/asyncActions";
import Modal from "react-responsive-modal";
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

  showSharedSymbod(employee) {
    if(employee && employee.employeeShared) {
      return <span><i className="fa fa-share-alt"></i> {employee.firstName} </span>;
    }else{
      return employee.firstName;
    }
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
      showDeletedCheckbox: true,
      showAllCheckbox: true,
      redirectPath: "/main/employees/",
      disabledRowComparator: object => {
        return object.isDeleted;
      },
      handles: {
        refresh: () => {
          this.props.pageChange();
        }
      },
      operators: [],
      columns: [
        {
          width: 20,
          pretty: t("Name"),
          type: "text",
          field: "firstName",
          filter: true,
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
            false: t("AccountInactive"),
            true: t("AccountActive")
          },
          type: "multiState",
          filter: true
        },
        {
          width: 1,
          toolBox: [
            {
              icon: { icon: "download" },
              title: t("DownloadEmployeeCVInWordFormat"),
              click: object => {
                this.props.getCV("word", object.id);
              },
              comparator: object => !!object.seniority
            },
            {
              icon: { icon: "download" },
              title: t("DownloadEmployeeCVInPdfFormat"),
              click: object => {
                this.props.getCV("pdf", object.id);
              },
              comparator: object => !!object.seniority
            },
            {
              icon: { icon: "plus-square" },
              title: t("ActivateEmployee"),
              click: object => {
                this.props.activateEmployee(object, t);
              },
              comparator: object =>
                binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(
                  this.props.binPem
                ) &&
                (!object.seniority || object.isDeleted)
            },
            {
              icon: { icon: "minus-square" },
              title: t("DeleteEmployee"),
              click: object => {
                this.props.removeEmployee(object, t);
              },
              comparator: object =>
                binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(
                  this.props.binPem
                ) &&
                !object.isDeleted &&
                object.seniority
            }
          ],
          pretty: t("Options")
        }
      ]
    };
    let render = () => (
      <div>
        <SmoothTable
          getSettings={this.props.getSettings}
          currentPage={this.props.currentPage}
          totalPageCount={this.props.totalPageCount}
          loading={this.props.loading}
          data={this.props.employees}
          construct={construct}
          showRaportButton={binaryPermissioner(false)(0)(0)(0)(1)(1)(1)(
            this.props.binPem
          )}
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

function mapStateToProps(state) {
  return {
    binPem: state.authReducer.binPem
  };
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

export default connect(mapStateToProps)(
  translate("EmployeesList")(EmployeesList)
);
