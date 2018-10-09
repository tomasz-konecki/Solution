import { 
  GET_NOTIFICATION,
  DELETE_NOTIFICATION
} from "../constants";
import { updateObject } from "../services/methods";

const initialState = {
    notifications: [],
    getNotificationStatus: null,
    getNotificationErrors: [],

    deleteNotificationStatus: null,
    deleteNotificationErrors: [],
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      return updateObject(state, {
        notifications: action.notifications,
        getNotificationStatus: action.getNotificationStatus, getNotificationErrors: 
        action.getNotificationErrors })
    case DELETE_NOTIFICATION:
      return updateObject(state,{
        deleteNotificationStatus: action.deleteNotificationStatus,
        deleteNotificationErrors: action.deleteNotificationErrors
      })
    default:
      return state;
  }
};
