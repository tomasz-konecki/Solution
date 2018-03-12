import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as projectsActions from "../../../../actions/projectsActions";
import Projects from "../views/Projects";

import "../../../../scss/containers/ProjectsContainer.scss";

class ProjectsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };
  }

  componentDidMount() {
    this.props.projectActions.loadProjects(this.state.page);
  }

  render() {
    return (
      <div>
        <Projects
          projects={this.props.projects}
          projectActions={this.props.projectActions}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    projects: state.projectsReducer.projects
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectsActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsContainer);
