import {
  LOAD_PROJECTS_SUCCESS,
  CHANGE_EDITED_PROJECT,
  GET_PROJECT,
  names,
  overViewNames,
  ADD_EMPLOYEE_TO_PROJECT,
  CHANGE_PROJECT_SKILLS,
  ADD_FEEDBACK,
  GET_FEEDBACKS,
  EDIT_PROJECT,
  ADD_SKILLS_TO_PROJECT,
  CHANGE_PROJECT_STATE,
  CREATE_PROJECT,
  GET_SUGGEST_EMPLOYEES,
  CHANGE_GET_SUGGEST_EMPLOYEES_STATUS,
  GET_CONTACT_PERSON_DATA
} from "../constants";
import axios from "axios";
import WebApi from "../api";
import {
  asyncStarted,
  asyncEnded,
  changeOperationStatus
} from "./asyncActions";
import { errorCatcher } from "../services/errorsHandler";
import { cutNotNeededKeysFromArray } from "../services/methods";
import moment from "moment";
export const loadProjectsSuccess = projects => {
  return {
    type: LOAD_PROJECTS_SUCCESS,
    projects
  };
};

export const loadProjects = (
  page = 1,
  limit = 15,
  other = { isDeleted: false }
) => {
  other.isDeleted =
    other.ProjectFilter && other.ProjectFilter.status && !other.isDeleted
      ? false
      : other.isDeleted;

  const settings = Object.assign(
    {},
    {
      Limit: limit,
      PageNumber: page
    },
    other
  );
  return dispatch => {
    dispatch(asyncStarted());
    WebApi.projects.post
      .list(settings)
      .then(response => {
        if (!response.errorOccurred()) {
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

export const getProject = (
  project,
  loadProjectStatus,
  loadProjectErrors,
  responsiblePersonKeys,
  overViewKeys
) => {
  return {
    type: GET_PROJECT,
    project,
    loadProjectStatus,
    loadProjectErrors,
    responsiblePersonKeys,
    overViewKeys
  };
};

export const getProjectACreator = (projectId, onlyActiveAssignments) => {
  return dispatch => {
    WebApi.projects.get
      .projects(projectId, onlyActiveAssignments)
      .then(response => {
        const responsiblePersonKeys = {
          keys: cutNotNeededKeysFromArray(
            Object.keys(response.replyBlock.data.dtoObject.responsiblePerson),
            [0]
          ),
          names: names
        };

        const overViewKeys = {
          keys: cutNotNeededKeysFromArray(
            Object.keys(response.replyBlock.data.dtoObject),
            [0, 1, 2, 7, 8, 9, 10, 11]
          ),
          names: overViewNames
        };

        dispatch(
          getProject(
            response.replyBlock.data.dtoObject,
            true,
            [],
            responsiblePersonKeys,
            overViewKeys,
            []
          )
        );

        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(getProject(null, false, errorCatcher(error), [], []));
        dispatch(asyncEnded());
      });
  };
};

export const addEmployeeToProject = (
  addEmployeeToProjectStatus,
  addEmployeeToProjectErrors
) => {
  return {
    type: ADD_EMPLOYEE_TO_PROJECT,
    addEmployeeToProjectStatus,
    addEmployeeToProjectErrors
  };
};
const addEmployeeToProjectPromise = objectToAdd => dispatch => {
  return new Promise((resolve, reject) => {
    WebApi.assignments
      .post(objectToAdd)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};
export const addEmployeeToProjectACreator = (
  empId,
  projectId,
  strDate,
  endDate,
  role,
  assignedCapacity,
  responsibilites,
  onlyActiveAssignments
) => {
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
    dispatch(addEmployeeToProjectPromise(objectToAdd)).then(response => {
      dispatch(addEmployeeToProject(true, []));
      
      dispatch(getProjectACreator(projectId, onlyActiveAssignments));
      dispatch(clearAfterTimeByFuncRef(addEmployeeToProject, 5000, null, []));
      
    }).catch(error => {
      dispatch(addEmployeeToProject(false, errorCatcher(error)));
      dispatch(clearAfterTimeByFuncRef(addEmployeeToProject, 5000, null, []));
      
    })
  }
}

const clearAfterTimeByFuncRef = (funcRef, delay, ...params) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(funcRef(...params))
    }, delay);
  }
}


export const addFeedback = (addFeedbackStatus, addFeedbackErrors) => {
  return {
    type: ADD_FEEDBACK,
    addFeedbackStatus,
    addFeedbackErrors
  };
};

export const addFeedbackACreator = (projectId, employeeId, description) => {
  return dispatch => {
    const objectToSend = {
      projectId: projectId,
      employeeId: employeeId,
      description: description
    };
    WebApi.feedbacks.post
      .feedback(objectToSend)
      .then(response => {
        dispatch(addFeedback(true, []));
      })
      .catch(error => {
        dispatch(addFeedback(false, errorCatcher(error)));
      });
  };
};

export const getFeedbacks = (
  loadedFeedbacks,
  loadFeedbackStatus,
  loadFeedbackErrors
) => {
  return {
    type: GET_FEEDBACKS,
    loadedFeedbacks,
    loadFeedbackStatus,
    loadFeedbackErrors
  };
};

export const getFeedbacksACreator = employeeId => {
  return dispatch => {
    WebApi.feedbacks.get
      .byEmployee(employeeId)
      .then(response => {
        dispatch(getFeedbacks(response.replyBlock.data.dtoObjects, true, []));
      })
      .catch(error => {
        dispatch(getFeedbacks([], false, errorCatcher(error)));
      });
  };
};

export const editProject = (editProjectStatus, editProjectErrors) => {
  return {
    type: EDIT_PROJECT,
    editProjectStatus,
    editProjectErrors
  };
};
const editProjectPromise = (projectToSend, projectId) => dispatch => {
  return new Promise((resolve, reject) => {
    WebApi.projects.put
      .project(projectId, projectToSend)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};
const getProjectPromise = (projectId, onlyActiveAssignments) => dispatch => {
  return new Promise((resolve, reject) => {
    WebApi.projects.get
      .projects(projectId, onlyActiveAssignments)
      .then(response => {
        resolve(response.replyBlock.data.dtoObject);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const editProjectACreator = (
  projectId,
  projectToSend,
  onlyActiveAssignments
) => {
  return dispatch => {
    console.log(projectToSend);
    console.log(onlyActiveAssignments);

    dispatch(editProjectPromise(projectToSend, projectId)).then(response => {
      dispatch(editProject(true, []));

      dispatch(clearAfterTimeByFuncRef(editProject, 5000, null, []));
      
      dispatch(getProjectPromise(projectId, onlyActiveAssignments)).then(getProjectResponse => {
        const responsiblePersonKeys = {keys: cutNotNeededKeysFromArray(
          Object.keys(getProjectResponse.responsiblePerson), [0]), 
          names: names};
        
        const overViewKeys = {keys: cutNotNeededKeysFromArray(
            Object.keys(getProjectResponse), [0,1,2,7,8,9,10,11]), 
            names: overViewNames};
        
        dispatch(getProject(getProjectResponse, 
            true, [], responsiblePersonKeys, overViewKeys, []));

      
      }).catch(error => {
        dispatch(getProject(null, 
          false, errorCatcher(error), [], []));
        dispatch(clearAfterTimeByFuncRef(getProject, 5000, null, null, [], [], []));
        
      })
    }).catch(error => {
      dispatch(editProject(false, errorCatcher(error)));
      dispatch(clearAfterTimeByFuncRef(editProject, 5000, null, []));
      
    })
  }
}
     
export const changeProjectSkills = (
  changeProjectSkillsStatus,
  changeProjectSkillsErrors
) => {
  return {
    type: CHANGE_PROJECT_SKILLS,
    changeProjectSkillsStatus,
    changeProjectSkillsErrors
  };
};
export const changeProjectSkillsACreator = (
  projectId,
  skills,
  onlyActiveAssignments
) => {
  return dispatch => {
    const skillsToSend = [];
    let somethingChanged = false;
    for (let key in skills) {
      if (skills[key].startValue !== skills[key].obj.skillLevel) {
        skillsToSend.push({
          skillId: skills[key].obj.skillId,
          skillLevel: skills[key].startValue
        });
        somethingChanged = true;
      } else {
        skillsToSend.push({
          skillId: skills[key].obj.skillId,
          skillLevel: skills[key].obj.skillLevel
        });
      }
    }

    if (somethingChanged) {
      WebApi.projects.put
        .skills(projectId, skillsToSend)
        .then(response => {
          dispatch(changeProjectSkills(true, []));
          dispatch(getProjectACreator(projectId, onlyActiveAssignments));
        })
        .catch(error => {
          dispatch(changeProjectSkills(false, errorCatcher(error)));
        });
    } else
      dispatch(changeProjectSkills(false, ["Nie zmieniono żadnej wartości"]));
  };
};

export const addSkillsToProject = (
  addSkillsToProjectStatus,
  addSkillsToProjectErrors
) => {
  return {
    type: ADD_SKILLS_TO_PROJECT,
    addSkillsToProjectStatus,
    addSkillsToProjectErrors
  };
};

export const addSkillsToProjectACreator = (
  projectId,
  currentAddedSkills,
  onlyActiveAssignments
) => {
  return dispatch => {
    const skillsToSend = [];
    for (let key in currentAddedSkills) {
      const whichIdIsExist = currentAddedSkills[key].obj.id
        ? currentAddedSkills[key].obj.id
        : currentAddedSkills[key].obj.skillId;
      skillsToSend.push({
        skillId: whichIdIsExist,
        skillLevel: currentAddedSkills[key].startValue
      });
    }
    WebApi.projects.put
      .skills(projectId, skillsToSend)
      .then(response => {
        dispatch(addSkillsToProject(true, []));
        dispatch(getProjectACreator(projectId, onlyActiveAssignments));
      })
      .catch(error => {
        dispatch(addSkillsToProject(false, errorCatcher(error)));
      });
  };
};

export const changeProjectStatePromise = (func, ...params) => dispatch => {
  return new Promise((resolve, reject) => {
    func(...params)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const changeProjectState = (
  changeProjectStateStatus,
  changeProjectStateErrors,
  currentOperation
) => {
  return {
    type: CHANGE_PROJECT_STATE,
    changeProjectStateStatus,
    changeProjectStateErrors,
    currentOperation
  };
};
export const changeProjectStateACreator = (
  ApiOperation,
  currentOperation,
  model
) => {
  return dispatch => {
    dispatch(asyncStarted());
    dispatch(changeProjectStatePromise(ApiOperation, Object.values(model)))
      .then(response => {
        dispatch(changeProjectState(true, [], currentOperation));
        dispatch(
          getProjectACreator(model.projectId, model.onlyActiveAssignments)
        );
      })
      .catch(error => {
        dispatch(changeProjectState(false, errorCatcher(error), ""));
        dispatch(asyncEnded());
      });
  };
};
export const clearProjectState = () => {
  return {
    type: CHANGE_PROJECT_STATE,
    changeProjectStateStatus: null,
    changeProjectStateErrors: [],
    currentOperation: ""
  };
};

export const createProject = (createProjectStatus, createProjectErrors) => {
  return { type: CREATE_PROJECT, createProjectStatus, createProjectErrors };
};

export const createProjectACreator = (firstArray, secondArray) => dispatch => {
  return new Promise((resolve, reject) => {
    const model = {
      name: firstArray[0].value,
      description: firstArray[1].value,
      client: firstArray[3].value ? firstArray[3].value : firstArray[2].value,
      responsiblePerson: {
        firstName: secondArray[1].value,
        lastName: secondArray[2].value,
        email: secondArray[0].value,
        phoneNumber: secondArray[3].value
      },
      startDate: firstArray[4].value,
      estimatedEndDate: firstArray[5].value
    };
    WebApi.projects.post
      .add(model)
      .then(response => {
        dispatch(createProject(true, []));
        resolve(response.replyBlock.data.dtoObject);
      })
      .catch(error => {
        dispatch(createProject(false, errorCatcher(error)));
        reject(error);
      });
  })
}
export const getSuggestEmployeesStatus = (getSuggestEmployeesStatus, getSuggestEmployeesError) =>{
  return {
    type: CHANGE_GET_SUGGEST_EMPLOYEES_STATUS,
    getSuggestEmployeesStatus,
    getSuggestEmployeesError
  }
}
export const getSuggestEmployees = suggestEmployees =>{
  return {type: GET_SUGGEST_EMPLOYEES, suggestEmployees}
}

export const getSuggestEmployeesACreator = projectId =>{
  return dispatch => {
    WebApi.projects.get.suggestEmployees(projectId)
      .then(response =>{
        if(!response.errorOccurred()){
          dispatch(getSuggestEmployees(response.extractData()));
          dispatch(getSuggestEmployeesStatus(true,[]));
        }
      })
      .catch(error => {
        dispatch(getSuggestEmployeesStatus(false,errorCatcher(error)));
      });
  };
};


export const getContactPersonData = (contactPersonData, getContactPersonDataStatus, getContactPersonDataErrors) => {
  return {
    type: GET_CONTACT_PERSON_DATA, contactPersonData, getContactPersonDataStatus, getContactPersonDataErrors
  }
}

export const getContactPersonDataACreator = clientId => dispatch => {
  return new Promise((resolve, reject) => {
    WebApi.responsiblePerson.get.byClient(clientId).then(response => {
      const { dtoObjects } = response.replyBlock.data;
      dispatch(getContactPersonData(dtoObjects, true, []));
      resolve(dtoObjects);
    }).catch(error => {
      dispatch(getContactPersonData([], false, errorCatcher(error)));
      reject(error);
    })
  })
}
