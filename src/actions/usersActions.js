import { LOAD_USERS_SUCCESS } from "../constants";
import axios from "axios";
import DCMTWebApi from "../api";

export const loadUsersSuccess = users => {
  return {
    type: "LOAD_USERS_SUCCESS",
    users
  };
};

export const loadUsers = () => {
  return dispatch => {
    DCMTWebApi.getUsers()
      .then(response => {
        dispatch(loadUsersSuccess(response.data.dtoObject.results));
      })
      .catch(error => {
        throw error;
      });
  };
};
