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

  render() {
    let { addClient, loading, resultBlock, t } = this.props;
    return (
      <Aux>
        <Button mainClass="add-client-button" onClick={this.handleButtonClick}>
          {t("AddClient")}
        </Button>
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
