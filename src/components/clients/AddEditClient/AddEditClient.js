import React, { Component } from "react";
import Modal from "react-responsive-modal";
import AddClientModal from "./AddClientModal";
import Button from "../../common/button/button";
import Aux from "../../../services/auxilary";
import { translate } from "react-translate";

class AddEditClient extends Component {
  constructor(props) {
    super(props);
    this.state = { showAddClientModal: false };
  }

  handleButtonClick = () => {
    this.setState({ showAddClientModal: true });
  };
  handleCloseAddClientModal = () => {     
    const { addClientResult } = this.props;
    this.setState({ showAddClientModal: false });
    if (addClientResult) {
        addClientResult(null);
    };
  };

  componentWillReceiveProps = nextProps => {
    if (
      nextProps.resultBlock &&
      nextProps.resultBlock !== this.props.resultBlock
    )
      if (!nextProps.resultBlock.errorOccurred()) {
        setTimeout(() => this.handleCloseAddClientModal(), 2000);
      }
  };

  render() {
    let {
      addClient,
      resultBlock,
      t,
      children,
      client,
      editClient
    } = this.props;
    let content = children ? (
      <Button mainClass="" onClick={this.handleButtonClick}>
        {children}
      </Button>
    ) : (
      <Button mainClass="add-client-button" onClick={this.handleButtonClick}>
        {t("Add")}
      </Button>
    );
    return (
      <React.Fragment>
        {content}
        <Modal
          open={this.state.showAddClientModal}
          classNames={{ modal: "Modal Modal-add-client" }}
          contentLabel="Client"
          onClose={this.handleCloseAddClientModal}
        >
          <AddClientModal
            addClient={addClient}
            editClient={editClient}
            loading={false}
            resultBlock={resultBlock}
            t={t}
            client={client}
            resetSearchInput={this.props.resetSearchInput}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

export default translate("AddClient")(AddEditClient);
