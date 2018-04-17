import React, { Component } from 'react';

const stringToColour = function(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};

const hexToRGB = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  return alpha ? "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")" : "rgb(" + r + ", " + g + ", " + b + ")";
};

const ProjectSkill = ({skillObject}) => {
  const stylingRules = {
    background: hexToRGB(stringToColour(skillObject.skillName), 0.4)
  };
  return (
    <div className="project-skill">
      <span style={stylingRules} className="project-skill-name">{skillObject.skillName}</span>
      <span className={"project-skill-level skill-level-" + skillObject.skillLevel}>
        {skillObject.skillLevel}
      </span>
    </div>
  );
};

export default ProjectSkill;
