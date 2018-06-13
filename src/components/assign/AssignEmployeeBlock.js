import React, { Component } from 'react';
import LoaderCircular from './../common/LoaderCircular';
import DragSource from 'react-dnd/lib/DragSource';
import SenioritySlider from './../employees/SenioritySlider';
import CapacitySlider from './../employees/CapacitySlider';
import SkillRow from '../skills/SkillRow';

const employeeSource = {
	beginDrag(props) {
		return props.employee;
	}
};

@DragSource(props => props.type, employeeSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
}))
class AssignEmployeeBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  seniorityLevelToString(level, reverse = false) {
    if(reverse) switch(level){
      case "Junior": return 1;
      case "Pro": return 2;
      case "Senior": return 3;
      case "Lead": return 4;
    }
    switch(level){
      case 1: return "Junior";
      case 2: return "Pro";
      case 3: return "Senior";
      case 4: return "Lead";
    }
  }

  mapSkills = (skills, editable = false) => {
    return skills.map((skillObject, index) => {
      return (
        <SkillRow
          key={index}
          skill={skillObject}
          handleSkillEdit={this.handleSkillEdit}
          editable={this.state.edit}
          micro
        />
      );
    });
  }

  render() {
    const { isDragging, connectDragSource } = this.props;
		const { employee } = this.props;
		const opacity = isDragging ? 0.4 : 1;

    return connectDragSource(
      <div className="row assign-container-left-row" style={{opacity}}>
        <div className="col-lg-6">
          <a className="assign-text-shadow" target="_blank" href={`/main/employees/${employee.id}`}>
            {employee.firstName} {employee.lastName}
          </a>
          <br/>
          <span className="assign-constant-holder">
            {employee.seniority}
          </span>
          <span className="assign-separator">|</span>
          <span className="assign-text-right">
          {employee.title}
          </span>
        </div>
        <div className="col-lg-6">
          <SenioritySlider
            seniorityLevel={this.seniorityLevelToString(employee.seniority, true)}
            showText={false}
          />
          <CapacitySlider
            capacityLevel={employee.baseCapacity}
            capacityLeft={employee.capacityLeft}
          />
          <br/>
          {
            this.mapSkills(employee.skills)
          }
        </div>
      </div>
    );
  }
}

export default AssignEmployeeBlock;
