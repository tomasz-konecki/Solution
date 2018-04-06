import { AUTH_SUCCESS, AUTH_START, AUTH_STOP, LOGOUT } from '../constants';

export const logout = () => ({
  type: LOGOUT
});

export const authSuccess = (userBlock) => ({
  type: AUTH_SUCCESS,
  userBlock
});

export const authStart = () => ({
  type: AUTH_START
});

export const authStop = () => ({
  type: AUTH_STOP
});
