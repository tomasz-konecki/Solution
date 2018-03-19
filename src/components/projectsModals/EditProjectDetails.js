import React, { Component } from "react";
import LoaderHorizontal from "./../common/LoaderHorizontal";
import ResultBlock from "./../common/ResultBlock";
import ProjectDetailsBlock from "./ProjectDetailsBlock";

class EditProjectDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }
  render() {
    return (
      <div>
        <ProjectDetailsBlock project={this.props.project} editable={true} />

        <ResultBlock
          errorOnly={false}
          successMessage="Projekt edytowano pomyślnie"
          errorBlock={this.props.responseBlock}
        />
        <br />
        <div>{this.props.loading && <LoaderHorizontal />}</div>
      </div>
    );
  }
}

export default EditProjectDetails;
