import { GET_FOLDERS }
from "../constants";
import WebApi from "../api";
import { errorCatcher } from '../services/errorsHandler';
import { asyncEnded, asyncStarted } from '../actions/asyncActions';
import { getFolders, setParentDetails, deleteFolder, updateFolder, createFolder, uploadFile } from './oneDriveActions';
import { loginACreator } from './persistHelpActions';
import storeCreator from '../store';

export const getFoldersACreator = (folderId, path) => {
    return dispatch => {
        const model = {
            "id": folderId
        }
        dispatch(asyncStarted());
        WebApi.gDrive.post.getFolders(model).then(response => {
            const { dtoObjects } = response.replyBlock.data;
            
            dispatch(getFolders(dtoObjects, true, [], path));

            dispatch(setParentDetails(dtoObjects[0].parents));
            dispatch(asyncEnded());
        }).catch(error => {
            dispatch(getFolders([], false, errorCatcher(error), ""));
            dispatch(setParentDetails(""));
            dispatch(asyncEnded());
        })
    }
}

export const deleteFolderACreator = (folderId, path) => {
    return dispatch => {
        const model = {
            "id": folderId
        }
        dispatch(asyncStarted());
        
        WebApi.gDrive.post.deleteFolder(model).then(response => {
            dispatch(deleteFolder(true, []));
            dispatch(getFoldersACreator(path, "root"));
        }).catch(error => {
            dispatch(deleteFolder(false, errorCatcher(error)));
            dispatch(asyncEnded());
        })
    }
}

export const updateFolderACreator = (folderId, path, newName) => {
    return dispatch => {
        dispatch(asyncStarted());
        const model = {
            "id": folderId,
            "newName": newName
        }
        WebApi.gDrive.post.updateFolder(model).then(response => {
            dispatch(updateFolder(true, []));
            dispatch(getFoldersACreator(path, "root"));
        }).catch(error => {
            dispatch(updateFolder(false, errorCatcher(error)));
            dispatch(asyncEnded());
        })
    }
} 
export const createFolderACreator = (name, parentId, path) => {
    return dispatch => {
        const model = {
            "name": name,
            "parentId": parentId
        }
        WebApi.gDrive.post.createFolder(model).then(response => {
            dispatch(createFolder(true , []));
            dispatch(getFoldersACreator(path, "root"));
        }).catch(error => {
            dispatch(createFolder(false, errorCatcher(error)));
        })
    }
}

export const uploadFileACreator = (path, file, parentId) => {
    return dispatch => {
        let model = new FormData();
        model.set("parentId", parentId);
        model.set("File", file);
        
        const config = {
            headers: {'Content-Type': 'multipart/form-data' }
        }

        WebApi.gDrive.post.uploadFile(model, config).then(response => {
            dispatch(uploadFile(true, []));
            dispatch(getFoldersACreator(path, "root"));
        }).catch(error => {
            dispatch(uploadFile(false, errorCatcher(error)));
        })
    }
}