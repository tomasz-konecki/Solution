import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";

const ProjectsList = props => {
  const construct = {
    rowClass: "project-block",
    tableClass: "projects-list-container",
    keyField: "id",
    columns: [
      { width: 20, field: "name", pretty: "Nazwa projektu" },
      { width: 20, field: "client", pretty: "Klient" },
      { width: 20, field: "startDate", pretty: "Data rozpoczęcia" },
      { width: 20, field: "endDate", pretty: "Data zakończenia" },
      { width: 10, field: "isActive", pretty: "Status" },
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

  return <SmoothTable construct={construct} data={props.projects} />;
};

export default ProjectsList;
