import React, { Component } from "react";
import Modal from "react-responsive-modal";

import ProjectsList from "../../../../components/projects/ProjectsList";
import AddProjectScreen from "../../../../components/projectsModals/AddProjectScreen";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div>
        <ProjectsList
          openAddProjectModal={this.handleOpenModal}
          projects={this.props.projects}
        />
        <Modal
          open={this.state.showModal}
          classNames={{ modal: "Modal" }}
          contentLabel="Projects test modal"
          onClose={this.handleCloseModal}
        >
          <AddProjectScreen
            projectActions={this.props.projectActions}
            login={this.props.login}
          />
        </Modal>
      </div>
    );
  }
}

export default Projects;
