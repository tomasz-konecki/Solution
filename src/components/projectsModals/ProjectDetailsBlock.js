import React, { Component } from "react";
import Detail from "../common/Detail";

class ProjectDetailsBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false
    };
  }

  render() {
    <Detail
      type="text"
      editable={this.state.editable}
      pretty="Nazwa projektu"
      reuired
      value={this.props.project.name}
    />;
  }
}
