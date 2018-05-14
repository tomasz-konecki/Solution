import React, { Component } from 'react';
import LoaderCircular from './../common/LoaderCircular';
import DropTarget from 'react-dnd/lib/DropTarget';
import AssignDropTypes from './AssignDropTypes';

const apbTarget = {
	drop(props, monitor) {
		props.onDrop(monitor.getItem());
	}
};

@DropTarget(AssignDropTypes.EMPLOYEE, apbTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop()
}))
class AssignProjectBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
		const isActive = canDrop && isOver;

		let backgroundColor = 'initial';
		if (isActive) {
			backgroundColor = 'rgba(0, 151, 233, 0.19)';
		} else if (canDrop) {
			backgroundColor = 'rgba(255, 0, 204, 0.13)';
    }

    return connectDropTarget(
      <div className="row assign-container-right-row" style={{ backgroundColor }}>
          <div className="col-lg-8">{this.props.project.name}</div>
          <div className="col-lg-4">
          </div>
      </div>
    );
  }
}

export default AssignProjectBlock;
