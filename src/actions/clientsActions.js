import WebApi from "../api";
import {
  asyncStarted,
  asyncEnded,
  setActionConfirmationResult,
  setActionConfirmationResultWithoutEnding
  
} from "./asyncActions";
import {
  LOAD_CLIENTS_SUCCESS,
  LOAD_CLIENTS_FAIL,
  ADD_CLIENT_RESULT,
  ADD_CLOUD_RESULT,
  ADD_RESPONSIBLE_PERSON_RESULT,
  CLEAR_RESPONSE_CLOUD
} from "../constants";

export const clearResponseCloud = () => {
  return {
    type: CLEAR_RESPONSE_CLOUD,
    resultBlock: null
  };
};

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

export const addResponsiblePersonResult = resultBlock => {
  return {
    type: ADD_RESPONSIBLE_PERSON_RESULT,
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
        dispatch(setActionConfirmationResultWithoutEnding(error));
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
        dispatch(setActionConfirmationResultWithoutEnding(error));
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
          dispatch(this.loadClients());
        }
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(asyncEnded());
        throw error;
      });
  };
};

export const editClient = (clientId, formData) => {
  return dispatch => {
    WebApi.clients.put
      .info(clientId, formData)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(addClientResult(response));
          setTimeout(() => {
            dispatch(addClientResult(null));
            dispatch(loadClients());
          }, 2000);
        }
      })
      .catch(error => {
        dispatch(addClientResult(error));
        throw error;
      });
  };
};

export const addClient = formData => {
  return dispatch => {
    WebApi.clients
      .post(formData)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(addClientResult(response));
          setTimeout(() => {
            dispatch(addClientResult(null));
            dispatch(loadClients());
          }, 2000);
        }
      })
      .catch(error => {
        dispatch(addClientResult(error));
        throw error;
      });
  };
};

export const addCloud = (name, fields, clientId) => {
  return dispatch => {
    WebApi.clouds
      .post(name, fields, clientId)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(addCloudResult(response));
          dispatch(this.loadClients());
        }
      })
      .catch(error => {
        dispatch(addCloudResult(error));
        throw error;
      });
  };
};

export const addResponsiblePerson = (
  firstName,
  lastName,
  client,
  email,
  phoneNumber
) => {
  return dispatch => {
    WebApi.responsiblePerson
      .post(firstName, lastName, client, email, phoneNumber)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(addResponsiblePersonResult(response));
          dispatch(this.loadClients());
        }
      })
      .catch(error => {
        dispatch(addResponsiblePersonResult(error));
        throw error;
      });
  };
};

export const deleteCloud = id => {
  return dispatch => {
    WebApi.clouds
      .delete(id)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(setActionConfirmationResult(response));
          dispatch(this.loadClients());
        }
      })
      .catch(error => {
        dispatch(setActionConfirmationResult(error));
        throw error;
      });
  };
};

export const editCloud = (cloudId, name, fields, clientId) => {
  return dispatch => {
    WebApi.clouds
      .edit(cloudId, name, fields, clientId)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(addCloudResult(response));
          dispatch(this.loadClients());
        }
      })
      .catch(error => {
        dispatch(addCloudResult(error));
        throw error;
      });
  };
};

export const editResponsiblePerson = (
  responsiblePersonId,
  firstName,
  lastName,
  email,
  phoneNumber,
  client
) => {
  return dispatch => {
    WebApi.responsiblePerson
      .edit(
        responsiblePersonId,
        firstName,
        lastName,
        email,
        phoneNumber,
        client
      )
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(addResponsiblePersonResult(response));
          dispatch(this.loadClients());
        }
      })
      .catch(error => {
        dispatch(addResponsiblePersonResult(error));
        throw error;
      });
  };
};

export const deleteResponsiblePerson = id => {
  return dispatch => {
    WebApi.responsiblePerson
      .delete(id)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(setActionConfirmationResult(response));
          dispatch(this.loadClients());
        }
      })
      .catch(error => {
        dispatch(setActionConfirmationResult(error));
        throw error;
      });
  };
};

export const reactivateCloud = id => {
  return dispatch => {
    WebApi.clouds
      .reactivate(id)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(setActionConfirmationResult(response));
          dispatch(this.loadClients());
        }
      })
      .catch(error => {
        dispatch(setActionConfirmationResult(error));
        throw error;
      });
  };
};

export const reactivateResponsiblePerson = id => {
  return dispatch => {
    WebApi.responsiblePerson
      .reactivate(id)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(setActionConfirmationResult(response));
          dispatch(loadClients());
        }
      })
      .catch(error => {
        dispatch(setActionConfirmationResult(error));
        throw error;
      });
  };
};
