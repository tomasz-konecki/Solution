import { LOAD_USERS_SUCCESS, ASYNC_STARTED, ASYNC_ENDED } from "../constants";
import axios from "axios";
import DCMTWebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";

export const loadUsersSuccess = users => {
  return {
    type: LOAD_USERS_SUCCESS,
    users
  };
};

export const loadUsers = (page = 1, limit = 25) => {
  return dispatch => {
    const settings = {
      Limit: limit,
      Page: page
    };

    dispatch(asyncStarted());
    DCMTWebApi.getUsers(settings)
      .then(response => {
        dispatch(loadUsersSuccess(response.data.dtoObject.results));
      })
      .catch(error => {
        throw error;
      })
      .then(dispatch(asyncEnded()));
  };
};
