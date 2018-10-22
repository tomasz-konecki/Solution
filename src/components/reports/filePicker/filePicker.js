import React from "react";
import SmallSpinner from '../../common/spinner/small-spinner';
import Button from '../../common/button/button';
import { translate } from 'react-translate';
const filePicker = ({handleAddFile, fileToUpload, isUploadingFile, uploadFile, t}) => {
  return (
    <div className="file-picker">
      <input
        type="file"
        placeholder={t("SelectFileToAdd")}
        id="upload"
        onChange={handleAddFile}
      />

      {fileToUpload && (
        <Button
          disable={isUploadingFile}
          onClick={uploadFile}
          title={t("Send")}
          mainClass="generate-raport-btn btn-green"
        >
          {isUploadingFile && <SmallSpinner />}
        </Button>
      )}
    </div>
  );
};

export default translate("FilePicker")(filePicker);
