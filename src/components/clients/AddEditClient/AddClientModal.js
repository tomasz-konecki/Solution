import React, { Component } from "react";
import Button from "../../common/button/button";
import { validateInput } from "../../../services/validation";
import IntermediateBlock from "../../common/IntermediateBlock";

import "../../../scss/components/clients/addClient/addClientModal.scss";
import BilleniumPleaceholder from "assets/img/small-logo.png";
import FileInput from "components/common/inputs/fileInput/fileInput";
import SmallSpinner from "../../common/spinner/small-spinner";

class AddClientModal extends Component {
  state = {
    inputValue: {
      clientName: "",
      clientDescription: ""
    },
    inputError: {
      clientName: "",
      clientDescription: ""
    },
    file: "",
    imagePreviewUrl: "",
    isFormValid: false,
    loading: false
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.resultBlock !== this.props.resultBlock) {
      this.setState({ loading: false });
    }
  };

  componentDidMount = () => {
    const { client } = this.props;
    if (this.props.client) {
      this.setState({
        inputValue: {
          clientName: client.name,
          clientDescription: client.description ? client.description : ""
        },
        imagePreviewUrl: client.path
          ? "http://10.255.20.241/ClientsPictures/" + client.path
          : null
      });
    }
  };

  makeFormValid = inputError => {
    !inputError.clientName && !inputError.clientDescription
      ? this.setState({
          isFormValid: true
        })
      : null;
  };

  handleInputChange = e => {
    e.preventDefault();
    let value = e.target.value;
    let { inputError, inputValue } = this.state;

    let error =
      e.target.name === "clientName"
        ? validateInput(value, false, 3, 20, "name", this.props.t("ClientName"))
        : e.target.name === "clientDescription"
          ? validateInput(
              value,
              true,
              null,
              50,
              "name",
              this.props.t("ClientDescription")
            )
          : null;

    this.setState(
      {
        inputValue: { ...inputValue, [e.target.name]: value },
        inputError: { ...inputError, [e.target.name]: error },
        isFormValid: false
      },
      () => this.makeFormValid(this.state.inputError)
    );
  };

  handleAddClientButtonClick = e => {
    e.preventDefault();
    const { file, inputValue } = this.state;
    let fd = new FormData();
    fd.append("Name", inputValue.clientName);
    {
      file && fd.append("File", file);
    }
    fd.append("Description", inputValue.clientDescription);

    if (this.props.editClient) {
      this.props.editClient(this.props.client.id, fd);
    } else {
      this.setState({ loading: true });
      this.props.addClient(fd);
    }
  };

  getFileHandler = file => {
    if (file) {
      let reader = new FileReader();

      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    } else {
      this.setState({
        file: null,
        imagePreviewUrl: null
      });
    }
  };

  pullDOM = (addClient, t, $imagePreview) => {
    const { loading } = this.state;
    return (
      <form>
        <div className="add-client-container-left">
          <div className="group">
            <label htmlFor="clientName">{t("ClientName")}</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              autoComplete="off"
              required
              value={this.state.inputValue.clientName}
              className={
                this.state.inputError.clientName && "add-client-input-error"
              }
              onChange={this.handleInputChange}
            />
            {this.state.inputError.clientName &&
              this.state.inputError.clientName}

            <label htmlFor="clientDescription">{t("ClientDescription")}</label>
            <textarea
              type="text"
              id="clientDescription"
              name="clientDescription"
              autoComplete="off"
              value={this.state.inputValue.clientDescription}
              onChange={textarea => this.handleInputChange(textarea)}
            />
            {this.state.inputError.clientDescription &&
              this.state.inputError.clientDescription}
          </div>
          <Button
            disable={!this.state.isFormValid}
            onClick={e => this.handleAddClientButtonClick(e)}
            mainClass="dcmt-button"
          >
            {editClient ? t("Save") : t("AddClient")}
          </Button>
          {loading && <SmallSpinner />}
        </div>
        <div className="add-client-container-right">
          <div className="add-client-container-right-image-holder">
            {$imagePreview}
          </div>
          <FileInput
            allowedFileTypes={["image/jpeg", "image/png"]}
            getFile={this.getFileHandler}
          />
        </div>
      </form>
    );
  };

  render() {
    let { imagePreviewUrl } = this.state;
    let { addClient, loading, resultBlock, t } = this.props;
    let info = null;

    if (resultBlock) {
      if (resultBlock.replyBlock.status === 200) {
        info = (
          <div className="user-added-success">
            <span>{t("ClientAddedSuccess")}</span>
          </div>
        );
      }
    }
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = <img src={imagePreviewUrl} alt="Client Logo" />;
    } else {
      $imagePreview = (
        <img src={BilleniumPleaceholder} alt="Billenium Placeholder" />
      );
    }

    return (
      <div className="add-client-container">
        <header>
          <h3 className="section-heading">{t("AddClient")}</h3>
        </header>
        <IntermediateBlock
          loaded={true}
          render={() => this.pullDOM(addClient, t, $imagePreview)}
          resultBlock={resultBlock}
          spinner="Cube"
        />
        {info}
      </div>
    );
  }
}

export default AddClientModal;
