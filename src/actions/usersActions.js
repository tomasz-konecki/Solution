import { LOAD_USERS_SUCCESS, ASYNC_STARTED, ASYNC_ENDED, LOAD_USERS_FAIL } from "../constants";
import axios from "axios";
import WebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";

export const loadUsersSuccess = (users, resultBlock) => {
  return {
    type: LOAD_USERS_SUCCESS,
    users,
    resultBlock
  };
};

export const loadUsersFail = (resultBlock) => {
  return {
    type: LOAD_USERS_FAIL,
    resultBlock
  };
};

export const loadUsers = (page = 1, limit = 25, other = {}) => {
  return dispatch => {
    const settings = Object.assign(
      {},
      {
        Limit: limit,
        PageNumber: page,
        IsDeleted: false
      },
      other
    );

    dispatch(asyncStarted());
    WebApi.users.post.list(settings)
      .then(response => {
        if(!response.errorOccurred()){
          dispatch(loadUsersSuccess(response.extractData(), response));
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
