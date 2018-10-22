import React, { Component } from "react";
import Button from "../../common/button/button";
import { validateInput } from "../../../services/validation";
import IntermediateBlock from "../../common/IntermediateBlock";
import { CSSTransitionGroup } from "react-transition-group";
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

  makeFormValid = () => {
    const { inputError, inputValue } = this.state;
    inputValue.clientName !== "" &&
    !inputError.clientName &&
    !inputError.clientDescription
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
        ? validateInput(value, false, 3, 50, "name", this.props.t("ClientName"))
        : e.target.name === "clientDescription"
          ? validateInput(
              value,
              true,
              3,
              200,
              "name",
              this.props.t("ClientDescription")
            )
          : null;

    let errorItem = error ? <span key={[e.target.name]}>{error}</span> : null;
    this.setState(
      {
        inputValue: { ...inputValue, [e.target.name]: value },
        inputError: {
          ...inputError,
          [e.target.name]: errorItem
        },
        isFormValid: false
      },
      () => this.makeFormValid()
    );
  };

  handleAddClientButtonClick = e => {
    e.preventDefault();
    this.setState({ loading: true, isFormValid: false });

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
      this.props.addClient(fd);
    }
    this.props.resetSearchInput();
  };

  getFileHandler = file => {
    if (file) {
      let reader = new FileReader();

      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        }),
          this.makeFormValid();
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
    const { loading, inputError } = this.state;
    return (
      <form>
        <div className="add-client-container-left">
          <div className="group">
            <label htmlFor="clientName">{t("ClientName")}</label>
            <input
              style={{ height: "unset !important" }}
              type="text"
              id="clientName"
              name="clientName"
              autoComplete="off"
              required
              value={this.state.inputValue.clientName}
              className={inputError.clientName && "add-client-input-error"}
              onChange={this.handleInputChange}
            />
            <CSSTransitionGroup
              transitionName="error-validation"
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={1000}
            >
              {this.state.inputError.clientName &&
                inputError.clientName.props.children &&
                this.state.inputError.clientName}
            </CSSTransitionGroup>

            <label htmlFor="clientDescription">{t("ClientDescription")}</label>
            <textarea
              style={{ resize: "vertical", maxHeight: "120px" }}
              type="text"
              id="clientDescription"
              name="clientDescription"
              autoComplete="off"
              className={
                inputError.clientDescription && "add-client-input-error"
              }
              value={this.state.inputValue.clientDescription}
              onChange={textarea => this.handleInputChange(textarea)}
            />

            <CSSTransitionGroup
              transitionName="error-validation"
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={1000}
            >
              {inputError.clientDescription &&
                inputError.clientDescription.props.children &&
                inputError.clientDescription}
            </CSSTransitionGroup>
          </div>
          <Button
            disable={!this.state.isFormValid}
            onClick={e => this.handleAddClientButtonClick(e)}
            mainClass="dcmt-button"
          >
            {this.props.editClient ? t("Save") : t("Add")}
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
            maxFileSize={1048576}
            aspectRatioDifference={1}
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
          <CSSTransitionGroup
            transitionName="example"
            transitionAppear={true}
            transitionAppearTimeout={1000}
            transitionEnter={false}
            transitionLeave={false}
          >
            <div className="user-added-success">
              <span>
                {this.props.editClient
                  ? t("ClientEditedSuccess")
                  : t("ClientAddedSuccess")}
              </span>
            </div>
          </CSSTransitionGroup>
        );
      }
    }
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <img
          src={imagePreviewUrl}
          alt="Client Logo"
          onError={e => {
            e.target.src = BilleniumPleaceholder;
          }}
        />
      );
    } else {
      $imagePreview = (
        <img src={BilleniumPleaceholder} alt="Billenium Placeholder" />
      );
    }

    return (
      <div className="add-client-container">
        <header>
          <h3 className="section-heading">
            {this.props.editClient ? t("Edit") : t("Add")} {t("Client")}
          </h3>
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
