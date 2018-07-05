import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as projectsActions from "../../actions/projectsActions";
import * as asyncActions from "../../actions/asyncActions";
import Modal from "react-responsive-modal";
import AddProjectScreen from "../../components/projects/modals/AddProjectScreen";
import ProjectsList from "../../components/projects/ProjectsList";
import WebApi from "../../api/";
import ProjectDetailContainer from "./ProjectDetailContainer";

import "../../scss/containers/ProjectsContainer.scss";
import { ACTION_CONFIRMED } from "./../../constants";
import { Route, Switch, withRouter } from 'react-router-dom';
import ProjectDetails from './ProjectDetails/ProjectDetails';
class ProjectsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      currentPage: 1,
      limit: 15,
      init: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }



  componentWillReceiveProps(nextProps) {
    if (this.validatePropsForAction(nextProps, "deleteProject")) {
      this.props.async.setActionConfirmationProgress(true);
      WebApi.projects.delete.project(this.props.toConfirm.id)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(this.state.currentPage);
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
    if (this.validatePropsForAction(nextProps, "closeProject")) {
      this.props.async.setActionConfirmationProgress(true);
      WebApi.projects.put.close(this.props.toConfirm.id)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(this.state.currentPage);
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
    if (this.validatePropsForAction(nextProps, "reactivateProject")) {
      this.props.async.setActionConfirmationProgress(true);
      WebApi.projects.put.reactivate(this.props.toConfirm.id)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(this.state.currentPage);
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
    if (this.validatePropsForAction(nextProps, "deleteProjectOwner")) {
      this.props.async.setActionConfirmationProgress(true);
      const { ownerId, projectId } = this.props.toConfirm;
      WebApi.projects.delete.owner(projectId, ownerId)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(this.state.currentPage);
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
    if (this.validatePropsForAction(nextProps, "putProjectSkills")) {
      this.props.async.setActionConfirmationProgress(true);
      const { projectId, skillsArray } = this.props.toConfirm;
      WebApi.projects.put.skills(projectId, skillsArray)
        .then(response => {
          this.props.async.setActionConfirmationResult(response);
          this.pageChange(this.state.currentPage);
        })
        .catch(error => {
          this.props.async.setActionConfirmationResult(error);
        });
    }
  }

  validatePropsForAction(nextProps, action) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === action
    );
  }

  pageChange(page = this.state.currentPage, other = {}) {
    this.setState(
      {
        currentPage: page
      },
      () =>
        this.props.projectActions.loadProjects(
          this.state.currentPage,
          this.state.limit,
          other
        )
    );
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  pullDOM = () => {
    if(!this.state.init){
      this.setState({
        init: true
      }, this.pageChange(this.state.currentPage));
    }
    return <div>
      <ProjectsList
        openAddProjectModal={this.handleOpenModal}
        projects={this.props.projects}
        currentPage={this.state.currentPage}
        totalPageCount={this.props.totalPageCount}
        pageChange={this.pageChange}
        loading={this.props.loading}
        projectActions={this.props.projectActions}
        limit={this.state.limit}
      />
      <Modal
        open={this.state.showModal}
        classNames={{ modal: "Modal Modal-projects" }}
        contentLabel="Projects test modal"
        onClose={this.handleCloseModal}
      >
        <AddProjectScreen
          projectActions={this.props.projectActions}
          limit={this.state.limit}
          currentPage={this.state.currentPage}
          closeModal={this.handleCloseModal}
        />
      </Modal>
    </div>;
  }

  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={match.url + ""} component={this.pullDOM} />
        <Route exact path={match.url + "/:id"} component={ProjectDetails} />
      </Switch>

    );
  }
}

function mapStateToProps(state) {
  return {
    projects: state.projectsReducer.projects,
    totalPageCount: state.projectsReducer.totalPageCount,
    loading: state.asyncReducer.loading,
    confirmed: state.asyncReducer.confirmed,
    toConfirm: state.asyncReducer.toConfirm,
    isWorking: state.asyncReducer.isWorking,
    type: state.asyncReducer.type
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectsActions, dispatch),
    async: bindActionCreators(asyncActions, dispatch)
  };
}

ProjectsContainer.propTypes = {
  async: PropTypes.shape({
    setActionConfirmationResult: PropTypes.func,
    setActionConfirmationProgress: PropTypes.func
  }),
  toConfirm: PropTypes.object,
  projectActions: PropTypes.object,
  projects: PropTypes.arrayOf(PropTypes.object),
  totalPageCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectsContainer));
