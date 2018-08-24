import React, { PureComponent } from "react";
import Form from "../../../../form/form";

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
    isLoading: false,
    newInput: false,
    newInputValues: []
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.resultBlockCloud !== nextProps.resultBlockCloud) {
      this.setState({ isLoading: false }),
        nextProps.resultBlockCloud.statusCode &&
          nextProps.resultBlockCloud.statusCode() === 200 &&
          setTimeout(() => {
            this.props.handleCloudAddCloseModal();
          }, 3000);
    }
  }

  handleAddInput = () => {
    const { newInputValues } = this.state;

    this.setState({
      newInput: true,
      newInputValues: [...newInputValues, { name: "", content: "" }]
    });
  };

  handleChangeInput = (e, index) => {
    const { newInputValues } = this.state;
    const { className: inputClass, value: inputValue } = e.target;

    let inputValues = this.state.newInputValues;

    inputValues[index] = {
      name: inputClass === "label" ? inputValue : newInputValues[index].name,
      content:
        inputClass === "value" ? inputValue : newInputValues[index].content
    };

    this.setState({ newInputValues: inputValues }, () => this.forceUpdate());
  };

  addCloudHandler = () => {
    const { handleAddCloud, handleEditCloud, clientId, item } = this.props;
    const { addCloudToClientFormItems, newInputValues } = this.state;
    this.setState({ isLoading: true }),
      item
        ? handleEditCloud(
            item.id,
            addCloudToClientFormItems[0].value,
            newInputValues,
            item.clientId
          )
        : handleAddCloud(
            this.state.addCloudToClientFormItems[0].value,
            newInputValues,
            clientId
          );
  };

  render() {
    const { t, resultBlockCloud, item } = this.props;
    const {
      addCloudToClientFormItems,
      isLoading,
      newInput,
      newInputValues
    } = this.state;

    let newInputContent = newInput
      ? newInputValues.map((item, index) => {
          return (
            <div key={index}>
              <section className="new-section-input">
                <label>{t("NewInputLabel")}</label>
                <input
                  className="label"
                  value={item.name}
                  onChange={e => this.handleChangeInput(e, index)}
                />
              </section>
              <section className="new-section-input">
                <label>{t("NewInputValue")}</label>
                <input
                  className="value"
                  value={item.content}
                  onChange={e => this.handleChangeInput(e, index)}
                />
              </section>
            </div>
          );
        })
      : null;
    return (
      <div className="add-client-container">
        <header>
          <h3 className="section-heading">
            {item ? t("EditCloud") : t("AddCloud")}
          </h3>
        </header>

        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "90%"
          }}
        >
          <Form
            btnTitle={item ? t("Save") : t("Add")}
            shouldSubmit={true}
            onSubmit={this.addCloudHandler}
            isLoading={isLoading}
            formItems={addCloudToClientFormItems}
            submitResult={{
              status:
                resultBlockCloud && resultBlockCloud.errorOccurred
                  ? !resultBlockCloud.errorOccurred()
                    ? true
                    : false
                  : null,
              content:
                resultBlockCloud && resultBlockCloud.errorOccurred
                  ? !resultBlockCloud.errorOccurred()
                    ? item
                      ? t("CloudEdited")
                      : t("CloudAdded")
                    : resultBlockCloud &&
                      resultBlockCloud.getMostSignificantText()
                  : null
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            marginTop: "60px",
            width: "100%",
            textAlign: "center"
          }}
        >
          {newInputContent}
          <button
            disabled={newInputValues.length >= 3}
            onClick={this.handleAddInput}
            className="dcmt-button"
          >
            {t("AddInput")}
          </button>
        </div>
      </div>
    );
  }
}

AddCloudModal.defaultProps = {
  resultBlockCloud: {}
};

export default AddCloudModal;
