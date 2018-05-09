import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SeniorityBlock extends Component {
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
      className={"seniority-block-level-block"}
    >
      {this.seniorityLevelToString(level)}
    </span>;
  }

  render() {
    let { editable, seniorityLevel } = this.props;
    if(!editable) return (
      <div className="seniority-block-wrapper">
        <div className="seniority-block">
          <span className="seniority-block-name">Seniority</span>
          <span className={"seniority-block-level seniority-block-" + seniorityLevel}>
            {this.seniorityLevelToString(seniorityLevel)}
          </span>
        </div>
      </div>
    );
    else return (
      <div className="seniority-block-wrapper">
        <div className="seniority-block">
          <div className="seniority-block-editable">
            <span className="seniority-block-name">Seniority</span>
          </div>
          <div className="seniority-block-level-blocks">
            {[1,2,3,4].map((level) => this.levelBlock(level))}
          </div>
        </div>
      </div>
    );
  }
}

SeniorityBlock.propTypes = {
  seniorityChanged: PropTypes.func,
  editable: PropTypes.bool
};

export default SeniorityBlock;
