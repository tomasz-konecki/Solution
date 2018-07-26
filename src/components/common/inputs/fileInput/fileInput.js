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

  checkImageAspectRatio = (imageDimensions, aspectRatioDifference) => {
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
        resolve("");
      }
    });
  };

  setStateIfError = (error, resolve) => {
    if (error.length === 0) {
      console.log("zwaracam true");
      this.setState({ error: "", errorStatus: true }), () => resolve();
      // return true;
    } else {
      console.log("zwracam falses");
      this.setState({ error, errorStatus: false }), () => resolve();
      // return false;
    }
  };

  validateInputForm = file => {
    return new Promise(resolve => {
      const {
        allowedFileTypes,
        maxFileSize,
        aspectRatioDifference,
        t
      } = this.props;
      let error = "";
      if (allowedFileTypes && !allowedFileTypes.includes(file.type)) {
        error = t("WrongFileType");
      }
      if (maxFileSize && file.size > maxFileSize) {
        error = t("FileIsTooBig");
      }

      if (file.type.includes("image") && aspectRatioDifference) {
        this.getImageDimensions(file).then(imageDimensions => {
          this.checkImageAspectRatio(
            imageDimensions,
            aspectRatioDifference
          ).then(resolvedError => {
            this.setStateIfError(resolvedError, resolve);
          });
        });
      } else {
        this.setStateIfError(error, resolve);
      }
    });
  };

  onFileUpload = event => {
    let file = event.target.files[0];
    console.log(file);
    return new Promise(resolve => {
      this.validateInputForm(file).then(
        setTimeout(() => {
          resolve(this.state.errorStatus);
        }, 2000)
      );
    }).then(errorStatusFromResolve => {
      console.log(errorStatusFromResolve);
      if (file && this.validateInputForm(file)) {
        this.setState({ uploadedFile: file });
        this.props.getFile(file);
      } else {
        this.setState({ uploadedFile: null });
        this.props.getFile();
      }
    });
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
