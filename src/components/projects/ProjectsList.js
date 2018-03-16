import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { setActionConfirmation } from "./../../actions/asyncActions";
import { connect } from "react-redux";

class ProjectsList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const construct = {
      rowClass: "project-block",
      tableClass: "projects-list-container",
      keyField: "id",
      pageChange: this.props.pageChange,
      operators: [
        {
          pretty: "DODAJ",
          click: () => {
            this.props.openAddProjectModal();
          }
        },
        {
          pretty: "ODŚWIEŻ",
          click: () => {
            this.props.pageChange(this.props.currentPage);
          }
        }
      ],
      columns: [
        { width: 20, field: "name", pretty: "Nazwa projektu" },
        { width: 20, field: "client", pretty: "Klient" },
        { width: 20, field: "startDate", pretty: "Data rozpoczęcia" },
        { width: 20, field: "endDate", pretty: "Data zakończenia" },
        {
          width: 10,
          field: "isActive",
          pretty: "Status",
          multiState: { true: "Aktywny", false: "Zakończony" }
        },
        {
          width: 1,
          toolBox: [
            {
              icon: { icon: "times" },
              click: object => {
                this.props.dispatch(
                  setActionConfirmation(true, {
                    key: "deleteProject",
                    string: `Delete project ${object.name}`,
                    id: object.id,
                    successMessage: "Projekt został usunięty"
                  })
                );
              }
            },
            {
              icon: { icon: "edit", iconType: "far" },
              click: object => {
                alert(object.name);
              }
            }
          ],
          pretty: "Usuń/Edytuj"
        }
      ]
    };

    return (
      <SmoothTable
        currentPage={this.props.currentPage}
        totalPageCount={this.props.totalPageCount}
        loading={this.props.loading}
        data={this.props.projects}
        construct={construct}
      />
    );
  }
}

export default connect()(ProjectsList);
