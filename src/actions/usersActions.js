import { GET_USERS } from "../constants";
import axios from "axios";

export const loadUsers = () => {
  return dispatch => {
    return axios.get("http://10.24.14.148/users").then(response => {
      dispatch(getUsers(response.data.results));
    });
  };
};

export const getUsers = users => {
  return {
    type: "GET_USERS",
    users
  };
};
