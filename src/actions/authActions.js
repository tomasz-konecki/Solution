import { AUTH_SUCCESS, AUTH_START, AUTH_STOP, LOGOUT, SEND_CODE_TO_GET_TOKEN, AUTH_ERROR_ACCOUNT_REQUEST, AUTH_CLEAR_ACCOUNT_REQUEST } from '../constants';

export const logout = () => ({
  type: LOGOUT
});

export const authSuccess = (userBlock) => ({
  type: AUTH_SUCCESS,
  userBlock
});

export const clearAccountRequest = () => ({
  type: AUTH_CLEAR_ACCOUNT_REQUEST
})

export const authAccountRequest = () => ({
  type: AUTH_ERROR_ACCOUNT_REQUEST
})

export const authStart = () => ({
  type: AUTH_START
});

export const authStop = () => ({
  type: AUTH_STOP
});


export const sendTokenToGetAuth = (oneDriveToken, authCodeStatus, authCodeErrors, refreshToken) => {
  return {
    type: SEND_CODE_TO_GET_TOKEN,
    oneDriveToken,
    authCodeStatus,
    authCodeErrors,
    refreshToken
  };
};
