import WebApi from "../api";
import {
  asyncStarted,
  asyncEnded,
  setActionConfirmationResult
} from "./asyncActions";
import { LOAD_CLIENTS_SUCCESS, LOAD_CLIENTS_FAIL } from "../constants";

export const loadClientsSuccess = (clients, resultBlock) => {
  return {
    type: LOAD_CLIENTS_SUCCESS,
    clients,
    resultBlock
  };
};

export const loadClientsFail = resultBlock => {
  return {
    type: LOAD_CLIENTS_FAIL,
    resultBlock
  };
};

export const loadClients = () => {
  return dispatch => {
    dispatch(asyncStarted());
    WebApi.clients.get
      .all()
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(loadClientsSuccess(response.extractData(), response));
        }
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(loadClientsFail(error));
        dispatch(asyncEnded());
        throw error;
      });
  };
};

export const deleteClient = id => {
  return dispatch => {
    dispatch(asyncStarted());
    WebApi.clients
      .delete(id)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(setActionConfirmationResult(response));
        }
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(setActionConfirmationResult(error));
        dispatch(asyncEnded());
        throw error;
      });
  };
};

export const reactivateClient = id => {
  return dispatch => {
    dispatch(asyncStarted());
    WebApi.clients.put
      .reactivate(id)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(setActionConfirmationResult(response));
        }
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(setActionConfirmationResult(error));
        dispatch(asyncEnded());
        throw error;
      });
  };
};
