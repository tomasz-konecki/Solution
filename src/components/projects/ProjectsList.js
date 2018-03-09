import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";

class ProjectsList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const construct = {
      rowClass: "project-block",
      tableClass: "projects-list-container",
      keyField: "id",
      operators: [
        {
          pretty: "DODAJ",
          click: () => {
            this.props.openAddProjectModal();
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
            { icon: { icon: "times" }, click: () => {} },
            {
              icon: { icon: "edit", iconType: "far" },
              click: object => {
                alert(object.name);
              }
            }
          ]
        }
      ]
    };

    return <SmoothTable construct={construct} data={this.props.projects} />;
  }
}

export default ProjectsList;
