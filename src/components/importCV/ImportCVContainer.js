import React, { Component } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import Icon from "../common/Icon";

import WebApi from "../../api/index";
import LoaderCircular from "../common/LoaderCircular";
import { translate } from "react-translate";

import "./ImportCVContainer.scss";

class ImportCVContainer extends Component {
  constructor() {
    super();
    this.state = {
      accepted: [],
      rejected: [],
      resultBlock: {}
    };
  }

  onImportButtonClick = () => {
    const { accepted } = this.state;

    this.setState({ loading: true });

    const formData = new FormData();

    accepted.map(item => {
      formData.append("files", item);
    });

    WebApi.CvImport.post(formData)
      .then(
        result => (
          console.log(result),
          this.setState({
            loading: false,
            accepted: [],
            resultBlock: {}
          })
        )
      )
      .catch(
        error => (
          console.log(error),
          this.setState({ loading: false, resultBlock: error })
        )
      );
  };

  handleDeleteItem = index => {
    const { accepted } = this.state;

    let _accepted = [...accepted];
    _accepted.splice(index, 1);
    this.setState({ accepted: _accepted });
  };

  render() {
    const { accepted, loading, resultBlock } = this.state;
    const { t } = this.props;

    let lp = 1;

    const items = accepted.map((item, index) => {
      return (
        <div key={index} className="table_row">
          <div className="table_small">
            <div className="table_cell">#</div>
            <div className="table_cell">{lp++}</div>
          </div>
          <div className="table_small">
            <div className="table_cell">{t("Name")}</div>
            <div className="table_cell">
              <a href={item.preview}>{item.name}</a>
            </div>
          </div>
          <div className="table_small">
            <div className="table_cell">{t("Size")}</div>
            <div className="table_cell">{Math.ceil(item.size / 1024)} KB</div>
          </div>
          <div className="table_small">
            <div className="table_cell">{t("LastModifiedDate")}</div>
            <div className="table_cell">
              {item.lastModifiedDate.toLocaleDateString()}
            </div>
          </div>
          <div className="table_small">
            <div className="table_cell">{t("Actions")}</div>
            <div className="table_cell">
              <button onClick={() => this.handleDeleteItem(index)}>
                <Icon
                  additionalClass="icon-danger"
                  icon="times"
                  iconType="fa"
                />
              </button>
            </div>
          </div>
        </div>
      );
    });

    const importButton =
      accepted.length !== 0 ? (
        <div className="import-button-container">
          <button className="dcmt-button" onClick={this.onImportButtonClick}>
            {t("Import")}
          </button>
        </div>
      ) : null;

    return (
      <React.Fragment>
        <div className="import-cv-container content-container">
          {loading && (
            <div className="import-cv-loader">
              <LoaderCircular />
            </div>
          )}
          {!!resultBlock.errorOccurred &&
            !resultBlock.extractData() && (
              <div className="import-cv-loader">{resultBlock.message}</div>
            )}

          <div className="table" id="results">
            <div className="theader">
              <div className="table_header">#</div>
              <div className="table_header">{t("Name")}</div>
              <div className="table_header">{t("Size")}</div>
              <div className="table_header">{t("LastModifiedDate")}</div>
              <div className="table_header">{t("Actions")}</div>
            </div>
            {items}
          </div>

          {importButton}

          <Dropzone
            className="cv-dropzone"
            multiple
            accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onDrop={(accepted, rejected) => {
              this.setState({
                accepted: [...this.state.accepted, ...accepted],
                rejected: rejected
              });
            }}
          >
            <p>{t("DropHere")}</p>
            <p>{t("OnlyDocx")}</p>
            <button style={{ marginTop: "10px" }} className="dcmt-button">
              {t("SelectFiles")}
            </button>
          </Dropzone>
        </div>
      </React.Fragment>
    );
  }
}

export default translate("ImportCVContainer")(ImportCVContainer);
