import WebApi from "../api";

import {
  ACCOUNT_CAN_SEARCH_USERS_ACCOUNTS,
  PROJECT_CAN_SEARCH_PROJECTS
} from "../constants";

export const infoActionCreator = () => {
  return dispatch => {
    dispatch(accountPostUsersListACreator());
    dispatch(projectsPostProjectsListACreator());
  };
};

//ACCOUNT
export const accountPostUsersList = (status, loading) => {
  return {
    type: ACCOUNT_CAN_SEARCH_USERS_ACCOUNTS,
    status,
    loading
  };
};
//CREATORS
export const accountPostUsersListACreator = () => {
  return dispatch => {
    dispatch(accountPostUsersList(false, true));
    WebApi.users.post
      .list({ Limit: 1, Page: 1 })
      .then(response => {
        !response.errorOccurred() &&
          dispatch(accountPostUsersList(true, false));
      })
      .catch(dispatch(accountPostUsersList(false, false)));
  };
};

//PROJECTS
export const projectsPostProjectsList = (status, loading) => {
  return {
    type: PROJECT_CAN_SEARCH_PROJECTS,
    status,
    loading
  };
};
//CREATORS
export const projectsPostProjectsListACreator = () => {
  return dispatch => {
    dispatch(projectsPostProjectsList(false, true));
    setTimeout(() => {
      WebApi.projects.post
        .list({ Limit: 1, Page: 1 })
        .then(response => {
          !response.errorOccurred() &&
            dispatch(projectsPostProjectsList(true, false));
        })
        .catch(dispatch(projectsPostProjectsList(false, false)));
    }, 2000);
  };
};
