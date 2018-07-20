import React from "react";
import SmallSpinner from '../../common/spinner/small-spinner';
import Button from '../../common/button/button';
const filePicker = ({handleAddFile, fileToUpload, isUploadingFile, uploadFile}) => {
  return (
    <div className="file-picker">
      <input
        type="file"
        placeholder="wybierz plik do dodania..."
        id="upload"
        onChange={handleAddFile}
      />

      {fileToUpload && (
        <Button
          onClick={uploadFile}
          title="Prześlij"
          mainClass="generate-raport-btn btn-green"
        >
          {isUploadingFile && <SmallSpinner />}
        </Button>
      )}
    </div>
  );
};

export default filePicker;
