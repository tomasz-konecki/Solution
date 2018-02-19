import { AUTH_SUCCESS, AUTH_FAIL } from '../constants';

export const authSuccess = () => ({
  type: AUTH_SUCCESS
});

export const authFail = () => ({
  type: AUTH_FAIL
});
