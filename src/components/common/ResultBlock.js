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
  let classes = ["result-block"];
  let message = successMessage;

  if (errorBlock === undefined || errorBlock === null) return <span />;

  const { response } = errorBlock;

  if (response === undefined) return <span />;

  const { status } = response;

  const defaultServerError = t("InternalServerError");

  const statusHasErrorToClass = {
    true: "result-failure",
    false: "result-success"
  };

  let errorStatus = true;

  const {
    _400 = t("BadRequest"),
    _401 = t("Unauthorized"),
    _403 = t("Forbidden"),
    _404 = t("NotFound"),
    _406 = t("NotAcceptable"),
    _500 = defaultServerError,
    _501 = t("NotImplemented"),
    _502 = defaultServerError,
    _503 = t("ServiceUnavailable"),
    _504 = t("GatewayTimeout")
  } = customErrors;

  switch (true) {
    case (status > 199) && (status < 300):
      message = successMessage;
      errorStatus = false;
      break;
    case status === 400: {
      let _keys = Object.keys(response.data.errors);

      message = response.data.errors[_keys[0]];
      break;
    }
    case status === 401:
      message = _401;
      break;
    case status === 403:
      message = _403;
      break;
    case status === 404:
      message = _404;
      break;
    case status === 406:
      message = _406;
      break;
    case status === 500:
      message = _500;
      break;
    case status === 501:
      message = _501;
      break;
    case status === 502:
      message = _502;
      break;
    case status === 503:
      message = _503;
      break;
    case status === 504:
      message = _504;
      break;
    default:
      message = t("UnexpectedError");
      break;
  }

  if (response.data !== undefined && response.data.errorOccured === true) {
    const { errors } = response.data;
    message = errors[Object.keys(errors)[0]];
    errorStatus = true;
  }

  classes.push(statusHasErrorToClass[errorStatus]);

  if (
    successCallback !== undefined &&
    successCallback !== null &&
    !errorStatus
  ) {
    successCallback();
  }

  return (
    <span>
      {shouldRender(errorOnly, errorStatus) && (
        <span className={classes.join(" ")}>{message}</span>
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
