import { AUTH_SUCCESS, AUTH_FAIL, AUTH_START, AUTH_STOP } from '../constants';

export const authSuccess = (userBlock) => ({
  type: AUTH_SUCCESS,
  userBlock
});

export const authFail = () => ({
  type: AUTH_FAIL
});

export const authStart = () => ({
  type: AUTH_START
});

export const authStop = () => ({
  type: AUTH_STOP
});
