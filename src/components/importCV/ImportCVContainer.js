import React, { Component } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import Icon from "../common/Icon";

import WebApi from "../../api/index";

import "./ImportCVContainer.scss";

export default class ImportCVContainer extends Component {
  constructor() {
    super();
    this.state = {
      accepted: [],
      rejected: []
    };
  }

  onImportButtonClick = () => {
    const { accepted } = this.state;

    const array = accepted.map(item => {
      return item.preview;
    });

    console.log(array);

    let fd = new FormData();
    fd.append("files", array);

    // for (var i = 0; i < accepted.length; i++) {
    //   fd.append("files", accepted[i]);
    // }

    console.log(accepted);
    console.log(fd);
    WebApi.CvImport.post(fd)
      .then(result => console.log(result))
      .catch(error => console.log(error.result));
  };

  handleDeleteItem = index => {
    const { accepted } = this.state;

    let _accepted = [...accepted];
    _accepted.splice(index, 1);
    this.setState({ accepted: _accepted });
  };

  render() {
    const { accepted } = this.state;
    console.log(accepted);

    let lp = 1;

    const items = accepted.map((item, index) => {
      return (
        <div key={index} className="table_row">
          <div className="table_small">
            <div className="table_cell">#</div>
            <div className="table_cell">{lp++}</div>
          </div>
          <div className="table_small">
            <div className="table_cell">Name</div>
            <div className="table_cell">
              <a href={item.preview}>{item.name}</a>
            </div>
          </div>
          <div className="table_small">
            <div className="table_cell">Size</div>
            <div className="table_cell">{item.size / 1024} KB</div>
          </div>
          <div className="table_small">
            <div className="table_cell">Last Modified Date</div>
            <div className="table_cell">
              {item.lastModifiedDate.toLocaleDateString()}
            </div>
          </div>
          <div className="table_small">
            <div className="table_cell">Actions</div>
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
        <button onClick={this.onImportButtonClick}>Import</button>
      ) : null;

    return (
      <React.Fragment>
        <div className="import-cv-container content-container">
          <div className="table" id="results">
            <div className="theader">
              <div className="table_header">#</div>
              <div className="table_header">Name</div>
              <div className="table_header">Size</div>
              <div className="table_header">Last Modified Date</div>
              <div className="table_header">Actions</div>
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
            <p>Drop files here to import. Or use the button bellow.</p>
            <p>Only .doc or .docx files.</p>
            <button>Select files</button>
          </Dropzone>
        </div>
      </React.Fragment>
    );
  }
}
