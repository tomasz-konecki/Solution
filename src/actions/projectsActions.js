import { LOAD_PROJECTS_SUCCESS, CHANGE_EDITED_PROJECT } from "../constants";
import axios from "axios";
import WebApi from "../api";
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
    PageNumber: page
  }, other);
  return dispatch => {
    dispatch(asyncStarted());
    WebApi.projects.post.list(settings)
      .then(response => {
        console.log(response.data);
        if(!response.errorOccurred()) {
          dispatch(loadProjectsSuccess(response.extractData()));
        }
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


