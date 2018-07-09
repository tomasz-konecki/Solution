import WebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";
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
