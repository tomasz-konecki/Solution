import React from "react";
import "./fteBar.scss";
import { calculateFteBarWidth, valuesArray } from "./index";
import WebApi from "../../../../api/index";
import Spinner from "../../../common/spinner/small-spinner";
class FteBar extends React.PureComponent {
  state = {
    mark: calculateFteBarWidth(this.props.capacityLeft),
    isChanging: false
  };
  putMarkerDivs = range => {
    const { isChanging } = this.state;
    const { canEditFteBar } = this.props;
    const divs = [];

    if (canEditFteBar) {
      for (let i = 0; i < range; i++) {
        const distance = 100 / range;
        divs.push(
          <div
            key={i}
            onClick={isChanging ? null : () => this.edit(i)}
            onMouseMove={
              isChanging
                ? null
                : () =>
                    this.setState({
                      mark: calculateFteBarWidth(valuesArray[i].percentage)
                    })
            }
            onMouseOut={
              isChanging
                ? null
                : () =>
                    this.setState({
                      mark: calculateFteBarWidth(this.props.capacityLeft)
                    })
            }
            style={{ width: `${distance}%`, left: `${distance * i + 1}%` }}
            className="marker"
          />
        );
      }
    } else {
      for (let i = 0; i < range; i++) {
        const distance = 100 / range;
        divs.push(
          <div
            key={i}
            style={{ width: `${distance}%`, left: `${distance * i + 1}%` }}
            className="marker"
            style={{ cursor: "unset" }}
          />
        );
      }
    }

    return divs;
  };
  edit = index => {
    this.setState({ isChanging: true });
    this.props.editCapacity(valuesArray[index].percentage);
  };
  componentDidUpdate(nextProps) {
    if (nextProps.employeeErrors !== this.props.employeeErrors) {
      this.setState({ isChanging: false });
    }
  }
  render() {
    const { mark, isChanging } = this.state;
    return (
      <div className="fte-bar-container">
        <div
          style={{ width: `${mark.percentage * 100}%` }}
          className="fte-bar-progress"
        >
          <span>{mark.mark}</span>
        </div>
        <div
          style={{ width: `${100 - mark.percentage * 100}%` }}
          className="fte-bar-regress"
        />
        {this.putMarkerDivs(valuesArray.length).map(div => div)}
        <span>{mark.percentage * 100}%</span>

        {isChanging && <Spinner />}
      </div>
    );
  }
}

export default FteBar;
