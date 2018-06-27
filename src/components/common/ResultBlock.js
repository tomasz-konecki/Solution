import React from "react";
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

const shouldRender = (errorOnly, errorStatus) => {
  console.log(errorOnly, errorStatus);
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

  if(errorBlock === undefined || errorBlock === null || errorBlock.original === undefined){
    return null;
  }

  let classes = ["result-block"];
  let errorStatus = errorBlock.replyBlock.status;
  let colorBlock = errorBlock.replyBlock.statusText;

  if(errorStatus !== null || errorStatus !== undefined){
    classes.push("result-error");
  }
  else {
    classes.push("result-success");
  }

  let errorObjects = errorBlock.replyBlock.data.ErrorObjects.length > 0 ? 
    errorBlock.replyBlock.data.ErrorObjects.map((error, i)  => {
      return (
        <li key={i}>
          {error.Model} 
          {error.Errors.serverError}
          {/* <ul>
            {error.Errors.map((childError, x) => {
              return (
                <li key={x}>
                  {childError.serverError}
                </li>
              )
            })}
          </ul> */}
        </li>)
    })
    : null;
  
  return (
    <div className="result-block">
      {shouldRender(errorOnly, errorStatus) && (
        <div>
          <h1 className={classes.join(" ")}><b>{errorStatus}</b> {colorBlock}</h1>
          <p>{errorBlock.message}</p>
          <ul>{errorObjects}</ul>
          <img src="https://starecat.com/content/wp-content/uploads/500-internal-server-error-meanwhile-frontend-developer-cutting-grass-not-worried-about-it.jpg"/>
        </div>
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
