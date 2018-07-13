import { ONE_DRIVE_AUTH, SEND_CODE_TO_GET_TOKEN, GET_FOLDERS, CREATE_FOLDER, DELETE_FOLDER,
    UPDATE_FOLDER, UPLOAD_FILE } from "../constants";
import WebApi from "../api";
import { changeOperationStatus } from "./asyncActions";
import { errorCatcher } from '../services/errorsHandler';

export const authOneDrive = (authStatus, authErrors, authRedirectLink) => {
    return {
        type: ONE_DRIVE_AUTH, authStatus, authErrors, authRedirectLink
    }
}

export const authOneDriveACreator = () => {
    return dispatch =>  {
        WebApi.oneDrive.get.authBegin().then(response => {
            dispatch(authOneDrive(true, [], response.replyBlock.data.dtoObject.link));
        }).catch(error => {
            dispatch(authOneDrive(false, errorCatcher(error), ""));
        })
    }
}

export const sendCodeToGetToken = (authCodeToken, authCodeStatus, authCodeErrors) => {
    return { type: SEND_CODE_TO_GET_TOKEN, authCodeToken, authCodeStatus, authCodeErrors }
}

export const sendCodeToGetTokenACreator = url => {
    return dispatch => {
        const indexOfEqualMark = url.search("=");
        const codeWithNotNeededId = url.substring(indexOfEqualMark+1, url.length);
        const codeWithoutId = codeWithNotNeededId.substring(0, codeWithNotNeededId.search("&"));
        dispatch(sendAuthCodePromise(codeWithoutId)).then(response => {
            const { access_token } = response.replyBlock.data.dtoObject;
            dispatch(sendCodeToGetToken(access_token, true, []));

            dispatch(getFoldersPromise(access_token, null)).then(folders => {
                dispatch(getFolders(folders, true, [], "/drive/root:"));
            });
        });
    }
}


export const getFolders = (folders, getFoldersStatus, getFoldersErrors, path) => {
    return { type: GET_FOLDERS, folders, getFoldersStatus, getFoldersErrors, path }
}

export const getFolderACreator = (token, path) => {
    return dispatch => {
        dispatch(getFoldersPromise(token, path)).then(response => {
            dispatch(getFolders(response, true, [], path));
        });
    }
}


export const getFoldersPromise = (token, path) => (dispatch) => {
    return new Promise((resolve, reject) => {
        const model	= {
            "token": token,
            "path": path
        }
        WebApi.oneDrive.post.getFolders(model).then(response => {
            resolve(response.replyBlock.data.dtoObjects);
        }).catch(error => {
            dispatch(getFolders([], false, errorCatcher(error), ""));
            reject(error);
        })
    })
}

export const sendAuthCodePromise = (codeWithoutId) => (dispatch) => {
    return new Promise((resolve, reject) => {
        WebApi.oneDrive.get.sendQuertToAuth(codeWithoutId).then(response => {
            resolve(response);
        }).catch(error => {
            dispatch(sendCodeToGetToken("", false, errorCatcher(error)));
            reject(error);
        })
    })
}

export const createFolder = (createFolderStatus, createFolderErrors) => {
    return { type: CREATE_FOLDER, createFolderStatus, createFolderErrors }
}

export const createFolderACreator = (folderName, path, token) => {
    return dispatch => {
        const model = {
            "folderName": folderName,
            "path": path,
            "token": token
        }
        WebApi.oneDrive.post.createFolder(model).then(response => {
            dispatch(createFolder(true, []));
            dispatch(getFolderACreator(token, path));
        }).catch(error => {
            dispatch(createFolder(false, errorCatcher(error)));
        })
    }
}


export const deleteFolder = (deleteFolderStatus, deleteFolderErrors) => {
    return {
        type: DELETE_FOLDER,
        deleteFolderStatus,
        deleteFolderErrors
    }
}

export const deleteFolderACreator = (folderId, token, path) => {
    return dispatch => {
        const model = {
            "folderId": folderId,
            "token": token
        }
        WebApi.oneDrive.post.deleteFolder(model).then(response => {
            dispatch(deleteFolder(true, []));

            dispatch(getFolderACreator(token, path));
        }).catch(error => {
            dispatch(deleteFolder(false, errorCatcher(error)));
        })
    }
}

export const updateFolder = (updateFolderStatus, updateFolderErrors) => {
    return { type: UPDATE_FOLDER, updateFolderStatus, updateFolderErrors }
}

export const updateFolderACreator = (newName, folderId, token, path) => {
    return dispatch => {
        const model = {
            "newName": newName,
            "folderId": folderId,
            "token": token
        }
        WebApi.oneDrive.post.updateFolder(model).then(response => {
            dispatch(updateFolder(true, []));

            dispatch(getFolderACreator(token, path));
        }).catch(error => {
            dispatch(updateFolder(false, errorCatcher(error)));
        })
    }
}

export const uploadFile = (uploadFileStatus, uploadFileErrors) => {
    return {
        type: UPLOAD_FILE,
        uploadFileStatus,
        uploadFileErrors
    }
}

export const countHowManyItems = (array, item, key) => {
    let counter = 0 ;
    for(let i = 0; i < array.length; i++){
        if(array[i][key].search(item) !== -1)
            counter++;
    }
    return counter;
}

export const uploadFileACreator = (token, path, file, currentFilesList) => {
    return dispatch => {
        let model = new FormData();
        model.set("token", token);
        model.set("path", path);
        
        const fileToEdit = file[0];
        const dotIndex = fileToEdit.name.lastIndexOf(".");
        const nameBeforeDot = fileToEdit.name.substring(0, dotIndex);
        
        const duplicatedItemsCount = countHowManyItems(currentFilesList, nameBeforeDot, "name");
        if(duplicatedItemsCount > 0){
            const nameWithNumberOfRepeatingFiles = nameBeforeDot + `(${duplicatedItemsCount})` + 
                fileToEdit.name.substring(dotIndex, fileToEdit.name.length);
            model.set("file", fileToEdit, nameWithNumberOfRepeatingFiles);
        }
        else
            model.set("file", fileToEdit);
        
        const config = {
             headers: {'Content-Type': 'multipart/form-data' }
        }

        WebApi.oneDrive.post.uploadFile(model, config).then(response => {
            dispatch(uploadFile(true, []));
            dispatch(getFolderACreator(token, path));
        }).catch(error => {
            dispatch(uploadFile(false, errorCatcher(error)));
        })
    }
}