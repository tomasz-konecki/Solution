import { GET_FOLDERS }
from "../constants";
import WebApi from "../api";
import { errorCatcher } from '../services/errorsHandler';
import { getFolders } from './oneDriveActions';

export const getFoldersACreator = (folderId, path) => {
    return dispatch => {
        const model = {
            "id": folderId
        }
        WebApi.gDrive.post.getFolders(model).then(response => {
            dispatch(getFolders(response.replyBlock.data.dtoObjects, true, [], path));
        }).catch(error => {
            dispatch(getFolders([], false, errorCatcher(error), ""));
        })
    }
}