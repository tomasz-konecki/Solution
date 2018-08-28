import { GENERATE_G_DRIVE_SHARE_LINK } from "../constants";
import { updateObject } from "../services/methods";
const initialState = {
  generateGDriveShareLinkStatus: null,
  generateGDriveShareLinkErrors: [],
  generatedGDriveSharedLink: ""
};

export const gDriveReducer = (state = initialState, action) => {
  switch (action.type) {
    case GENERATE_G_DRIVE_SHARE_LINK:
      return updateObject(state, { generateGDriveShareLinkStatus: action.generateGDriveShareLinkStatus,
        generateGDriveShareLinkErrors: action.generateGDriveShareLinkErrors, generatedGDriveSharedLink: 
        action.generatedGDriveSharedLink })
    default:
      return state;
  }
};
