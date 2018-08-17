import {
  SET_IS_STARTED,
  SET_PROGRESS_BAR_VALUE,
  CHANGE_SHOULD_SHOW_GLOBAL,
  SET_SIGNAL_R_CONNECTION_RESULT
} from "../constants";
import { HubConnectionBuilder, HttpTransportType } from "@aspnet/signalr";
import Config from "Config";
import { connectionError } from '../constants';
import storeCreator from "../store";


export const setIsStarted = (isStarted, operationName) => {
  return {
    type: SET_IS_STARTED,
    isStarted,
    operationName,
    
  };
};
export const setSignalRConnectionStatus = (connectingSinalRStatus, connectionSignalRErrors, hubConnection) => {
  return {
    type: SET_SIGNAL_R_CONNECTION_RESULT,
    connectingSinalRStatus,
    connectionSignalRErrors,
    hubConnection
  }
}

export const setProgressValue = (percentage, message) => {
  return {
    type: SET_PROGRESS_BAR_VALUE,
    percentage,
    message
  };
};
export const changeShowGlobal = shouldShowGlobal => {
  return { type: CHANGE_SHOULD_SHOW_GLOBAL, shouldShowGlobal };
};

const { store } = storeCreator;

export const createSignalRConnection = () => dispatch => {
  return new Promise(resolve => {
    const state = store.getState();
    const signalRConnectionStatus = getSignalRConnectionStatus(state);
    let HubConnection = getHubConnection(state);

    if(!HubConnection || !signalRConnectionStatus){
      HubConnection = new HubConnectionBuilder()
      .withUrl(Config.serverUrl + "/progress", {
        transport: HttpTransportType.LongPolling
      }).build();
      
      HubConnection.start().then(() => {
        dispatch(setSignalRConnectionStatus(true, [], HubConnection));
      }).catch(() => {
        dispatch(setSignalRConnectionStatus(false, [connectionError], null));
      });
      
    }
    HubConnection.on("SendProgress", (message, percentage) => {
        dispatch(setProgressValue(percentage, message));
        if(percentage === 100)
          dispatch(setProgressValue(percentage, "Trwa finalizowanie operacji"));
    });
   
    resolve();
  });
};

const getHubConnection = state => {
  return state.progressBarReducer.hubConnection;
};
const getSignalRConnectionStatus = state => {
  return state.progressBarReducer.connectingSinalRStatus;
}