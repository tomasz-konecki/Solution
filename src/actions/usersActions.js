import { LOAD_USERS_SUCCESS } from "../constants";
import axios from "axios";

export const loadUsersSuccess = users => {
  console.log("USERS_ACTIONS USERS:", users);
  return {
    type: "LOAD_USERS_SUCCESS",
    users
  };
};

export const loadUsers = () => {
  return dispatch => {
    return axios
      .get("http://10.24.14.148/users")
      .then(response => {
        dispatch(loadUsersSuccess(response.data.results));
      })
      .catch(error => {
        throw error;
      });
  };
};
