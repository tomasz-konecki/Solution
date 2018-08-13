import {
  SET_IS_STARTED, SET_PROGRESS_BAR_VALUE, CHANGE_SHOULD_SHOW_GLOBAL
} from "../constants";
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr'; 
import storeCreator from '../store';
import Config from "Config";


const { store }  = storeCreator;
const state = store.getState();
const getIsStarted = state => { return state.progressBarReducer.isStarted } 

const isStarted = getIsStarted(state);

export const setIsStarted = isStarted => {
  return {
    type: SET_IS_STARTED, isStarted
  };
};

export const setProgressValue = (percentage, message) => {
  return {
    type: SET_PROGRESS_BAR_VALUE, percentage, message
  }
}
export const changeShowGlobal = shouldShowGlobal => {
  return { type: CHANGE_SHOULD_SHOW_GLOBAL, shouldShowGlobal }
}
const connectionError = "Wystąpił błąd podczas konfiguracji wskaźnika postępu";

export const createSignalRConnection = () => (dispatch) => {
  return new Promise(resolve => {
      const HubConnection = new HubConnectionBuilder().
      withUrl(Config.serverUrl + "/progress", 
        {transport: HttpTransportType.WebSockets}).build();

      HubConnection.on('SendProgress', (message, percentage) => {
          console.log(message);
          console.log(percentage);
          if(!isStarted){
            dispatch(setIsStarted(isStarted));
            dispatch(setProgressValue(percentage, message));
          }
          else{
            dispatch(setProgressValue(percentage, message));
          }
      });

      HubConnection.start();
      resolve();
  })
}