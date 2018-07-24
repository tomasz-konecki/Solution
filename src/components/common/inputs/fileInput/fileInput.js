import React, { PureComponent } from "react";
import { translate } from "react-translate";
import PropTypes from "prop-types";
import { CSSTransitionGroup } from "react-transition-group";

import Icon from "../../Icon";

import "./fileInput.scss";

class FileInput extends PureComponent {
  state = {
    uploadedFile: null,
    errors: []
  };

  validateInputForm = file => {
    const { allowedFileTypes, t } = this.props;
    let errors = [];
    if (allowedFileTypes && !allowedFileTypes.includes(file.type)) {
      errors.push(t("WrongFileType"));
    }
    if (errors.length === 0) {
      this.setState({ errors: [] });
      return true;
    } else {
      this.setState({ errors: errors });
      return false;
    }
  };

  onFileUpload = event => {
    let file = event.target.files[0];
    if (file && this.validateInputForm(file)) {
      this.setState({ uploadedFile: file });
      this.props.getFile(file);
    } else {
      this.setState({ uploadedFile: null });
      this.props.getFile();
    }
  };

  render() {
    const { t } = this.props;
    const { uploadedFile, errors } = this.state;

    FileInput.propTypes = {
      allowedFileTypes: PropTypes.arrayOf(PropTypes.string)
    };

    FileInput.defaultProps = {
      allowedFileTypes: []
    };

    let classes = errors.length !== 0 ? "file-input-error" : "";

    let error = errors.map((i, index) => {
      return <span key={index}>{i}</span>;
    });

    return (
      <div className="file_input_div">
        <div className="file_input">
          <label className={`file-input-label ${classes}`}>
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
        {/* <div className="file-input-walidation"> */}
        <CSSTransitionGroup
          className="file-input-walidation"
          transitionName="error-validation"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        >
          {error}
        </CSSTransitionGroup>
        {/* </div> */}
      </div>
    );
  }
}
export default translate("FileInput")(FileInput);
