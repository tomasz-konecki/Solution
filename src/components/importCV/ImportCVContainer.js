import React, { Component } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import Icon from "../common/Icon";

import WebApi from "../../api/index";
import LoaderCircular from "../common/LoaderCircular";
import ConfirmModal from "../common/confimModal/confirmModal";
import { translate } from "react-translate";

import "./ImportCVContainer.scss";

class ImportCVContainer extends Component {
  constructor() {
    super();
    this.state = {
      accepted: [],
      rejected: [],
      duplicated: [],
      resultBlock: {},
      confirmImportModalOpen: false
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
      .then(result =>
        this.setState({
          loading: false,
          resultBlock: result.extractData()
        })
      )
      .catch(error => this.setState({ loading: false, resultBlock: error }));
  };

  handleDeleteItem = index => {
    const { accepted, resultBlock } = this.state;

    let _accepted = [...accepted];
    let _resultBlock = JSON.parse(JSON.stringify(resultBlock));
    if(resultBlock.result && resultBlock.result.length !== 0){
      _resultBlock.result.splice(index, 1);
    }
    _accepted.splice(index, 1);
    this.setState({ accepted: _accepted, resultBlock: _resultBlock });
  };

  importFilesValidation = (importAccepted, importRejected) => {
      const { accepted, rejected, duplicated, resultBlock } = this.state;
      const uniqueFiles = [];
      const duplicatedFiles = [];

      if(accepted && accepted.length !== 0)
      {
        if(resultBlock.result && resultBlock.result.length !== 0){
          console.log("elo")
          this.setState({ resultBlock: {}, accepted: importAccepted });
        }

        importAccepted.map((x) => 
          accepted.some(z => z.name == x.name) ? duplicatedFiles.push(x) : uniqueFiles.push(x)
        );
        importAccepted = uniqueFiles;
      }

      if(duplicatedFiles.length !== 0){
        this.setState({
          confirmImportModalOpen: true
        });
      }

      this.setState({
        accepted: [...accepted, ...importAccepted],
        rejected: [...rejected, ...importRejected],
        duplicated: [...duplicated, ...duplicatedFiles]
      });
  }

  replaceWithImportedFiles(){
    const { duplicated } = this.state;
    const accepted = [...this.state.accepted];

    duplicated.forEach(function(part){
      const index = accepted.findIndex(i => i.name === part.name);
      accepted.splice(index, 1, part);
    });

    this.setState({ confirmImportModalOpen: false, accepted, duplicated: [] });
  }

  render() {
    console.log(this.state);
    const { accepted, loading, resultBlock } = this.state;
    const { t } = this.props;
    let lp = 1;

    const items = accepted.map((item, index) => {
      lp++;
      const rowClass = resultBlock.result
        ? resultBlock.result[lp - 2]
          ? resultBlock.result[lp - 2].result.includes("pomyślnie") || resultBlock.result[lp - 2].result.includes("successfully")
            ? "import_succes"
            : resultBlock.result[lp - 2].result.includes("Not imported") || resultBlock.result[lp - 2].result.includes("Nie zaimportowano") ? "import_fail" : "import_partially"
          : ""
        : "";

      return (
        <div className="table_item" key={index}>
          <div className={`table_row  ${rowClass}`}>
            <div className="table_small">
              <div className="table_cell">#</div>
              <div className="table_cell">{lp - 1}</div>
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
          {resultBlock.result &&
            resultBlock.result[lp - 2] && (
              <div className="table_row">
                <div className="table_result" />
                <div className="table_small">
                  <div className="table_cell">{t("Result")}</div>
                  <div className="table_cell">
                    {resultBlock.result[lp - 2].result}
                  </div>
                </div>
                <div className="table_result" />
                <div className="table_result" />
                <div className="table_result" />
              </div>
            )}
        </div>
      );
    });

    const importButton =
      accepted.length !== 0 ? (
        <div className="import-button-container">
          <button className="dcmt-button" onClick={this.onImportButtonClick}>
            {t("Import")}
          </button>

          {resultBlock.result && (
            <div className="import-details-container">
              <span>
                {t("Imported")} {resultBlock.successfullyAddedFilesCount}/
                {resultBlock.totalFilesCount}
              </span>
            </div>
          )}
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
            onDrop={(accepted, rejected) => this.importFilesValidation(accepted, rejected)}
          >
            <p>{t("DropHere")}</p>
            <p>{t("OnlyDocx")}</p>
            <button style={{ marginTop: "10px" }} className="dcmt-button">
              {t("SelectFiles")}
            </button>
          </Dropzone>
        </div>

        <ConfirmModal
        open={this.state.confirmImportModalOpen}
        content="Delete project modal"
        onClose={() =>
          this.setState({
            confirmImportModalOpen: !this.state.confirmImportModalOpen,
            duplicated: []
          })
        }
        header={"Niektóre wybrane pliki się powtarzają, wybierz co chcesz z nimi zrobić"}
        operationName={"Zastąp"}
        denyName={"Ignoruj"}
        operation={() =>
          this.replaceWithImportedFiles()
        }
        />
      </React.Fragment>
    );
  }
}

export default translate("ImportCVContainer")(ImportCVContainer);
