import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CapacityBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.levelBlock = this.levelBlock.bind(this);
    this.handleLevelBlockClick = this.handleLevelBlockClick.bind(this);
  }

  capacityLevelToString(level) {
    switch(level){
      case 1:
        return "1/5";
      case 2:
        return "1/4";
      case 3:
        return "1/2";
      case 4:
        return "3/4";
      case 5:
        return "FT";
    }
  }

  handleLevelBlockClick(level) {
    return (event) => {
      this.props.capacityChanged(level);
    };
  }

  levelBlock(level) {
    const lit = level === this.props.capacityLevel;
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
      className={"capacity-block-level-block"}
    >
      {this.capacityLevelToString(level)}
    </span>;
  }

  render() {
    let { editable, capacityLevel } = this.props;
    if(!editable) return (
      <div className="capacity-block-wrapper">
        <div className="capacity-block">
          <span className="capacity-block-name">Capacity</span>
          <span className={"capacity-block-level capacity-block-" + capacityLevel}>
            {this.capacityLevelToString(capacityLevel)}
          </span>
        </div>
      </div>
    );
    else return (
      <div className="capacity-block-wrapper">
        <div className="capacity-block">
          <div className="capacity-block-editable">
            <span className="capacity-block-name">Capacity</span>
          </div>
          <div className="capacity-block-level-blocks">
            {[1,2,3,4,5].map((level) => this.levelBlock(level))}
          </div>
        </div>
      </div>
    );
  }
}

CapacityBlock.propTypes = {
  capacityChanged: PropTypes.func,
  editable: PropTypes.bool
};

export default CapacityBlock;
