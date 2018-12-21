import { LOAD_USERS_SUCCESS, ASYNC_STARTED, ASYNC_ENDED, LOAD_USERS_FAIL, CHANGE_ROLES_GET_STATUS, GET_ROLES, SEND_ROLES_RESULT } from "../constants";
import axios from "axios";
import WebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";
import { clearAccountRequest } from './authActions';
import { errorCatcher } from '../services/errorsHandler';

export const loadUsersSuccess = (users, resultBlock, show) => {
  return {
    type: LOAD_USERS_SUCCESS,
    users,
    resultBlock,
    show
  };
};

export const loadUsersFail = (resultBlock) => {
  return {
    type: LOAD_USERS_FAIL,
    resultBlock
  };
};

export const loadUsers = (page = 1, limit = 25, other = {isDeleted: false}) => {
    return dispatch => {
      const settings = Object.assign(
        {},
        {
          Limit: limit,
          PageNumber: page,
        },
        other
      );
      dispatch(asyncStarted());
      WebApi.users.post[("isNotActivated" in other ? ["listOfRequests"] : ["list"])](settings)
        .then(response => {
          if(!response.errorOccurred()){
            if ("isNotActivated" in other) {
              dispatch(loadUsersSuccess(response.extractData(), response, "isNotActivated"));
            }
            else {
              dispatch(loadUsersSuccess(response.extractData(), response, "isActivated"));
            }
          }
          dispatch(asyncEnded());
        })
        .catch(error => {
          dispatch(loadUsersFail(error));
          dispatch(asyncEnded());
          throw error;
        });
    };
};



export const changeLoadRolesStatus = (
  loadRolesStatus,
  loadRolesErrors
) => {
  return {
    type: CHANGE_ROLES_GET_STATUS,
    loadRolesStatus,
    loadRolesErrors
  };
};

export const getRoles = roles => {
  return {
    type: GET_ROLES,
    roles
  };
};

export const loadRoles = () => {
  return dispatch => {
    WebApi.roles.get
      .getAll()
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(getRoles(response.extractData()));
          dispatch(changeLoadRolesStatus(true, []));
        }
      })
      .catch(error => {
        dispatch(changeLoadRolesStatus(false, errorCatcher(error)));
      });
  };
};

export const addRolesResult = resultBlockAddRoles => {
  return {
    type: SEND_ROLES_RESULT,
    resultBlockAddRoles
  };
};

export const addRoles = (userRoles) => {
  return dispatch => {
    WebApi.roles.post
      .add(userRoles)
      .then(response => {
        dispatch(addRolesResult(response));

        setTimeout(() => {
          dispatch(addRolesResult(null));
          dispatch(clearAccountRequest());
        }, 2000);
      })
      .catch(error => {
        dispatch(addRolesResult(error));
        dispatch(clearAccountRequest());
        setTimeout(() => {
          dispatch(addRolesResult(null));
        }, 2000);
        throw error;
      });
  };
};
