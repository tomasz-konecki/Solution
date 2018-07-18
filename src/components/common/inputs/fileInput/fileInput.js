import React, { PureComponent } from "react";
import { translate } from "react-translate";
import PropTypes from "prop-types";

import Icon from "../../Icon";

import "./fileInput.scss";

class FileInput extends PureComponent {
  state = {
    uploadedFile: null
  };

  onFileUpload = event => {
    let file = event.target.files[0];
    this.setState({ uploadedFile: file });
  };

  validation = isFormInputValid => {
    console.log(this.state.validate);

    isFormInputValid
      ? this.setState({ validate: true })
      : this.setState({ validate: false });
  };

  render() {
    const { t, type } = this.props;
    const { uploadedFile } = this.state;

    FileInput.propTypes = {
      type: PropTypes.string
    };

    FileInput.defaultProps = {
      type: null
    };

    let wrongFileType =
      uploadedFile && type && uploadedFile.type !== type
        ? t("WrongFileType")
        : null;

    return (
      <div className="file_input_div">
        <div className="file_input">
          <label className="file-input-label">
            <Icon icon="upload" />
            <input
              id="file_input_file"
              className="none"
              type="file"
              onChange={this.onFileUpload}
            />
            <span>
              {uploadedFile && uploadedFile.name
                ? uploadedFile.name
                : t("ChooseFile") + `...`}
            </span>
          </label>
        </div>
        <div className="file-input-walidation">{wrongFileType}</div>
      </div>
    );
  }
}
export default translate("FileInput")(FileInput);
