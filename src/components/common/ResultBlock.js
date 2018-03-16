import React from 'react';

const shouldRender = (errorOnly, errorStatus) => {
  if(errorOnly && (errorStatus === false)) return false;
  return true;
};

const ResultBlock = ({errorBlock, errorOnly = true, successMessage = "Operacja wykonana pomyślnie", successCallback, customErrors = {}}) => {
  let classes = ['result-block'];
  let message = successMessage;

  if(errorBlock === undefined || errorBlock === null) return <span/>;

  const { response } = errorBlock;

  if(response === undefined) return <span/>;

  const { status } = response;

  const defaultServerError = "Wewnętrzny błąd serwera";

  const statusHasErrorToClass = {
    true: "result-failure",
    false: "result-success"
  };

  let errorStatus = true;

  const {
    _400 = "Nieprawidłowe dane",
    _401 = "Błąd autoryzacji",
    _403 = "Brak dostępu",
    _404 = "Nie znaleziono ścieżki!",
    _406 = "Nieakceptowalne dane",
    _500 = defaultServerError,
    _501 = "Funkcjonalność jeszcze nie istnieje",
    _502 = defaultServerError,
    _503 = "Serwer niedostępny",
    _504 = "Brak odpowiedzi"
  } = customErrors;

  switch (true) {
    case status > 199 && status < 300:
      message = successMessage;
      errorStatus = false;
      break;
    case status === 400:
      message = _400;
      break;
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
      message = "Nieoczekiwany błąd";
      break;
  }

  if (response.data !== undefined && response.data.errorOccured === true) {
    const { errors } = response.data;
    message = errors[Object.keys(errors)[0]];
    errorStatus = true;
  }

  classes.push(statusHasErrorToClass[errorStatus]);

  if((successCallback !== undefined && successCallback !== null) && (!errorStatus)) {
    successCallback();
  }

  return (
    <span>
      {shouldRender(errorOnly, errorStatus) && <span className={classes.join(" ")}>{message}</span>}
    </span>
  );
};

export default ResultBlock;
