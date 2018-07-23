import { GET_GDRIVE_FOLDERS } from "../constants";
import { updateObject } from "../services/methods";
const initialState = {
  folders: [],
  getFoldersStatus: null,
  getFoldersErrors: []
};

export const gDriveReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GDRIVE_FOLDERS:
      return updateObject(state, { folders: action.folders, 
        getFoldersStatus: action.getFoldersStatus, getFoldersErrors: action.getFoldersErrors })
    default:
      return state;
  }
};
