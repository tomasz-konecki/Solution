import { 
    GET_NOTIFICATION,
    DELETE_NOTIFICATION,
    MARKASREAD_NOTIFICATION,
    DELETE_ALL_NOTIFICATIONS,
    MARKALLASREAD_NOTIFICATION
 } from './../constants';
import { resolve } from 'url';
import WebApi from "../api";
import { errorCatcher } from '../services/errorsHandler';


export const getNotification = (notifications, getNotificationStatus, getNotificationErrors) => {
    return {
      type: GET_NOTIFICATION,
      notifications,
      getNotificationStatus,
      getNotificationErrors
    }
}
  
export const getNotificationACreator = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        WebApi.notification.get.getAll().then(response => {
            dispatch(getNotification(response.replyBlock.data.dtoObjects, true, []));
            resolve();
        }).catch(error => {
            dispatch(getNotification([], false, errorCatcher(error)));
            reject();
        }) 
    })
}

export const deleteNotification = (deleteNotificationStatus, deleteNotificationErrors) => {
    return { type: DELETE_NOTIFICATION,
        deleteNotificationStatus,
        deleteNotificationErrors 
    };
  };
  
export const deleteNotificationACreator = notificationsIds => dispatch => {
    return new Promise((resolve, reject) => {
        WebApi.notification.delete.delete(notificationsIds).then(() => {
            dispatch(deleteNotification(true, []));
            dispatch(getNotificationACreator());
            resolve();
        }).catch(error => {
            dispatch(deleteNotification(false, errorCatcher(error)));
            reject();
        })
    })
}

export const markNotificationAsRead = (markNotificationAsReadStatus, markNotificationAsReadErrors) => {
    return { type: MARKASREAD_NOTIFICATION,
        markNotificationAsReadStatus,
        markNotificationAsReadErrors 
    };
  };
  
export const markNotificationAsReadACreator = notificationId => dispatch => {
    return new Promise((resolve, reject) => {
        WebApi.notification.put.markAsRead(notificationId).then(() => {
            dispatch(markNotificationAsRead(true, []));
            dispatch(getNotificationACreator());
            resolve();
        }).catch(error => {
            dispatch(markNotificationAsRead(false, errorCatcher(error)));

            reject();
        })
    })
}

export const deleteAllNotifications = (deleteAllNotificationsStatus, deleteAllNotificationsErrors) => {
    return { type: DELETE_ALL_NOTIFICATIONS,
        deleteAllNotificationsStatus,
        deleteAllNotificationsErrors 
    };
  };
  
export const deleteAllNotificationsACreator = () => dispatch => {
    return new Promise((resolve, reject) => {
        WebApi.notification.delete.deleteAll().then(() => {
            dispatch(deleteAllNotifications(true, []));
            dispatch(getNotificationACreator());
            resolve();
        }).catch(error => {
            dispatch(deleteAllNotifications(false, errorCatcher(error)));
            reject();
        })
    })
}

export const markAllNotificationsAsRead = (markAllNotificationsAsReadStatus, markAllNotificationsAsReadErrors) => {
    return { type: MARKALLASREAD_NOTIFICATION,
        markAllNotificationsAsReadStatus,
        markAllNotificationsAsReadErrors 
    };
  };
  
export const markAllNotificationsAsReadACreator = () => dispatch => {
    return new Promise((resolve, reject) => {
        WebApi.notification.put.markAllAsRead().then(() => {
            dispatch(markAllNotificationsAsRead(true, []));
            dispatch(getNotificationACreator());
            resolve();
        }).catch(error => {
            dispatch(markAllNotificationsAsRead(false, errorCatcher(error)));
            reject();
        })
    })
}