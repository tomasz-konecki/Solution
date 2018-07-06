import { ASYNC_STARTED,
  ASYNC_ENDED,
  SET_ACTION_CONFIRMATION,
  SET_ACTION_CONFIRMATION_PROGRESS,
  SET_ACTION_CONFIRMATION_RESULT,
  ACTION_CONFIRMED, CHANGE_OPERATION_STATE }
from "../constants";

export const asyncStarted = () => ({
  type: ASYNC_STARTED
});

export const asyncEnded = () => ({
  type: ASYNC_ENDED
});

export const setActionConfirmation = (confirmationInProgress, toConfirm = {key: "", string: ""}) => ({
  type: SET_ACTION_CONFIRMATION,
  toConfirm,
  confirmationInProgress
});

export const setActionConfirmationProgress = (isWorking) => ({
  type: SET_ACTION_CONFIRMATION_PROGRESS,
  isWorking
});

export const setActionConfirmationResult = (resultBlock) => ({
  type: SET_ACTION_CONFIRMATION_RESULT,
  resultBlock,
  isWorking: false
});

export const actionConfirmed = (toConfirm) => ({
  type: ACTION_CONFIRMED,
  toConfirm
});

export const changeOperationStatus = operationStatus => ({
  type: CHANGE_OPERATION_STATE,
  operationStatus: operationStatus
})
