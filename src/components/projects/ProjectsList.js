import React, { Component } from "react";
import Icon from "../common/Icon";

const ProjectsList = props => {
  console.log("Projects", props.projects);

  const projectsList = props.projects.map((item, index) => (
    <div key={item.id} className="smooth-row project-block">
      <div className="smooth-cell smooth-2x">{item.name}</div>
      <div className="smooth-cell smooth-3x">{item.client}</div>
      <div className="smooth-cell smooth-1x">{item.startDate}</div>
      <div className="smooth-cell smooth-1x">{item.endDate}</div>
      <div className="smooth-cell smooth-1x">
        {item.isActive ? "active" : "finished"}
      </div>

      <div className="smooth-cell smooth-0x">
        <button>
          <Icon icon="times" />
        </button>
        <button>
          <Icon iconType="far" icon="edit" />
        </button>
      </div>
    </div>
  ));

  return <div className="smooth-table">{projectsList}</div>;
};

export default ProjectsList;
