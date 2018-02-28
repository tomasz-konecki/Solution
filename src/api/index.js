import axios from "axios";
import * as jwtDecode from "jwt-decode";
import * as Promise from "bluebird";

const API_ENDPOINT = "http://10.24.14.148";

class DCMTWebApi {
  auth(username, password) {
    return axios.post('http://localhost:3001/sessions/create', { username, password })
      .then(response => jwtDecode(response.data.id_token));
  }

  getUsers() {
    return axios.get(`${API_ENDPOINT}/users`);
  }
}

export default new DCMTWebApi();
