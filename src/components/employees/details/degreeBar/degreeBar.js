import React from "react";
import "./degreeBar.scss";
import WebApi from "../../../../api/index";
import SmallSpinner from "../../../common/spinner/small-spinner";
import { errorCatcher } from "../../../../services/errorsHandler";
import OperationStatusPrompt from "../../../form/operationStatusPrompt/operationStatusPrompt";

const seniorities = ["Junior", "Pro", "Senior", "Lead"];

const createSpans = range => {
  const array = [];
  for (let i = 0; i < range; i++) array.push(i);

  return array;
};
const findSeniorityIndex = seniority => {
  return seniorities.findIndex(i => {
    return i === seniority
  });
}

class DegreeBar extends React.Component {
  state = {
    currentHoveredIndex: null,
    array: createSpans(this.props.range),
    isChanging: false,
    seniorityIndex: findSeniorityIndex(this.props.seniority)+1
  };
  changeDegreeValue = index => {
    this.setState({ isChanging: true });
    this.props.editSeniority(seniorities[index]);
  };

  shouldComponentUpdate(nextState){
    if(nextState.seniorityIndex !== this.state.seniorityIndex)
      return true;
    
    return false;
  }
  
  componentDidUpdate(nextProps){
   
    if(this.props.employeeErrors !== nextProps.employeeErrors){
      const { seniority } = this.props;
      const { seniorityIndex } = this.state;

      const newSeniorityIndex = seniority !== seniorities[seniorityIndex] ? 
        findSeniorityIndex(seniority) + 1 : seniorityIndex + 1;

      this.setState({isChanging: false, seniorityIndex: newSeniorityIndex });
    }
  }
  
  render() {
    const { seniority, range } = this.props;
    const {
      currentHoveredIndex,
      array,
      isChanging,
      seniorityIndex
    } = this.state;
    return (
      <section className="degree-bar">
        {array.map(index => {
          return (
            <span
              onClick={isChanging ? null : () => this.changeDegreeValue(index)}
              onMouseOver={() => this.setState({ currentHoveredIndex: index })}
              onMouseOut={() => this.setState({ currentHoveredIndex: null })}
              style={{
                width: `${100 / range - 5}%`,
                background: `${currentHoveredIndex !== null &&
                currentHoveredIndex >= index
                  ? "#5BCB62"
                  : index < seniorityIndex ? "#509054" : "grey"}`
              }}
              key={index}
            />
          );
        })}
        <p>
          {currentHoveredIndex !== null ? seniorities[currentHoveredIndex] : seniorityIndex === 0 ? 
            "Nie wybrano" : seniorities[seniorityIndex-1]}
        </p>

        {isChanging && <SmallSpinner />}

      </section>
    );
  }
}

export default DegreeBar;
