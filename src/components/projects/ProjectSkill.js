import React, { Component } from 'react';

const ProjectSkill = ({skillObject}) => {
  return (
    <div className="project-skill">
      <span className="project-skill-name">{skillObject.skillName}</span>
      <span className={"project-skill-level skill-level-" + skillObject.skillLevel}>
        {skillObject.skillLevel}
      </span>
    </div>
  );
};

export default ProjectSkill;
