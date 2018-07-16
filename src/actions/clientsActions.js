import WebApi from "../api";
import {
  asyncStarted,
  asyncEnded,
  setActionConfirmationResult
} from "./asyncActions";
import {
  LOAD_CLIENTS_SUCCESS,
  LOAD_CLIENTS_FAIL,
  ADD_CLIENT_RESULT,
  ADD_CLOUD_RESULT
} from "../constants";

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

export const addClientResult = resultBlock => {
  return {
    type: ADD_CLIENT_RESULT,
    resultBlock
  };
};

export const addCloudResult = resultBlock => {
  return {
    type: ADD_CLOUD_RESULT,
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
          let promise = new Promise((resolve, reject) => {
            resolve(dispatch(setActionConfirmationResult(response)));
          });
          promise.then(dispatch(this.loadClients()));
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
          let promise = new Promise((resolve, reject) => {
            resolve(dispatch(setActionConfirmationResult(response)));
          });
          promise.then(dispatch(this.loadClients()));
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

export const saveEdit = (id, value) => {
  return dispatch => {
    dispatch(asyncStarted());
    WebApi.clients.put
      .info(id, value)
      .then(response => {
        if (!response.errorOccurred()) {
          let promise = new Promise((resolve, reject) => {
            resolve(console.log(response));
          });
          promise.then(dispatch(this.loadClients()));
        }
        dispatch(asyncEnded());
      })
      .catch(error => {
        console.log(error);
        dispatch(asyncEnded());
        throw error;
      });
  };
};

export const addClient = clientName => {
  return dispatch => {
    dispatch(asyncStarted());
    WebApi.clients
      .post(clientName)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(addClientResult(response));
          setTimeout(() => {
            //dispatch(addClientResult(null));
            //dispatch(loadClients());
          }, 2000);
        }
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(addClientResult(error));
        setTimeout(() => {
          dispatch(addClientResult(null));
        }, 2000);
        dispatch(asyncEnded());
        throw error;
      });
  };
};

export const addCloud = (name, clientId) => {
  return dispatch => {
    dispatch(asyncStarted());
    WebApi.clouds
      .post(name, clientId)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(addCloudResult(response));
          dispatch(asyncEnded());
        }
      })
      .catch(error => {
        dispatch(addCloudResult(error));
        dispatch(asyncEnded());
        throw error;
      });
  };
};
