import React from "react";
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

const shouldRender = (errorOnly, errorStatus) => {
  if (errorOnly && errorStatus === false) return false;
  return true;
};

const ResultBlock = ({
  t,
  errorBlock,
  errorOnly = true,
  successMessage = t("OperationSuccessful"),
  successCallback,
  customErrors = {}
}) => {

  if(errorBlock === undefined || errorBlock.original === undefined){
    return null;
  }

  let classes = ["result-block"];
  let errorStatus = errorBlock.errorOccurred();
  let colorBlock = errorBlock.colorBlock();

  if(errorStatus){
    classes.push("result-error");
    colorBlock.text = errorBlock.getMostSignificantErrorText();
  }
  else {
    classes.push("result-success");
    colorBlock.text = successMessage;
  }
  let styleBlock = {
    color: colorBlock.color
  };

  console.log('shouldRender', shouldRender(errorOnly, errorStatus), colorBlock, styleBlock);

  return (
    <span>
      {shouldRender(errorOnly, errorStatus) && (
        <span style={styleBlock} className={classes.join(" ")}>{colorBlock.text}</span>
      )}
    </span>
  );
};

ResultBlock.propTypes = {
  errorBlock: PropTypes.object,
  errorOnly: PropTypes.bool,
  successMessage: PropTypes.string,
  successCallback: PropTypes.func,
  customErrors: PropTypes.object
};

export default translate("ResultBlock")(ResultBlock);
