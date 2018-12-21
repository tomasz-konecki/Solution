import {
    ONE_DRIVE_AUTH, GET_FOLDERS, CREATE_FOLDER, DELETE_FOLDER,
    UPDATE_FOLDER, UPLOAD_FILE, SET_PARENT_DETAILS,
    GENERATE_SHARE_LINK  } from "../constants";
  import { updateObject } from '../services/methods';
  const initialState = {
    authStatus: null,
    authErrors: [],
    authRedirectLink: "",

    folders: [],
    getFoldersStatus: null,
    getFoldersErrors: [],
    path: "",

    parentId: "",
    goBackPath: "",

    createFolderStatus: null,
    createFolderErrors: [],

    deleteFolderStatus: null,
    deleteFolderErrors: [],

    updateFolderStatus: null,
    updateFolderErrors: [],

    uploadFileStatus: null,
    uploadFileErrors: [],

    generateShareLinkStatus: null,
    generateShareLinkErrors: [],
    generatedShareLink: ""
  };
  
  export const oneDriveReducer = (state = initialState, action) => {
    switch (action.type) {
      case ONE_DRIVE_AUTH:
        return updateObject(state, { authStatus: action.authStatus, 
            authErrors: action.authErrors, authRedirectLink: action.authRedirectLink })
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
      case SET_PARENT_DETAILS:
        return updateObject(state, { parentId: action.parentId, goBackPath: action.goBackPath })
      case GENERATE_SHARE_LINK:
        return updateObject(state, { generateShareLinkStatus: action.generateShareLinkStatus, 
          generateShareLinkErrors: action.generateShareLinkErrors, generatedShareLink: action.generatedShareLink })
      default:
        return state;
    }
  };