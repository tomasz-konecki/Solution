import React from "react";
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

const shouldRender = (errorOnly, errorStatus) => {
  if (errorOnly && errorStatus === false) return false;
  return true;
};

const ResultBlock = ({
  t,
  type,
  errorBlock,
  errorOnly = true,
  successMessage = t("OperationSuccessful"),
  errorMessage,
  successCallback,
  customErrors = {}
}) => {
  if (errorBlock === undefined || errorBlock === null || errorBlock.original === undefined) {
    return null;
  }

  let classes = type === "modalInParent" ? ['result-block-modal-in-parent'] : ["result-block"];

  let errorStatus = errorBlock.replyBlock.status;
  let errorStatusMessage = errorBlock.replyBlock.statusText.replace(/ /g, '');
  let errorImg = null;
  let errorStatusContent = null;

  let errorObjects = (errorBlock.replyBlock.data.ErrorObjects !== undefined && errorBlock.replyBlock.data.ErrorObjects !== null) ?
    errorBlock.replyBlock.data.ErrorObjects :
    (errorBlock.replyBlock.data.errorObjects !== undefined && errorBlock.replyBlock.data.errorObjects !== null) ?
      errorBlock.replyBlock.data.errorObjects : [];

  let errorObjectsList = errorObjects.length > 0 ?
    errorObjects.map((error, i) => {
      let key = Object.keys(error.errors);
      return (
        <li key={i}>          
          <span>{error.errors[key[0]]}</span>
        </li>)
    })
    : null;

  switch (errorStatus) {
    case 500:
      errorImg = <img src="https://starecat.com/content/wp-content/uploads/500-internal-server-error-meanwhile-frontend-developer-cutting-grass-not-worried-about-it.jpg" />
      break;
    default:
      errorImg = null;
      break;
  }

  if (errorStatus !== null || errorStatus !== undefined) {
    if (errorStatus !== 200) {
      type === "modalInParent" ? classes.push("modal-result-error") : classes.push("result-error");;

      errorStatusContent = (errorMessage === null || errorMessage === undefined) ? (
        <div>
          <b>{t("Error")}:</b>
          <p>{errorBlock.message}</p>
          <ul>{errorObjectsList}</ul>
          {errorImg}
        </div>
      ) : (
          <p>{errorMessage}</p>
        )
    }
    else {
      type === "modalInParent" ? classes.push("modal-result-success") : classes.push("result-success");;
      errorStatusContent = <p>{successMessage}</p>
    }
  }

  return (
    <div className={classes.join(" ")}>
      {shouldRender(errorOnly, errorStatus) && (
        errorStatusContent
      )}
    </div>
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
