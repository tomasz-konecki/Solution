import { GET_FOLDERS }
from "../constants";
import WebApi from "../api";
import { errorCatcher } from '../services/errorsHandler';
import { asyncEnded, asyncStarted } from '../actions/asyncActions';
import { chooseFolder } from './persistHelpActions';
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

            dispatch(setParentDetails(folderId, response.replyBlock.data.goBack));
            dispatch(asyncEnded());
        }).catch(error => {
            console.log(error.response);
            dispatch(getFolders([], false, errorCatcher(error), ""));
            dispatch(setParentDetails(""));
            dispatch(asyncEnded());
        })
    }
}

export const deleteFolderACreator = (folderId, path, redirectPath, currentChoosenFolder) => {
    return dispatch => {
        const model = {
            "id": folderId
        }
        dispatch(asyncStarted());
        
        WebApi.gDrive.post.deleteFolder(model).then(response => {
            dispatch(deleteFolder(true, []));
            if(currentChoosenFolder)
                if(currentChoosenFolder.id === folderId)
                    dispatch(chooseFolder(null));
            
            dispatch(getFoldersACreator(redirectPath, path));
        }).catch(error => {
            dispatch(deleteFolder(false, errorCatcher(error)));
            dispatch(asyncEnded());
        })
    }
}

export const updateFolderACreator = (name, path, redirectPath, folderId) => {
    return dispatch => {
        dispatch(asyncStarted());
        const model = {
            "id": folderId,
            "newName": name
        }
        WebApi.gDrive.post.updateFolder(model).then(response => {
            dispatch(updateFolder(true, []));
            dispatch(getFoldersACreator(redirectPath, path));
        }).catch(error => {
            dispatch(updateFolder(false, errorCatcher(error)));
            dispatch(asyncEnded());
        })
    }
} 
export const createFolderACreator = (name, parentId, path, redirectPath) => {
    return dispatch => {
        const model = {
            "name": name,
            "parentId": parentId
        }
        WebApi.gDrive.post.createFolder(model).then(response => {
            dispatch(createFolder(true , []));
            dispatch(getFoldersACreator(redirectPath, path));
        }).catch(error => {
            dispatch(createFolder(false, errorCatcher(error)));
        })
    }
}

export const uploadFileACreator = (path, file, parentId) => {
    return dispatch => {
        let model = new FormData();
        model.set("ParentId", parentId);
        model.set("File", file[0]);
        const config = {
            headers: {'Content-Type': 'multipart/form-data' }
        }
        WebApi.gDrive.post.uploadFile(model, config).then(response => {
            dispatch(uploadFile(true, []));
            dispatch(getFoldersACreator(parentId, path));
        }).catch(error => {
            dispatch(uploadFile(false, errorCatcher(error)));
        })
    }
}