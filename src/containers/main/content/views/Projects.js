import React from "react";
import ReactModal from "react-modal";

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  handleOpenModal () {
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }
  render() {
    return (
      <div>
        <button onClick={this.handleOpenModal}>Open Modal</button>
          <ReactModal
            isOpen={this.state.showModal}
            contentLabel="Projects test modal"
            ariaHideApp={false}
            onRequestClose={this.handleCloseModal}>
            <p>Text here</p>
            <hr/>
            <button onClick={this.handleCloseModal}>Close</button>
          </ReactModal>
      </div>
     );
  }
}

export default Projects;
