import React, { PureComponent } from "react";

class AddCloudModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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
      ]
    };
  }
  render() {
    const { t } = this.props;
    return (
      <div className="add-client-container">
        <header>
          <h3 className="section-heading">{t("AddCloud")}</h3>
        </header>
        {/* <IntermediateBlock
              loaded={true}
              render={() => this.pullDOM(addClient, t, $imagePreview)}
              resultBlock={resultBlock}
              spinner="Cube"
            />
            {info} */}
      </div>
    );
  }
}

export default AddCloudModal;
