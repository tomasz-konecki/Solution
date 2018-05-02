import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CapacitySlider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  capacityLevelToString(level) {
    switch(level){
      case 0:
        return "0!";
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

  render() {
    let { editable, capacityLevel, capacityLeft } = this.props;

    let percentageLeft = 100 - (capacityLeft / capacityLevel * 100);

    let leftStyling = {
      width: percentageLeft + '%'
    };

    if(!editable) return (
      <div className="capacity-slider-wrapper">
        <div className="capacity-slider">
          <span className="capacity-absolute-slider-caption">
            Reference FT
          <span/>
          </span>
          <span className="capacity-absolute-slider-level">
            <span/>
          </span>
          <span className={"capacity-slider-level capacity-slider-" + capacityLevel}>
            <span/>
            <span/>
            <span/>
            <span/>
            <span/>
          </span>
          <span className={"capacity-left-slider-level capacity-left-slider-" + capacityLeft}>
            <span style={leftStyling}/>
          </span>
          <span className="capacity-slider-name">
            Current: {this.capacityLevelToString(capacityLevel)} | Left: {this.capacityLevelToString(capacityLeft)}
          </span>
        </div>
      </div>
    );
    else return (
      <div className="capacity-slider-wrapper">
        <div className="capacity-slider">
          <div className="capacity-slider-editable">
            <span className="capacity-slider-name">Capacity</span>
          </div>
          <div className="capacity-slider-level-blocks">
            {[1,2,3,4,5].map((level) => this.levelBlock(level))}
          </div>
        </div>
      </div>
    );
  }
}

CapacitySlider.propTypes = {
  capacityLevel: PropTypes.number,
  capacityLeft: PropTypes.number,
  editable: PropTypes.bool
};

export default CapacitySlider;
