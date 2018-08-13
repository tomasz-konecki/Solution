import React, { Component } from "react";
import LoaderHorizontal from "./../../common/LoaderHorizontal";
import ResultBlock from "./../../common/ResultBlock";
import ProjectDetailsBlock from "./ProjectDetailsBlock";
import WebApi from "../../../api";
import PropTypes from "prop-types";
import { translate } from "react-translate";

class EditProjectDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  editProject = (projectId, project) => {
    this.setState({ loading: true });
    WebApi.projects.put
      .project(projectId, project)
      .then(response => {
        if (this.props.updateProjectsOnSuccess) {
          this.props.projectActions.loadProjects(
            this.props.currentPage,
            this.props.limit
          );
        }
        this.setState({
          errorBlock: response,
          loading: false
        });
        setTimeout(() => {
          this.props.closeModal(true);
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
    const { t } = this.props;
    return (
      <div>
        <ProjectDetailsBlock
          projects={this.props.projects}
          project={this.props.project}
          editable
          handleGetProject={this.props.handleGetProject}
          projectActions={this.props.projectActions}
          limit={this.state.limit}
          currentPage={this.state.currentPage}
          editProject={this.editProject}
        />

        <ResultBlock
          errorOnly={false}
          successMessage={t("ProjectSuccessfullyEdited")}
          errorBlock={this.state.errorBlock}
        />

        <div>{this.state.loading && <LoaderHorizontal />}</div>
      </div>
    );
  }
}

EditProjectDetails.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object),
  projectActions: PropTypes.object,
  currentPage: PropTypes.number,
  limit: PropTypes.number,
  closeModal: PropTypes.func.isRequired,
  project: PropTypes.object,
  updateProjectsOnSuccess: PropTypes.bool
};

export default translate("EditProjectDetails")(EditProjectDetails);
