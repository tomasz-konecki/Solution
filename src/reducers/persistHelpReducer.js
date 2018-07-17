import { FETCH_LISTS, CHOOSE_FOLDER_TO_GENERATE_REPORT } from "../constants";
import { updateObject } from '../services/methods';

const initialState = {
  addList: [],
  baseList: [],
  helpList: [],
  pagesList: [],
  folderToGenerateReport: null
};

export const persistHelpReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LISTS:
        return updateObject(state, { addList: action.addList, baseList: action.baseList, 
          helpList: action.helpList, pagesList: action.pagesList })
    case CHOOSE_FOLDER_TO_GENERATE_REPORT:
        return updateObject(state, {folderToGenerateReport: action.folderToGenerateReport})
    default:
      return state;
  }
};
