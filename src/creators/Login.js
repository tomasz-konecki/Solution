import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { authSuccess, authFail } from '../actions/authActions';

import FrontScreen from "../containers/login/FrontScreen";

export const Login = connect(null, dispatch => ({
  login: () => {
    dispatch(authSuccess());
    dispatch(push('/main'));
  }
}))(FrontScreen);
