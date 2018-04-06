import { LOAD_PROJECTS_SUCCESS, CHANGE_EDITED_PROJECT } from "../constants";
import axios from "axios";
import DCMTWebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";

export const loadProjectsSuccess = projects => {
  return {
    type: LOAD_PROJECTS_SUCCESS,
    projects
  };
};

export const loadProjects = (page = 1, limit = 25, other = {}) => {
  const settings = Object.assign({}, {
    Limit: limit,
    PageNumber: page,
    IsDeleted: false
  }, other);
  return dispatch => {
    dispatch(asyncStarted());
    DCMTWebApi.getProjects(settings)
      .then(response => {
        dispatch(loadProjectsSuccess(response.data.dtoObject));
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(asyncEnded());
      });
  };
};

export const changeEditedProjectId = projectId => {
  return {
    type: CHANGE_EDITED_PROJECT,
    projectId
  };
};
