import React, { PureComponent } from "react";
import Form from "../../../../form/form";
import IntermediateBlock from "../../../../common/IntermediateBlock";
import PropTypes from "prop-types";

const populateValue = item => {
  let value = "";
  for (let i = 0; i < item.length; i++) {
    value += item.charAt(i);
  }
  return value;
};

class AddCloudModal extends PureComponent {
  state = {
    addCloudToClientFormItems: [
      {
        title: this.props.t("CloudName"),
        name: "cloudName",
        type: "text",
        placeholder: `${this.props.t("Insert")} ${this.props.t("CloudName")}`,
        mode: "text",
        value: this.props.item ? populateValue(this.props.item.name) : "",
        error: "",
        canBeNull: false,
        minLength: 2,
        maxLength: 20,
        inputType: "name"
      }
    ],
    isLoading: false
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.resultBlockCloud !== nextProps.resultBlockCloud) {
      this.setState({ isLoading: false }),
        nextProps.resultBlockCloud &&
          nextProps.resultBlockCloud.statusCode() === 200 &&
          setTimeout(() => {
            this.props.handleCloudAddCloseModal();
          }, 3000);
    }
  }

  addCloudHandler = () => {
    const { handleAddCloud, handleEditCloud, clientId, item } = this.props;
    const { addCloudToClientFormItems } = this.state;
    this.setState({ isLoading: true }),
      item
        ? handleEditCloud(
            item.id,
            addCloudToClientFormItems[0].value,
            item.clientId
          )
        : handleAddCloud(
            this.state.addCloudToClientFormItems[0].value,
            clientId
          );
  };

  render() {
    const { t, resultBlockCloud, item } = this.props;
    const { addCloudToClientFormItems, isLoading } = this.state;
    return (
      <div className="add-client-container">
        <header>
          <h3 className="section-heading">
            {item ? t("EditCloud") : t("AddCloud")}
          </h3>
        </header>

        <Form
          btnTitle={item ? t("Save") : t("Add")}
          shouldSubmit={true}
          onSubmit={this.addCloudHandler}
          isLoading={isLoading}
          formItems={addCloudToClientFormItems}
          submitResult={{
            status: resultBlockCloud
              ? !resultBlockCloud.errorOccurred()
                ? true
                : false
              : null,
            content: resultBlockCloud
              ? !resultBlockCloud.errorOccurred()
                ? item
                  ? t("CloudEdited")
                  : t("CloudAdded")
                : resultBlockCloud && resultBlockCloud.getMostSignificantText()
              : null
          }}
        />
      </div>
    );
  }
}

AddCloudModal.defaultProps = {
  resultBlockCloud: null
};

export default AddCloudModal;
