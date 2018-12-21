
import { ONE_DRIVE_AUTH, SEND_CODE_TO_GET_TOKEN, GET_FOLDERS, CREATE_FOLDER, DELETE_FOLDER,
    UPDATE_FOLDER, UPLOAD_FILE, SET_PARENT_DETAILS,
    GENERATE_SHARE_LINK } from "../constants";

import WebApi from "../api";
import { changeOperationStatus } from "./asyncActions";
import { chooseFolder } from './persistHelpActions';
import { errorCatcher } from "../services/errorsHandler";
import { sendTokenToGetAuth } from './authActions';
import { clearAfterTimeByFuncRef } from '../services/methods';
import storeCreator from "./../store";
const { store } = storeCreator;
const selectSortType = state =>
  state.persistHelpReducer.driveSortType


export const generateShareLink = (generateShareLinkStatus, generateShareLinkErrors, generatedShareLink) => {
  return { type: GENERATE_SHARE_LINK, generateShareLinkStatus, generateShareLinkErrors, generatedShareLink }
}

export const generateShareLinkACreator = (token, fileId) => (dispatch) => {
  WebApi.oneDrive.post.generateShareLink({token, fileId}).then(response => {
    const { shareLink } = response.replyBlock.data.dtoObject;
    dispatch(generateShareLink(true, [], shareLink));
  }).catch(error => {
    dispatch(generateShareLink(false, errorCatcher(error), ""));
  })
}

export const refreshToken = currentToken => (dispatch) => {
  return new Promise((resolve, reject) => {
    WebApi.oneDrive.get.refreshToken(currentToken).then(response => {
      const { access_token, refresh_token } = response.replyBlock.data.dtoObject;
      dispatch(sendTokenToGetAuth(access_token, true, [], refresh_token));
      resolve(access_token);
    }).catch(error => {
      dispatch(sendTokenToGetAuth("", null, [], ""));
      reject(error);
    })
  })
}

export const authOneDrive = (authStatus, authErrors, authRedirectLink) => {
  return {
    type: ONE_DRIVE_AUTH,
    authStatus,
    authErrors,
    authRedirectLink
  };
};

export const authOneDriveACreator = () => {
  return dispatch => {
    WebApi.oneDrive.get
      .getRedirectLink()
      .then(response => {
        dispatch(
          authOneDrive(true, [], response.replyBlock.data.dtoObject.link)
        );
      })
      .catch(error => {
        dispatch(authOneDrive(false, errorCatcher(error), ""));
        dispatch(clearAfterTimeByFuncRef(authOneDrive, 5000, null, []));
      });
  };
};

export const sendCodeToGetTokenACreator = url => {
  return dispatch => {
    const indexOfEqualMark = url.search("=");
    const codeWithNotNeededId = url.substring(indexOfEqualMark + 1, url.length);
    let codeWithoutId = null;
    if(codeWithNotNeededId.length > 50){
      codeWithoutId = codeWithNotNeededId.substring(
        0,
        codeWithNotNeededId.search("&")
      );
    }
    else
      codeWithoutId = codeWithNotNeededId;

    dispatch(sendAuthCodePromise(codeWithoutId)).then(response => {
      const { access_token, refresh_token } = response.replyBlock.data.dtoObject;
      dispatch(sendTokenToGetAuth(access_token, true, [], refresh_token));

      dispatch(getFoldersPromise(access_token, null)).then(folders => {
        dispatch(getFolders(folders, true, [], "/drive/root:"));
      });
    });
  };
};

export const getFolders = (
  folders,
  getFoldersStatus,
  getFoldersErrors,
  path
) => {
  return {
    type: GET_FOLDERS,
    folders,
    getFoldersStatus,
    getFoldersErrors,
    path
  };
};

export const getFolderACreator = (token, path) => {
  return dispatch => {
    dispatch(getFoldersPromise(token, path)).then(response => {
      const sortType = selectSortType(store.getState());
      
      dispatch(getFolders(sortType ? response.reverse() : response, true, [], path));
    });
  };
};

export const getFoldersPromise = (token, path) => dispatch => {
  return new Promise((resolve) => {
    const model = {
      token: token,
      path: path
    };
    WebApi.oneDrive.post
      .getFolders(model)
      .then(response => {
        resolve(response.replyBlock.data.dtoObjects);
      })
      .catch(error => {
        dispatch(getFolders([], false, errorCatcher(error), ""));
      });
  });
};

export const sendAuthCodePromise = codeWithoutId => dispatch => {
  return new Promise((resolve, reject) => {
    WebApi.oneDrive.get
      .sendQuertToAuth(codeWithoutId)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        dispatch(sendTokenToGetAuth("", false, errorCatcher(error), ""));
        reject(error);
      });
  });
};

export const createFolder = (createFolderStatus, createFolderErrors) => {
  return { type: CREATE_FOLDER, createFolderStatus, createFolderErrors };
};

export const createFolderACreator = (folderName, path, token) => {
  return dispatch => {
    const model = {
      "folderName": folderName,
      "path": path,
      "token": token
    };
    WebApi.oneDrive.post
      .createFolder(model)
      .then(response => {
        dispatch(createFolder(true, []));
        dispatch(getFolderACreator(token, path));
        setTimeout(() => {
          dispatch(createFolder(null, []));
        }, 4000);
      })
      .catch(error => {
        dispatch(createFolder(false, errorCatcher(error)));
        setTimeout(() => {
          dispatch(createFolder(null, []));
        }, 4000);
      });
  };
};

export const deleteFolder = (deleteFolderStatus, deleteFolderErrors) => {
  return {
    type: DELETE_FOLDER,
    deleteFolderStatus,
    deleteFolderErrors
  };
};

export const deleteFolderACreator = (folderId, token, path, choosenFolder) => {
  return dispatch => {
    const model = {
      "folderId": folderId,
      "token": token
    };
    WebApi.oneDrive.post
      .deleteFolder(model)
      .then(response => {
        dispatch(deleteFolder(true, []));
        if(choosenFolder){
          if(choosenFolder.id === folderId){
            dispatch(chooseFolder(null));
          }
        }
        
        dispatch(getFolderACreator(token, path));
        setTimeout(() => {
          dispatch(deleteFolder(null, []));
        }, 4000);
      })
      .catch(error => {
        dispatch(deleteFolder(false, errorCatcher(error)));
        setTimeout(() => {
          dispatch(deleteFolder(null, []));
        }, 4000);
      });
  };
};

export const updateFolder = (updateFolderStatus, updateFolderErrors) => {
  return { type: UPDATE_FOLDER, updateFolderStatus, updateFolderErrors };
};

export const updateFolderACreator = (newName, folderId, token, path) => {
  return dispatch => {
    const model = {
      newName: newName,
      folderId: folderId,
      token: token
    };
    WebApi.oneDrive.post
      .updateFolder(model)
      .then(response => {
        dispatch(updateFolder(true, []));
        dispatch(getFolderACreator(token, path));
        setTimeout(() => {
          dispatch(updateFolder(null, []));
        }, 4000);
      })
      .catch(error => {
        dispatch(updateFolder(false, errorCatcher(error)));
        setTimeout(() => {
          dispatch(updateFolder(null, []));
        }, 4000);
      });
  };
};

export const uploadFile = (uploadFileStatus, uploadFileErrors) => {
  return {
    type: UPLOAD_FILE,
    uploadFileStatus,
    uploadFileErrors
  };
};

export const countHowManyItems = (array, item, key) => {
  let counter = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i][key].search(item) !== -1) counter++;
  }
  return counter;
};

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
            setTimeout(() => {
              dispatch(uploadFile(null, []));
            }, 4000);
        }).catch(error => {
            dispatch(uploadFile(false, errorCatcher(error)));
            setTimeout(() => {
              dispatch(uploadFile(null, []));
            }, 4000);
        })
    }
}
export const setParentDetails = (parentId, goBackPath) => {
    return { type: SET_PARENT_DETAILS, parentId, goBackPath }
}
