import React from "react";
import Modal from "react-responsive-modal";

class Projects extends React.Component {
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

  componentDidMount() {
    console.log("Projects", this.props.projects);
  }

  render() {
    return (
      <div>
        <button onClick={this.handleOpenModal}>Open Modal</button>
        <Modal
          open={this.state.showModal}
          contentLabel="Projects test modal"
          onClose={this.handleCloseModal}
        >
          <p>Text here</p>
          <hr />
          <button onClick={this.handleCloseModal}>Close</button>
        </Modal>
      </div>
    );
  }
}

export default Projects;
