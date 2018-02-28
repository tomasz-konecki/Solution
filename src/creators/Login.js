import { connect } from "react-redux";
import { push } from "react-router-redux";
import { authSuccess, authFail } from "../actions/authActions";

import LoginScreen from "../containers/login/LoginScreen";

export const Login = connect(null, dispatch => ({
  login: credentials => {
    dispatch(authSuccess());
    dispatch(push("/main"));
  }
}))(LoginScreen);
