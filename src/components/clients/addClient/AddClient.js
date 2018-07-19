import React, { Component } from "react";
import Modal from "react-responsive-modal";
import AddClientModal from "./AddClientModal";
import Button from "../../common/button/button";
import Aux from "../../../services/auxilary";
import { translate } from "react-translate";

class AddClient extends Component {
  constructor(props) {
    super(props);
    this.state = { showAddClientModal: false };
  }

  handleButtonClick = () => {
    this.setState({ showAddClientModal: true });
  };
  handleCloseAddClientModal = () => {
    this.setState({ showAddClientModal: false });
  };

  componentWillReceiveProps = nextProps => {
    if (
      nextProps.resultBlock &&
      nextProps.resultBlock !== this.props.resultBlock
    )
      if (!nextProps.resultBlock.errorOccurred()) {
        setTimeout(() => {
          this.handleCloseAddClientModal();
        }, 2000);
      }
  };
  render() {
    let { addClient, loading, resultBlock, t, children } = this.props;
    let content = children ? (
      <Button mainClass="" onClick={this.handleButtonClick}>
        {children}
      </Button>
    ) : (
      <Button mainClass="add-client-button" onClick={this.handleButtonClick}>
        {t("AddClient")}
      </Button>
    );
    return (
      <Aux>
        {content}
        <Modal
          open={this.state.showAddClientModal}
          classNames={{ modal: "Modal Modal-add-client" }}
          contentLabel="Client"
          onClose={this.handleCloseAddClientModal}
        >
          <AddClientModal
            addClient={addClient}
            loading={loading}
            resultBlock={resultBlock}
            t={t}
          />
        </Modal>
      </Aux>
    );
  }
}

export default translate("AddClient")(AddClient);
