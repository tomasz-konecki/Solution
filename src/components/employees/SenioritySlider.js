import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SenioritySlider extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.levelBlock = this.levelBlock.bind(this);
    this.handleLevelBlockClick = this.handleLevelBlockClick.bind(this);
  }

  seniorityLevelToString(level) {
    switch(level){
      case 1:
        return "Junior";
      case 2:
        return "Pro";
      case 3:
        return "Senior";
      case 4:
        return "Lead";
    }
  }

  handleLevelBlockClick(level) {
    return (event) => {
      this.props.seniorityChanged(level);
    };
  }

  levelBlock(level) {
    const lit = level === this.props.seniorityLevel;
    let stylingRules = {};
    if(lit){
      stylingRules = {
        color: "yellow",
        background: "black"
      };
    }
    return <span
      onClick={this.handleLevelBlockClick(level)}
      key={level} style={stylingRules}
      className={"seniority-slider-level-block"}
    >
      {this.seniorityLevelToString(level)}
    </span>;
  }

  render() {
    let { editable, seniorityLevel } = this.props;

    return (
      <div className="seniority-slider-wrapper">
        <div className="seniority-slider">
          <span className={"seniority-slider-level seniority-slider-" + seniorityLevel}>
            <span/>
            <span/>
            <span/>
            <span/>
          </span>
          <span className="seniority-slider-name">{this.seniorityLevelToString(seniorityLevel)}</span>
        </div>
      </div>
    );
  }
}

SenioritySlider.propTypes = {
  seniorityChanged: PropTypes.func,
  editable: PropTypes.bool
};

export default SenioritySlider;
