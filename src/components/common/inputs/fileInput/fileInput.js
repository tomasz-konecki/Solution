import React, { PureComponent } from "react";
import { translate } from "react-translate";
import PropTypes from "prop-types";
import { CSSTransitionGroup } from "react-transition-group";

import Icon from "../../Icon";

import "./fileInput.scss";

class FileInput extends PureComponent {
  state = {
    uploadedFile: null,
    error: ""
  };

  getImageDimensions = file => {
    return new Promise(resolve => {
      const _URL = window.URL || window.webkitURL;
      let img = new Image();

      img.onload = function() {
        resolve({ imageHeight: this.height, imageWidth: this.width });
      };
      img.onerror = () => {
        resolve();
      };
      img.src = _URL.createObjectURL(file);
    });
  };

  checkImageAspectRatio = (imageDimensions, aspectRatioDifference, error) => {
    return new Promise((resolve, reject) => {
      let width = Math.round(
        imageDimensions.imageWidth / imageDimensions.imageHeight
      );
      let height = Math.round(
        imageDimensions.imageHeight / imageDimensions.imageWidth
      );
      let difference = Math.abs(width - height);

      if (difference > aspectRatioDifference) {
        resolve(this.props.t("WrongAspectRatio"));
      } else {
        resolve(error);
      }
    });
  };

  setStateIfError = (error, file) => {
    if (error.length === 0) {
      this.setState({ uploadedFile: file, error: "" });
      this.props.getFile(file);
    } else {
      this.setState({ uploadedFile: null, error });
      this.props.getFile();
    }
  };

  validateInputForm = file => {
    const {
      allowedFileTypes,
      maxFileSize,
      aspectRatioDifference,
      t
    } = this.props;
    let error = "";

    if (maxFileSize && file.size > maxFileSize) {
      error = t("FileIsTooBig");
    }
    if (allowedFileTypes && !allowedFileTypes.includes(file.type)) {
      error = t("WrongFileType");
    }

    if (file.type.includes("image") && aspectRatioDifference) {
      this.getImageDimensions(file).then(imageDimensions => {
        this.checkImageAspectRatio(
          imageDimensions,
          aspectRatioDifference,
          error
        ).then(resolvedError => {
          this.setStateIfError(resolvedError, file);
        });
      });
    } else {
      return this.setStateIfError(error, file);
    }
  };

  onFileUpload = event => {
    let file = event.target.files[0];

    file && this.validateInputForm(file);
  };

  render() {
    const { t } = this.props;
    const { uploadedFile, error } = this.state;

    let classes = error.length !== 0 ? "file-input-error" : "";

    let errorJsx = error && <span>{error}</span>;

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
          {errorJsx}
        </CSSTransitionGroup>
        {/* </div> */}
      </div>
    );
  }
}

FileInput.propTypes = {
  allowedFileTypes: PropTypes.arrayOf(PropTypes.string),
  aspectRatioDifference: PropTypes.number,
  maxFileSize: PropTypes.number.isRequired
};

FileInput.defaultProps = {
  allowedFileTypes: []
};

export default translate("FileInput")(FileInput);
