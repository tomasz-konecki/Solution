import React, { PureComponent } from "react";
import Form from "../../../../form/form";
import IntermediateBlock from "../../../../common/IntermediateBlock";

class AddCloudModal extends PureComponent {
  state = {
    addCloudToClientFormItems: [
      {
        title: this.props.t("CloudName"),
        name: "cloudName",
        type: "text",
        placeholder: this.props.t("InsertCloudName"),
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
      console.log("Zmieniam na fgalse");
      this.setState({ isLoading: false });
    }
  }

  addCloudHandler = () => {
    const { handleAddCloud, clientId } = this.props;
    this.setState({ isLoading: true }),
      handleAddCloud(this.state.addCloudToClientFormItems[0].value, clientId);
  };

  pullDOM = () => {
    const { t } = this.props;
    const { addCloudToClientFormItems, isLoading } = this.state;

    return (
      <Form
        btnTitle={t("Add")}
        shouldSubmit={true}
        onSubmit={this.addCloudHandler}
        isLoading={isLoading}
        formItems={addCloudToClientFormItems}
      />
    );
  };

  render() {
    const { t, resultBlockCloud } = this.props;
    console.log(resultBlockCloud);
    return (
      <div className="add-client-container">
        <header>
          <h3 className="section-heading">{t("AddCloud")}</h3>
        </header>

        <IntermediateBlock
          loaded={true}
          render={() => this.pullDOM()}
          resultBlock={resultBlockCloud}
          spinner="Cube"
        />
      </div>
    );
  }
}

export default AddCloudModal;
