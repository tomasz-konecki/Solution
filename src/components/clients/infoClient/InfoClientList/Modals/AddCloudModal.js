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
        canBeNull: false
      }
    ],
    isLoading: false
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.resultBlockCloud !== nextProps.resultBlockCloud) {
      this.setState({ isLoading: false });
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
            status: resultBlockCloud && !resultBlockCloud.errorOccurred,
            content:
              resultBlockCloud && resultBlockCloud.errorOccurred
                ? "BACKEND PROBLEM"
                : "WORKING"
          }}
        />

        <IntermediateBlock
          loaded={true}
          render={() => {
            return null;
          }}
          resultBlock={resultBlockCloud}
          spinner="Cube"
        />
      </div>
    );
  }
}

AddCloudModal.defaultProps = {
  resultBlockCloud: null
};

export default AddCloudModal;
