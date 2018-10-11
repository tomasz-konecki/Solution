import {
  LOAD_EMPLOYEES_SUCCESS,
  ASYNC_STARTED,
  ASYNC_ENDED,
  LOAD_EMPLOYEES_FAILURE,
  GET_EMPLOYEE,
  CHANGE_EMPLOYEE_OPERATION_STATUS,
  CHANGE_EMPLOYEE_STATE,
  LOAD_ASSIGNMENTS,
  DELETE_QUATER,
  REACTIVATE_QUATER,
  CHANGE_EMPLOYEE_SKILLS,
  ADD_NEW_SKILLS_TO_EMPLOYEE,
  UPDATE_EMPLOYEE_SKYPE_ID,
  CHANGE_CERTIFICATES_GET_STATUS,
  ADD_CERTIFICATE_RESULT,
  GET_CERTYFICATES
} from "../constants";
import WebApi from "../api";
import {
  asyncStarted,
  asyncEnded,
  setActionConfirmationResult
} from "./asyncActions";
import { errorCatcher } from "../services/errorsHandler";
import { populateSkillArrayWithConstData } from "../services/methods";

export const loadEmployeesSuccess = employees => {
  return {
    type: LOAD_EMPLOYEES_SUCCESS,
    employees
  };
};

export const loadEmployeesFailure = resultBlock => {
  return {
    type: LOAD_EMPLOYEES_FAILURE,
    resultBlock
  };
};

export const updateSkypeResult = (resultBlock, loading) => {
  return {
    type: UPDATE_EMPLOYEE_SKYPE_ID,
    resultBlock,
    loading
  };
};

export const downloadCV = (format, employeeId) => {
  if (format === "word") {
    WebApi.reports.post.wordcv(employeeId);
  } else {
    WebApi.reports.post
      .cv(employeeId)
      .then(WebApi.reports.get.cv(employeeId + ".pdf"));
  }
};

export const updateSkype = (skypeId, employeeId) => {
  return dispatch => {
    dispatch(updateSkypeResult(null, true));
    WebApi.employees.put
      .updateSkype(skypeId, employeeId)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(updateSkypeResult(response, false)),
            dispatch(clearUpdateSkypeAfterTime(5000));
        }
      })
      .catch(error => {
        dispatch(updateSkypeResult(error, false)).then(
          clearUpdateSkypeAfterTime(5000)
        );
      });
  };
};

const clearUpdateSkypeAfterTime = delay => {
  return dispatch => {
    setTimeout(() => {
      dispatch(updateSkypeResult(null, false));
    }, delay);
  };
};

export const loadEmployees = (page = 1, limit = 25, other = {}) => {
  return dispatch => {
    const settings = Object.assign(
      {},
      { Limit: limit, PageNumber: page, isDeleted: null },
      other
    );

    dispatch(asyncStarted());
    WebApi.employees.post
      .list(settings)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(loadEmployeesSuccess(response.extractData()));
        }
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(loadEmployeesFailure(error));
        dispatch(asyncEnded());
      });
  };
};

export const changeLoadCertificatesStatus = (
  loadCertificatesStatus,
  loadCertificatesErrors
) => {
  return {
    type: CHANGE_CERTIFICATES_GET_STATUS,
    loadCertificatesStatus,
    loadCertificatesErrors
  };
};

export const getCertificates = certificates => {
  return {
    type: GET_CERTYFICATES,
    certificates
  };
};

export const loadCertificates = employeeId => {
  return dispatch => {
    WebApi.certificates.get
      .byEmployee(employeeId)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(getCertificates(response.extractData()));
          dispatch(changeLoadCertificatesStatus(true, []));
        }
      })
      .catch(error => {
        dispatch(changeLoadCertificatesStatus(false, errorCatcher(error)));
      });
  };
};

export const changeEmployeeOperationStatus = (
  employeeStatus,
  employeeErrors
) => {
  return {
    type: CHANGE_EMPLOYEE_OPERATION_STATUS,
    employeeStatus,
    employeeErrors
  };
};

export const getEmployee = employee => {
  return { type: GET_EMPLOYEE, employee };
};

export const getEmployeePromise = employeeId => dispatch => {
  return new Promise(resolve => {
    WebApi.employees.get
      .byEmployee(employeeId)
      .then(response => {
        const { dtoObject } = response.replyBlock.data;
        dispatch(getEmployee(dtoObject));
        dispatch(changeEmployeeOperationStatus(true, []));
        resolve(dtoObject);
      })
      .catch(error => {
        dispatch(changeEmployeeOperationStatus(false, errorCatcher(error)));
        dispatch(clearAfterTime(5000));
      });
  });
};

const clearAfterTime = delay => {
  return dispatch => {
    setTimeout(() => {
      dispatch(changeEmployeeOperationStatus(null, []));
    }, delay);
  };
};

export const deleteEmployee = employeeId => {
  return dispatch => {
    WebApi.employees
      .delete(employeeId)
      .then(response => {
        dispatch(getEmployeePromise(employeeId));
      })
      .catch(error => {
        dispatch(changeEmployeeOperationStatus(false, errorCatcher(error)));
        dispatch(clearAfterTime(5000));
      });
  };
};

export const deleteEmployeeOnList = (
  employeeId,
  pageChange,
  setActionConfirmationResult
) => {
  return dispatch => {
    WebApi.employees
      .delete(employeeId)
      .then(response => {
        setActionConfirmationResult(response);
        pageChange();
      })
      .catch(error => {
        setActionConfirmationResult(error);
      });
  };
};

export const reActivateEmployeeOnList = (
  employeeId,
  pageChange,
  setActionConfirmationResult
) => {
  return dispatch => {
    WebApi.employees.patch
      .reactivate(employeeId)
      .then(response => {
        setActionConfirmationResult(response);
        pageChange();
      })
      .catch(error => {
        setActionConfirmationResult(error);
      });
  };
};

export const reactivateEmployee = employeeId => {
  return dispatch => {
    WebApi.employees.patch
      .reactivate(employeeId)
      .then(response => {
        dispatch(getEmployeePromise(employeeId)).then(secondResponse => {
          dispatch(loadAssignmentsACreator(employeeId));
        });
      })
      .catch(error => {
        dispatch(changeEmployeeState(false, errorCatcher(error), ""));
        dispatch(clearAfterTimeStatus(5000));
      });
  };
};

export const editStatistics = (
  employeeId,
  seniority,
  capacity,
  currentClouds
) => {
  return dispatch => {
    const model = {
      seniority: seniority,
      capacity: capacity,
      cloudsIds: currentClouds
    };
    WebApi.employees.patch
      .data(employeeId, model)
      .then(response => {
        dispatch(getEmployeePromise(employeeId));
      })
      .catch(error => {
        dispatch(changeEmployeeOperationStatus(false, errorCatcher(error)));
        dispatch(clearAfterTime(5000));
      });
  };
};

export const changeEmployeeState = (
  employeeOperationStatus,
  employeeOperationErrors,
  employeeResultMessage
) => {
  return {
    type: CHANGE_EMPLOYEE_STATE,
    employeeOperationStatus,
    employeeOperationErrors,
    employeeResultMessage
  };
};

export const activateEmployeeOnList = (
  employeeId,
  seniority,
  capacity,
  pageChange,
  setActionConfirmationResult
) => {
  return dispatch => {
    const model = {
      id: employeeId,
      seniority: seniority,
      capacity: capacity
    };

    WebApi.employees.post
      .add(model)
      .then(response => {
        setActionConfirmationResult(response);
        pageChange();
      })
      .catch(error => {
        setActionConfirmationResult(error);
      });
  };
};

export const activateEmployee = (employeeId, seniority, capacity) => {
  return dispatch => {
    const model = {
      id: employeeId,
      seniority: seniority,
      capacity: capacity
    };
    WebApi.employees.post
      .add(model)
      .then(response => {
        dispatch(getEmployeePromise(employeeId)).then(() => {
          dispatch(loadAssignmentsACreator(employeeId));
        });
      })
      .catch(error => {
        dispatch(changeEmployeeState(false, errorCatcher(error), ""));
        dispatch(clearAfterTimeStatus(5000));
      });
  };
};
const clearAfterTimeStatus = delay => {
  return dispatch => {
    setTimeout(() => {
      dispatch(changeEmployeeState(null, [], ""));
    }, delay);
  };
};

export const loadAssignments = (
  loadAssignmentsStatus,
  loadAssignmentsErrors,
  loadedAssignments
) => {
  return {
    type: LOAD_ASSIGNMENTS,
    loadAssignmentsStatus,
    loadAssignmentsErrors,
    loadedAssignments
  };
};

export const loadAssignmentsACreator = employeeId => dispatch => {
  return new Promise((resolve, reject) => {
    WebApi.assignments.get
      .byEmployee(employeeId)
      .then(response => {
        dispatch(
          loadAssignments(true, [], response.replyBlock.data.dtoObjects)
        );
        resolve(response.replyBlock.data.dtoObjects);
      })
      .catch(error => {
        dispatch(loadAssignments(false, errorCatcher(error), []));
        reject(response.replyBlock.data.dtoObjects);
      });
  });
};

export const deleteQuater = (deleteQuaterStatus, deleteQuaterErrors) => {
  return { type: DELETE_QUATER, deleteQuaterStatus, deleteQuaterErrors };
};

export const deleteQuaterACreator = (quarterId, employeeId) => {
  return dispatch => {
    WebApi.quarterTalks
      .delete(quarterId)
      .then(response => {
        dispatch(deleteQuater(true, []));
        dispatch(getEmployeePromise(employeeId));

        dispatch(clearAfterTimeByFuncRef(deleteQuater, 5000, null, []));
      })
      .catch(error => {
        dispatch(deleteQuater(false, errorCatcher(error)));
        dispatch(clearAfterTimeByFuncRef(deleteQuater, 5000, null, []));
      });
  };
};

const clearAfterTimeByFuncRef = (funcRef, delay, ...params) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(funcRef(...params));
    }, delay);
  };
};

export const reactivateQuater = (
  reactivateQuaterStatus,
  reactivateQuaterErrors,
  reactivateQuaterMessage
) => {
  return {
    type: REACTIVATE_QUATER,
    reactivateQuaterStatus,
    reactivateQuaterErrors,
    reactivateQuaterMessage
  };
};

export const reactivateQuaterACreator = (quaterId, employeeId, message) => {
  return dispatch => {
    WebApi.quarterTalks.put
      .reactivate(quaterId)
      .then(response => {
        dispatch(reactivateQuater(true, [], message));
        dispatch(getEmployeePromise(employeeId));

        dispatch(clearAfterTimeByFuncRef(reactivateQuater, 5000, null, []));
      })
      .catch(error => {
        dispatch(reactivateQuater(false, errorCatcher(error)));
        dispatch(clearAfterTimeByFuncRef(reactivateQuater, 5000, null, []));
      });
  };
};

export const changeEmployeeSkills = (
  changeSkillsStatus,
  changeSkillsErrors
) => {
  return {
    type: CHANGE_EMPLOYEE_SKILLS,
    changeSkillsStatus,
    changeSkillsErrors
  };
};

export const changeEmployeeSkillsACreator = (employeeId, currentArray) => {
  return dispatch => {
    const skillsArray = [];
    for (let key in currentArray) {
      skillsArray.push({
        skillId: currentArray[key].skill.id,
        skillLevel: currentArray[key].skill.level,
        yearsOfExperience: currentArray[key].skill.yearsOfExperience
      });
    }
    WebApi.employees.put
      .skills(employeeId, skillsArray)
      .then(response => {
        dispatch(changeEmployeeSkills(true, []));
        dispatch(clearAfterTimeByFuncRef(changeEmployeeSkills, 1500, null, []));
      })
      .catch(error => {
        dispatch(changeEmployeeSkills(false, errorCatcher(error)));
        dispatch(clearAfterTimeByFuncRef(changeEmployeeSkills, 5000, null, []));
      });
  };
};

export const addNewSkillsToEmployee = (
  addNewSkillsStatus,
  addNewSkillsErrors
) => {
  return {
    type: ADD_NEW_SKILLS_TO_EMPLOYEE,
    addNewSkillsStatus,
    addNewSkillsErrors
  };
};

export const addNewSkillsToEmployeeACreator = (
  oldSkills,
  newSkills,
  employeeId
) => {
  return dispatch => {
    let model = [];
    for (let key in oldSkills) {
      model.push({
        skillId: oldSkills[key].skill.id.toString(),
        skillLevel: oldSkills[key].skill.level,
        yearsOfExperience: oldSkills[key].skill.yearsOfExperience
      });
    }
    model = model.concat(populateSkillArrayWithConstData(newSkills));

    WebApi.employees.put
      .skills(employeeId, model)
      .then(response => {
        dispatch(addNewSkillsToEmployee(true, []));
        dispatch(getEmployeePromise(employeeId));
      })
      .catch(error => {
        dispatch(addNewSkillsToEmployee(false, errorCatcher(error)));
      });
  };
};

export const addCertificateResult = resultBlockAddCertificate => {
  return {
    type: ADD_CERTIFICATE_RESULT,
    resultBlockAddCertificate
  };
};

export const deleteCertificate = (certificateId, employeeId) => {
  return dispatch => {
    WebApi.certificates.delete
      .deleteById(certificateId)
      .then(response => {
        dispatch(setActionConfirmationResult(response));
        dispatch(loadCertificates(employeeId));
      })
      .catch(error => {
        dispatch(setActionConfirmationResult(error));
      });
  };
};

export const addCertificate = (cretificate, userId) => {
  return dispatch => {
    WebApi.certificates.post
      .add(cretificate)
      .then(response => {
        dispatch(addCertificateResult(response));

        setTimeout(() => {
          dispatch(addCertificateResult(null));
          dispatch(loadCertificates(userId));
        }, 2000);
      })
      .catch(error => {
        dispatch(addCertificateResult(error));
        setTimeout(() => {
          dispatch(addCertificateResult(null));
        }, 2000);
        throw error;
      });
  };
};

export const editCertificate = (certificateId, newCretificate, userId) => {
  return dispatch => {
    WebApi.certificates.put
      .update(certificateId, newCretificate)
      .then(response => {
        dispatch(addCertificateResult(response));

        setTimeout(() => {
          dispatch(addCertificateResult(null));
          dispatch(loadCertificates(userId));
        }, 2000);
      })
      .catch(error => {
        dispatch(addCertificateResult(error));
        setTimeout(() => {
          dispatch(addCertificateResult(null));
        }, 2000);
        throw error;
      });
  };
};
