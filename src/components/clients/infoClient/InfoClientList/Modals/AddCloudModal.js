import React, { PureComponent } from "react";
import Form from "../../../../form/form";
import IntermediateBlock from "../../../../common/IntermediateBlock";
import PropTypes from "prop-types";

class AddCloudModal extends PureComponent {
  state = {
    addCloudToClientFormItems: [
      {
        title: this.props.t("CloudName"),
        name: "cloudName",
        type: "text",
        placeholder: `${this.props.t("Insert")} ${this.props.t("CloudName")}`,
        mode: "text",
        value: "",
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
    const { handleAddCloud, clientId } = this.props;
    this.setState({ isLoading: true }),
      handleAddCloud(this.state.addCloudToClientFormItems[0].value, clientId);
  };

  render() {
    const { t, resultBlockCloud } = this.props;
    const { addCloudToClientFormItems, isLoading } = this.state;

    return (
      <div className="add-client-container">
        <header>
          <h3 className="section-heading">{t("AddCloud")}</h3>
        </header>

        <Form
          btnTitle={t("Add")}
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
                ? t("CloudAdded")
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
