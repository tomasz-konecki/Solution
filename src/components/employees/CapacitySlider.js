import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fraction from 'fraction.js';

class CapacitySlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      negative: false
    };
    if(this.props.capacityLeft < 0) {
      this.state.negative = true;
    }
  }

  toFraction = (decimal) => {
    if(decimal === 1) return 'FT';
    return new Fraction(decimal).toFraction(true);
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

  capacityLevelToFraction = (level, reverse = false) => {
    if(reverse) switch(level){
      case 0.2: return 1;
      case 0.25: return 2;
      case 0.5: return 3;
      case 0.75: return 4;
      case 1: return 5;
      default: {
        return this.toFraction(level);
      }
    }
    switch(level){
      case 1: return 0.2;
      case 2: return 0.25;
      case 3: return 0.5;
      case 4: return 0.75;
      case 5: return 1;
    }
  }

  render() {
    let { editable, capacityLevel, capacityLeft } = this.props;

    let percentageLeft = 100 - (capacityLeft / capacityLevel * 100);

    let nCapacityLeft = this.capacityLevelToFraction(capacityLeft, true);
    let nCapacityLevel = this.capacityLevelToFraction(capacityLevel, true);

    let leftClasses = ["capacity-left-slider-level", "capacity-left-slider"];

    if(this.state.negative){
      percentageLeft = 100;
      nCapacityLeft = capacityLeft;
      leftClasses.push('capacity-left-slider-negative');
    }

    let leftStyling = {
      width: percentageLeft * 5 + '%'
    };

    return (
      <div className="capacity-slider-wrapper">
        <div className="capacity-slider">
          <span className="capacity-absolute-slider-caption">
            Reference FT
          <span/>
          </span>
          <span className="capacity-absolute-slider-level">
            <span/>
          </span>
          <span className={"capacity-slider-level capacity-slider-" + nCapacityLevel}>
            <span/>
            <span/>
            <span/>
            <span/>
            <span/>
            <span className={leftClasses.join(' ')}>
              <span style={leftStyling}/>
            </span>
          </span>
          <span className="capacity-slider-name">
            Current: {this.toFraction(capacityLevel)} | Left: {this.toFraction(nCapacityLeft)}
          </span>
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
