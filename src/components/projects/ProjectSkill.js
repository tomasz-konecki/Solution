import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

class ProjectSkill extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.levelBlock = this.levelBlock.bind(this);
    this.handleLevelBlockClick = this.handleLevelBlockClick.bind(this);
  }

  isHighLit(skillLevel, level) {
    return skillLevel === level;
  }

  handleLevelBlockClick(skillObject, level, deletion = false) {
    return (event) => {
      if(this.props.skillEdited !== undefined)
        skillObject.skillLevel = level;
      this.props.skillEdited(skillObject, deletion);
    };
  }

  levelBlock(skillObject, level) {
    const lit = this.isHighLit(skillObject.skillLevel, level);
    let stylingRules = {};
    if(lit){
      stylingRules = {
        color: "yellow",
        background: "black"
      };
    }
    return <span onClick={this.handleLevelBlockClick(skillObject, level)} key={level} style={stylingRules} className={"project-skill-level-block"}>{level}</span>;
  }

  render() {
    let { editable, skillObject, cut = false, duplicate = false } = this.props;
    // dirty fix, waiting for backend
    if(skillObject.skillName === undefined){
      if(skillObject.skillLevel === undefined) skillObject.skillLevel = 1;
      skillObject = {
        skillName: skillObject.name,
        skillId: skillObject.id,
        skillLevel: skillObject.skillLevel
      };
    }
    let classes = ["project-skill"];

    if(cut) {
      classes.push('project-skill-cut');
    }

    if(duplicate) {
      classes.push('project-skill-duplicate');
    }

    const stylingRules = {
      background: hexToRGB(stringToColour(skillObject.skillName), 0.5)
    };
    if(!editable) return (
      <div className={classes.join(' ')}>
        <span style={stylingRules} className="project-skill-name">{skillObject.skillName}</span>
        {
          (!cut) ?
          <span className={"project-skill-level skill-level-" + skillObject.skillLevel}>
            {skillObject.skillLevel}
          </span>
          :
          null
        }
      </div>
    );
    else return (
      <div className="project-skill-wrapper">
        <div className="project-skill-editable">
          <span
            className="project-skill-delete-block"
            onClick={this.handleLevelBlockClick(skillObject, skillObject.skillLevel, true)}
          >X</span>
          <span style={stylingRules} className="project-skill-name">{skillObject.skillName}</span>
        </div>
        <div className="project-skill-level-blocks">
          {[1,2,3,4,5].map((level) => this.levelBlock(skillObject, level))}
        </div>
      </div>
    );
  }
}

ProjectSkill.propTypes = {
  skillEdited: PropTypes.func,
  editable: PropTypes.bool,
  skillObject: PropTypes.object,
  cut: PropTypes.bool,
  duplicate: PropTypes.bool
};

export default ProjectSkill;
