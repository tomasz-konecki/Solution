import { LOAD_PROJECTS_SUCCESS } from "../constants";
import axios from "axios";
import DCMTWebApi from "../api";

export const loadProjectsSuccess = projects => {
  return {
    type: "LOAD_PROJECTS_SUCCESS",
    projects
  };
};

export const loadProjects = (page, newProject = {}) => {
  return dispatch => {
    DCMTWebApi.getProjects(page)
      .then(response => {
        dispatch(
          loadProjectsSuccess([...response.data.dtoObject.results, newProject])
        );
      })
      .catch(error => {
        throw error;
      });
  };
};
