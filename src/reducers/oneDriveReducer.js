import {
    ONE_DRIVE_AUTH, SEND_CODE_TO_GET_TOKEN, GET_FOLDERS, CREATE_FOLDER, DELETE_FOLDER,
    UPDATE_FOLDER, UPLOAD_FILE  } from "../constants";
  import { updateObject } from '../services/methods';
  const initialState = {
    authStatus: null,
    authErrors: [],
    authRedirectLink: "",

    authCodeToken: "",
    authCodeStatus: null,
    authCodeErrors: [],

    folders: [],
    getFoldersStatus: null,
    getFoldersErrors: [],
    path: "",

    createFolderStatus: null,
    createFolderErrors: [],

    deleteFolderStatus: null,
    deleteFolderErrors: [],

    updateFolderStatus: null,
    updateFolderErrors: [],

    uploadFileStatus: null,
    uploadFileErrors: []
  };
  
  export const oneDriveReducer = (state = initialState, action) => {
    switch (action.type) {
      case ONE_DRIVE_AUTH:
        return updateObject(state, { authStatus: action.authStatus, 
            authErrors: action.authErrors, authRedirectLink: action.authRedirectLink })
      case SEND_CODE_TO_GET_TOKEN:
        return updateObject(state, { authCodeToken: action.authCodeToken, 
          authCodeStatus: action.authCodeStatus, authCodeErrors: action.authCodeErrors})
      case GET_FOLDERS:
        return updateObject(state, { folders: action.folders, 
          getFoldersStatus: action.getFoldersStatus, getFoldersErrors: action.getFoldersErrors, 
          path: action.path})
      case CREATE_FOLDER:
        return updateObject(state, { createFolderStatus: action.createFolderStatus, 
          createFolderErrors: action.createFolderErrors})
      case DELETE_FOLDER:
        return updateObject(state, { deleteFolderStatus: action.deleteFolderStatus, 
          deleteFolderErrors: action.deleteFolderErrors})
      case UPDATE_FOLDER:
        return updateObject(state, { updateFolderStatus: action.updateFolderStatus, 
          updateFolderErrors: action.updateFolderErrors})
      case UPLOAD_FILE:
        return updateObject(state, { uploadFileStatus: action.uploadFileStatus, 
          uploadFileErrors: action.uploadFileErrors })
      default:
        return state;
    }
  };
  