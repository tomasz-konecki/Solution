import { LOAD_PROJECTS_SUCCESS, CHANGE_EDITED_PROJECT, GET_PROJECT, names, overViewNames, 
ADD_EMPLOYEE_TO_PROJECT, DELETE_PROJECT_OWNER, DELETE_PROJECT, CLOSE_PROJECT, REACTIVATE_PROJECT, 
CHANGE_PROJECT_SKILL, ADD_FEEDBACK, GET_FEEDBACKS
 } from "../constants";
import axios from "axios";
import WebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";
import { errorCatcher } from '../services/errorsHandler';
import { cutNotNeededKeysFromArray } from '../services/methods';
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



export const getProject = (project, loadProjectStatus, loadProjectErrors, responsiblePersonKeys, 
  overViewKeys) => {
  return {
    type: GET_PROJECT,
    project,
    loadProjectStatus,
    loadProjectErrors,
    responsiblePersonKeys,
    overViewKeys
  }
}

export const getProjectACreator = projectId => {
  return dispatch => {
    WebApi.projects.get(projectId).then(response => {
      const responsiblePersonKeys = {keys: cutNotNeededKeysFromArray(
        Object.keys(response.replyBlock.data.dtoObject.responsiblePerson), [0]), 
        names: names};
      
      const overViewKeys = {keys: cutNotNeededKeysFromArray(
          Object.keys(response.replyBlock.data.dtoObject), [0,1,2,7,8,9,10,11]), 
          names: overViewNames};
     
      dispatch(getProject(response.replyBlock.data.dtoObject, 
          true, [], responsiblePersonKeys, overViewKeys, []));

    }).catch(error => {
      dispatch(getProject(response.replyBlock.data.dtoObject, 
        false, errorCatcher(error)));
    })
  }
  
}

export const addEmployeeToProject = (addEmployeeToProjectStatus, addEmployeeToProjectErrors) => {
  return {
    type: ADD_EMPLOYEE_TO_PROJECT,
    addEmployeeToProjectStatus,
    addEmployeeToProjectErrors
  }
}
export const addEmployeeToProjectACreator = (empId, projectId, strDate, endDate, role, assignedCapacity, responsibilites) => {
  return dispatch => {
    const objectToAdd = {
      "employeeId": empId,
      "projectId": projectId,
      "startDate": strDate,
      "endDate": endDate,
      "role": role,
      "assignedCapacity": assignedCapacity/10,
      "responsibilities": responsibilites
    }
    WebApi.assignments.post(objectToAdd).then(response => {
        dispatch(addEmployeeToProject(true, []));
        dispatch(getProjectACreator(projectId));
      }).catch(error => {
        dispatch(addEmployeeToProject(false, errorCatcher(error)));
      })
  }
}

export const deleteProjectOwner = (delProjectOwnerStatus, delProjectOwnerErrors) => {
  return {
    type: DELETE_PROJECT_OWNER, 
    delProjectOwnerStatus,
    delProjectOwnerErrors
  }
}
export const deleteProjectOwnerACreator = (projectId, ownerId) => {
  return dispatch => {
    WebApi.projects.delete.owner(projectId, ownerId).then(response => {
        dispatch(deleteProjectOwner(true, []));
        dispatch(getProjectACreator(projectId));
      }).catch(error => {
        dispatch(deleteProjectOwner(false, errorCatcher(error)));
      })
  }
}
export const deleteProject = (deleteProjectStatus, deleteProjectErrors) => {
  return {
    type: DELETE_PROJECT,
    deleteProjectStatus,
    deleteProjectErrors
  }
}
export const deleteProjectACreator = projectId => {
  return dispatch => {
    WebApi.projects.delete.project(projectId).then(response => {
      dispatch(deleteProject(true, []));
      dispatch(getProjectACreator(projectId));
    }).catch(error => {
      dispatch(deleteProject(false, errorCatcher(error)));
    });
  }
}
export const closeProject = (closeProjectStatus, closeProjectErrors) => {
  return {
    type: CLOSE_PROJECT,
    closeProjectStatus,
    closeProjectErrors
  }
}
export const closeProjectACreator = projectId => {
  return dispatch => {
    WebApi.projects.put.close(projectId).then(response => {
      dispatch(closeProject(true, []));
      dispatch(getProjectACreator(projectId));
    }).catch(error => {
      dispatch(closeProject(false, errorCatcher(error)));
    })
  }
}

export const reactivateProject = (reactivateProjectStatus, reactivateProjectErrors) => {
  return {
    type: REACTIVATE_PROJECT,
    reactivateProjectStatus,
    reactivateProjectErrors
  }
}
export const reactivateProjectACreator = projectId => {
  return dispatch => {
    WebApi.projects.put.reactivate(projectId).then(response => {
      dispatch(reactivateProject(true, []));
      dispatch(getProjectACreator(projectId));
    }).catch(error => {
      dispatch(reactivateProject(false, errorCatcher(error)));
    })
  }
}
export const changeProjectSkill = (changeProjectSkillStatus, changeProjectSkillErrors) => {
  return {
    type: CHANGE_PROJECT_SKILL,
    changeProjectSkillStatus,
    changeProjectSkillErrors
  }
}
export const changeProjectSkillACreator = (projectId, skillId, skillLevel) => {
  const objectToSend = {
    "skillId": skillId,
    "skillLevel": skillLevel
  }
  return dispatch => {
    WebApi.projects.put.skills(projectId, objectToSend).then(response => {
      dispatch(changeProjectSkill(true, []));
    }).catch(error => {
      dispatch(changeProjectSkill(false, errorCatcher(error)));
    })
  }
}


export const addFeedback = (addFeedbackStatus, addFeedbackErrors) => {
  return {
    type: ADD_FEEDBACK,
    addFeedbackStatus,
    addFeedbackErrors
  }
}

export const addFeedbackACreator = (projectId, employeeId, description) => {
  const objectToSend = {
    "projectId": projectId,
    "employeeId": employeeId,
    "description": description
  }
  return dispatch => {
    WebApi.feedbacks.post.feedback(objectToSend).then(response => {
      console.log(response);
      dispatch(addFeedback(true, []));
    }).catch(error => {
      console.log(error);
      dispatch(addFeedback(false, errorCatcher(error)));
    })
  }
}

export const getFeedbacks = (loadedFeedbacks, loadFeedbackStatus, loadFeedbackErrors) => {
  return {
    type: GET_FEEDBACKS,
    loadedFeedbacks,
    loadFeedbackStatus,
    loadFeedbackErrors
  }
}

export const getFeedbacksACreator = employeeId => {
  return dispatch => {
    WebApi.feedbacks.get.byEmployee(employeeId)
    .then(response => {
      console.log(response);
      dispatch(getFeedbacks([], true, []));
    }).catch(error => {
      console.log(error);
      dispatch(getFeedbacks([], false, errorCatcher(error)));
    })
  }
}