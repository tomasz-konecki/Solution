import WebApi from "../api";

import {
  ACCOUNT_CAN_SEARCH_USERS_ACCOUNTS,
  ACCOUNT_CAN_CHANGE_USERS_ROLES,
  ACCOUNT_CAN_SEARCH_AD,
  ACCOUNT_CAN_ADD_USER,
  ACCOUNT_CAN_REACTIVATE_USER,
  ACCOUNT_CAN_DELETE_USER,
  ACCOUNT_CAN_DELETE_USER_REQUEST,
  PROJECT_CAN_SEARCH_PROJECTS,
  CLIENT_GET_LIST_OF_CLIENTS,
  CLIENT_POST_CLIENT
} from "../constants";

export const infoActionCreator = () => {
  return dispatch => {
    dispatch(accountPostUsersListACreator());
    dispatch(accountPatchChangeUsersRolesACreator());
    dispatch(accountGetSearchADACreator());
    dispatch(accountPostAddUserACreator());
    dispatch(accountPatchReactivateUserACreator());
    dispatch(accountDeleteUserACreator());
    dispatch(accountDeleteUserRequestsACreator());

    dispatch(projectsPostProjectsListACreator());

    dispatch(clientGetListOfClientsACreator());
    dispatch(clientAddClientACreator());
  };
};

export const genericChangeTypeStatusLoading = (type, status, loading) => {
  return {
    type,
    status,
    loading
  };
};

//ACCOUNT
export const accountPostUsersListACreator = () => {
  return dispatch => {
    dispatch(
      genericChangeTypeStatusLoading(
        ACCOUNT_CAN_SEARCH_USERS_ACCOUNTS,
        false,
        true
      )
    );
    WebApi.users.post
      .list({ Limit: 1, Page: 1 })
      .then(response => {
        !response.errorOccurred() &&
          dispatch(
            genericChangeTypeStatusLoading(
              ACCOUNT_CAN_SEARCH_USERS_ACCOUNTS,
              true,
              false
            )
          );
      })
      .catch(error => {
        dispatch(
          genericChangeTypeStatusLoading(
            ACCOUNT_CAN_SEARCH_USERS_ACCOUNTS,
            false,
            false
          )
        );
      });
  };
};

export const accountPatchChangeUsersRolesACreator = () => {
  return dispatch => {
    dispatch(
      genericChangeTypeStatusLoading(
        ACCOUNT_CAN_CHANGE_USERS_ROLES,
        false,
        true
      )
    );
    WebApi.users.patch
      .roles()
      .then(response => {
        !response.errorOccurred() &&
          dispatch(
            genericChangeTypeStatusLoading(
              ACCOUNT_CAN_CHANGE_USERS_ROLES,
              true,
              false
            )
          );
      })
      .catch(error => {
        dispatch(
          genericChangeTypeStatusLoading(
            ACCOUNT_CAN_CHANGE_USERS_ROLES,
            false,
            false
          )
        );
      });
  };
};

export const accountGetSearchADACreator = () => {
  return dispatch => {
    dispatch(
      genericChangeTypeStatusLoading(ACCOUNT_CAN_SEARCH_AD, false, true)
    );
    WebApi.users.get
      .adSearch()
      .then(response => {
        !response.errorOccurred() &&
          dispatch(
            genericChangeTypeStatusLoading(ACCOUNT_CAN_SEARCH_AD, true, false)
          );
      })
      .catch(error => {
        dispatch(
          genericChangeTypeStatusLoading(ACCOUNT_CAN_SEARCH_AD, false, false)
        );
      });
  };
};

export const accountPostAddUserACreator = () => {
  return dispatch => {
    dispatch(genericChangeTypeStatusLoading(ACCOUNT_CAN_ADD_USER, false, true));
    WebApi.users.get
      .adSearch()
      .then(response => {
        !response.errorOccurred() &&
          dispatch(
            genericChangeTypeStatusLoading(ACCOUNT_CAN_ADD_USER, true, false)
          );
      })
      .catch(error => {
        dispatch(
          genericChangeTypeStatusLoading(ACCOUNT_CAN_ADD_USER, false, false)
        );
      });
  };
};

export const accountPatchReactivateUserACreator = () => {
  return dispatch => {
    dispatch(
      genericChangeTypeStatusLoading(ACCOUNT_CAN_REACTIVATE_USER, false, true)
    );
    WebApi.users.patch
      .reactivate()
      .then(response => {
        !response.errorOccurred() &&
          dispatch(
            genericChangeTypeStatusLoading(
              ACCOUNT_CAN_REACTIVATE_USER,
              true,
              false
            )
          );
      })
      .catch(error => {
        dispatch(
          genericChangeTypeStatusLoading(
            ACCOUNT_CAN_REACTIVATE_USER,
            false,
            false
          )
        );
      });
  };
};

export const accountDeleteUserACreator = () => {
  return dispatch => {
    dispatch(
      genericChangeTypeStatusLoading(ACCOUNT_CAN_DELETE_USER, false, true)
    );
    WebApi.users.delete
      .user()
      .then(response => {
        !response.errorOccurred() &&
          dispatch(
            genericChangeTypeStatusLoading(ACCOUNT_CAN_DELETE_USER, true, false)
          );
      })
      .catch(error => {
        dispatch(
          genericChangeTypeStatusLoading(ACCOUNT_CAN_DELETE_USER, false, false)
        );
      });
  };
};

export const accountDeleteUserRequestsACreator = () => {
  return dispatch => {
    dispatch(
      genericChangeTypeStatusLoading(
        ACCOUNT_CAN_DELETE_USER_REQUEST,
        false,
        true
      )
    );
    WebApi.users.delete
      .request()
      .then(response => {
        !response.errorOccurred() &&
          dispatch(
            genericChangeTypeStatusLoading(
              ACCOUNT_CAN_DELETE_USER_REQUEST,
              true,
              false
            )
          );
      })
      .catch(error => {
        dispatch(
          genericChangeTypeStatusLoading(
            ACCOUNT_CAN_DELETE_USER_REQUEST,
            false,
            false
          )
        );
      });
  };
};

//PROJECTS
export const projectsPostProjectsListACreator = () => {
  return dispatch => {
    dispatch(
      genericChangeTypeStatusLoading(PROJECT_CAN_SEARCH_PROJECTS, false, true)
    );
    WebApi.projects.post
      .list({ Limit: 1, Page: 1 })
      .then(response => {
        !response.errorOccurred() &&
          dispatch(
            genericChangeTypeStatusLoading(
              PROJECT_CAN_SEARCH_PROJECTS,
              true,
              false
            )
          );
      })
      .catch(error => {
        dispatch(
          genericChangeTypeStatusLoading(
            PROJECT_CAN_SEARCH_PROJECTS,
            false,
            false
          )
        );
      });
  };
};

//CLIENT
export const clientGetListOfClientsACreator = () => {
  return dispatch => {
    dispatch(
      genericChangeTypeStatusLoading(CLIENT_GET_LIST_OF_CLIENTS, false, true)
    );
    WebApi.clients.get
      .all()
      .then(response => {
        !response.errorOccurred() &&
          dispatch(
            genericChangeTypeStatusLoading(
              CLIENT_GET_LIST_OF_CLIENTS,
              true,
              false
            )
          );
      })
      .catch(error => {
        dispatch(
          genericChangeTypeStatusLoading(
            CLIENT_GET_LIST_OF_CLIENTS,
            false,
            false
          )
        );
      });
  };
};

export const clientAddClientACreator = () => {
  return dispatch => {
    dispatch(genericChangeTypeStatusLoading(CLIENT_POST_CLIENT, false, true));
    WebApi.clients.get
      .all()
      .then(response => {
        !response.errorOccurred() &&
          dispatch(
            genericChangeTypeStatusLoading(CLIENT_POST_CLIENT, true, false)
          );
      })
      .catch(error => {
        dispatch(
          genericChangeTypeStatusLoading(CLIENT_POST_CLIENT, false, false)
        );
      });
  };
};
