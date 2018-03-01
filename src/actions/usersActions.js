import { LOAD_USERS_SUCCESS } from "../constants";
import axios from "axios";
import DCMTWebApi from "../api";

export const loadUsersSuccess = users => {
  return {
    type: "LOAD_USERS_SUCCESS",
    users
  };
};

export const searchADSuccess = foundUsers => {
  return {
    type: "SEARCH_AD_SUCCESS",
    foundUsers
  };
};

export const loadUsers = () => {
  return dispatch => {
    DCMTWebApi.getUsers()
      .then(response => {
        dispatch(loadUsersSuccess(response.data.results));
      })
      .catch(error => {
        throw error;
      });
  };
};

export const searchAD = user => {
  return dispatch => {
    DCMTWebApi.searchAD(user)
      .then(response => {
        dispatch(searchADSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
};
