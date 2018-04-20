import React, { Component } from "react";
import LoaderHorizontal from "./../../common/LoaderHorizontal";
import ResultBlock from "./../../common/ResultBlock";
import ProjectDetailsBlock from "./ProjectDetailsBlock";
import DCMTWebApi from "../../../api";
import PropTypes from 'prop-types';

class EditProjectDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  editProject = project => {
    this.setState({ loading: true });
    DCMTWebApi.editProject(project)
      .then(response => {
        this.props.projectActions.loadProjects(
          this.props.currentPage,
          this.props.limit
        );
        this.setState({
          errorBlock: { response },
          loading: false
        });
        setTimeout(() => {
          this.props.closeModal();
        }, 500);
      })
      .catch(errorBlock => {
        this.setState({
          errorBlock,
          loading: false
        });
      });
  };

  render() {
    return (
      <div>
        <ProjectDetailsBlock
          project={this.props.project}
          editable
          projectActions={this.props.projectActions}
          limit={this.state.limit}
          currentPage={this.state.currentPage}
          editProject={this.editProject}
        />

        <ResultBlock
          errorOnly={false}
          successMessage="Projekt edytowano pomyślnie"
          errorBlock={this.state.errorBlock}
        />

        <div>{this.state.loading && <LoaderHorizontal />}</div>
      </div>
    );
  }
}

EditProjectDetails.propTypes = {
  projectActions: PropTypes.object,
  currentPage: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  closeModal: PropTypes.func.isRequired,
  project: PropTypes.object
};

export default EditProjectDetails;
