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

class SkillRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skill: this.standardiseSkill(this.props.skill)
    };

    this.announceChange();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      skill: this.standardiseSkill(newProps.skill)
    });
  }

  standardiseSkill(object) {
    let skill = {};

    object.skillName === undefined ? skill.skillName = object.name : skill.skillName = object.skillName;
    object.skillLevel === undefined ?
      object.level !== undefined ? skill.skillLevel = object.level : skill.skillLevel = 1
    : skill.skillLevel = object.skillLevel;
    object.skillId === undefined ? skill.skillId = object.id : skill.skillId = object.skillId;
    object.yearsOfExperience === undefined ?
       skill.yearsOfExperience = 1
     : skill.yearsOfExperience = object.yearsOfExperience;

    return skill;
  }

  years(yoe) {
    return yoe !== 1 ? `${yoe} years` : `${yoe} year`;
  }

  leveltoRGGradient(level) {
    switch(level - 0) {
      case 1: return "#00FF00";
      case 2: return "#7FFF00";
      case 3: return "#FFFF00";
      case 4: return "#FFFF00";
      case 5: return "#FF0000";
    }
  }

  handleYOEChange = (event) => {
    let { skill } = this.state;
    skill.yearsOfExperience = event.target.value - 0;
    this.setState({
      skill
    }, () => {
      this.announceChange();
    });
  }

  handleLevelChange = (event) => {
    let { skill } = this.state;
    skill.skillLevel = event.target.value - 0;
    this.setState({
      skill
    }, () => {
      this.announceChange();
    });
  }

  rowLevels = () => {
    return <div className="skill-row-levels">
      <div className={"skill-level-" + this.state.skill.skillLevel}/>
    </div>;
  }

  rowEditLevels = () => {
    return <div className="skill-row-levels-editor">
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={this.state.skill.skillLevel}
        onChange={this.handleLevelChange}
      />
    </div>;
  }

  announceChange = () => {
    this.props.handleSkillEdit(this.state.skill, false);
  }

  announceDeletion = () => {
    this.props.handleSkillEdit(this.state.skill, true);
  }

  render() {
    const { skill } = this.state;
    let nCBlock = {};
    let lCBlock = {};
    if(skill.skillName !== undefined) nCBlock = {
      background: hexToRGB(stringToColour(skill.skillName), 0.5)
    };
    if(skill.skillLevel !== undefined) lCBlock = {
      background: hexToRGB(this.leveltoRGGradient(skill.skillLevel), 0.5)
    };
    return (
      <div className="skill-row">
        <div style={nCBlock} className="skill-row-cblock"/>
        <div className="skill-row-name">{ skill.skillName }</div>
        {
          this.props.editable ?
            this.rowEditLevels()
          : this.rowLevels(skill.skillLevel)
        }
        <div style={lCBlock} className="skill-row-cblock"/>
        <div className="skill-row-separator">EXP</div>
        <div className="skill-row-yoe">{ this.years(skill.yearsOfExperience) }</div>
        { this.props.editable ?
            <div className="skill-row-yoe-range">
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={skill.yearsOfExperience}
                onChange={this.handleYOEChange}
              />
            </div>
            :
            null
        }
        { this.props.editable ? <div onClick={this.announceDeletion} className="skill-row-delete"/> : null }
      </div>
    );
  }
}

export default SkillRow;
