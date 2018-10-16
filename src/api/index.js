import axios from "axios";
// import * as jwtDecode from "jwt-decode";
import { resolve as BluebirdResolve } from "bluebird/js/browser/bluebird.core.min.js";
import * as usersMocks from "./mock/users";
import * as projectsMocks from "./mock/projects";
import redux from "redux";
import storeCreator from "./../store";
import storage from "redux-persist/lib/storage";
import { push } from "react-router-redux";
import { logout } from "./../actions/authActions";
import {
  refreshToken,
  authOneDrive,
  getFolderACreator
} from "../actions/oneDriveActions";
import ResponseParser from "./responseParser";
import Config from "Config";
import { loginACreator } from "../actions/persistHelpActions";
import { Certificate } from "crypto";
const { store } = storeCreator;

export const API_ENDPOINT = Config.serverUrl;

store.subscribe(listener);
``;

const select = state =>
  state.authReducer.tokens !== undefined ? state.authReducer.tokens.token : "";

const selectLang = state =>
  state.languageReducer.language ? state.languageReducer.language : "pl";

function listener() {
  // const token = `Bearer ${select(store.getState())}`;

  let langHeader = "";

  switch (selectLang(store.getState())) {
    case "pl":
      langHeader = "pl-PL";
      break;
    case "en":
      langHeader = "en-US";
      break;
  }

  axios.defaults.withCredentials = true;
  // axios.defaults.headers.common["Authorization"] = token;
  axios.defaults.headers.common["Accept-Language"] = langHeader;
}

const authValidator = response => {
  if (response.response) {
    if (response.response.status === 401 || response.response === undefined) {
      store.dispatch(logout());
      store.dispatch(push("/"));
    } else {
      if (response.response.config.url.search("onedrive") !== -1) {
        const oneDriveToken = JSON.parse(response.response.config.data).token;
        const startPath = "/drive/root:";
        store
          .dispatch(refreshToken(oneDriveToken))
          .then(response => {
            dispatch(getFolderACreator(response, startPath));
          })
          .catch(error => {
            store.dispatch(authOneDriveACreator());
          });
      } else if (response.response.config.url.search("GDrive") !== -1) {
        dispatch(loginACreator());
      }
    }
  } else {
    store.dispatch(logout());
    store.dispatch(push("/"));
  }

  throw response;
};

const parseSuccess = response => {
  let parser = new ResponseParser(response);
  parser.parse();
  return BluebirdResolve(parser);
};

const parseFailure = response => {
  if (response instanceof Error && response.request === undefined)
    throw response;
  let parser = new ResponseParser(response);
  parser.parse();
  throw parser;
};

const params = obj => {
  return {
    params: obj
  };
};

const WebAround = {
  get: (path, payload) => {
    return axios
      .get(path, payload)
      .then(response => parseSuccess(response))
      .catch(response => authValidator(response))
      .catch(response => parseFailure(response));
  },
  post: (path, payload) => {
    return axios
      .post(path, payload)
      .then(response => parseSuccess(response))
      .catch(response => authValidator(response))
      .catch(response => parseFailure(response));
  },
  put: (path, payload) => {
    return axios
      .put(path, payload)
      .then(response => parseSuccess(response))
      .catch(response => authValidator(response))
      .catch(response => parseFailure(response));
  },
  delete: (path, payload) => {
    return axios
      .delete(path, payload)
      .then(response => parseSuccess(response))
      .catch(response => authValidator(response))
      .catch(response => parseFailure(response));
  },
  patch: (path, payload) => {
    return axios
      .patch(path, payload)
      .then(response => parseSuccess(response))
      .catch(response => authValidator(response))
      .catch(response => parseFailure(response));
  }
};

const WebApi = {
  assignments: {
    get: {
      byEmployee: employeeId => {
        return WebAround.get(
          `${API_ENDPOINT}/assignments/employee/${employeeId}`
        );
      },
      byProject: projectId => {
        return WebAround.get(
          `${API_ENDPOINT}/assignments/project/${projectId}`
        );
      }
    },
    post: assignmentModel => {
      return WebAround.post(`${API_ENDPOINT}/assignments/`, assignmentModel);
    },
    delete: assignmentId => {
      return WebAround.delete(`${API_ENDPOINT}/assignments/${assignmentId}`);
    },
    put: (assignmentId, assignmentModel) => {
      return WebAround.put(
        `${API_ENDPOINT}/assignments/${assignmentId}`,
        assignmentModel
      );
    }
  },
  notification: {
    get: {
      getAll: () => {
        return WebAround.get(`${API_ENDPOINT}/Notification`);
      }
    },
    delete: {
      delete: notificationsIds => {
        return WebAround.delete(`${API_ENDPOINT}/Notification`, {
          data: {
            NotificationIds: notificationsIds
          }
        });
      },
      deleteAll: () => {
        return WebAround.delete(`${API_ENDPOINT}/Notification/All`);
      }
    },
    put: {
      markAsRead: notificationId => {
        return WebAround.put(
          `${API_ENDPOINT}/Notification/MarkAsRead/${notificationId}`
        );
      },
      markAllAsRead: () => {
        return WebAround.put(`${API_ENDPOINT}/Notification/MarkAllAsRead`);
      }
    }
  },
  roles: {
    get: {
      getAll: () => {
        return WebAround.get(`${API_ENDPOINT}/role`);
      }
    },
    post: {
      add: userRoles => {
        return WebAround.post(
          `${API_ENDPOINT}/account/preferedRoles`,
          userRoles
        );
      }
    }
  },
  clients: {
    get: {
      all: () => {
        return WebAround.get(`${API_ENDPOINT}/clients`);
      },
      byClientId: clientId => {
        return WebAround.get(`${API_ENDPOINT}/clients/${clientId}`);
      }
    },
    post: formData => {
      return WebAround.post(`${API_ENDPOINT}/clients/`, formData);
    },
    delete: clientId => {
      return WebAround.delete(`${API_ENDPOINT}/clients/${clientId}`);
    },
    put: {
      info: (clientId, formData) => {
        return WebAround.put(`${API_ENDPOINT}/clients/${clientId}`, formData);
      },
      reactivate: clientId => {
        return WebAround.put(`${API_ENDPOINT}/clients/${clientId}/reactivate`);
      }
    }
  },
  clouds: {
    post: (name, fields, clientId) => {
      return WebAround.post(`${API_ENDPOINT}/clouds/`, {
        name,
        fields,
        clientId
      });
    },
    edit: (cloudId, name, fields, clientId) => {
      return WebAround.put(`${API_ENDPOINT}/clouds/${cloudId}`, {
        name,
        fields,
        clientId
      });
    },
    delete: cloudId => {
      return WebAround.delete(`${API_ENDPOINT}/clouds/${cloudId}`);
    },
    reactivate: cloudId => {
      return WebAround.put(`${API_ENDPOINT}/clouds/${cloudId}/reactivate`);
    }
  },
  education: {
    get: {
      byEmployee: employeeId => {
        return WebAround.get(`${API_ENDPOINT}/employees/${employeeId}`);
      },
      byEducation: educationId => {}
    },
    delete: educationId => {},
    put: educationId => {},
    post: () => {}
  },
  quarterTalks: {
    get: {
      questions: () => {
        return WebAround.get(`${API_ENDPOINT}/QuarterTalks/questions`);
      },
      getQuarterForEmployee: employeeId => {
        return WebAround.get(
          `${API_ENDPOINT}/QuarterTalks/ForEmployee/` + employeeId
        );
      },
      generateDoc: quarterId => {
        return WebAround.get(`${API_ENDPOINT}/QuarterTalks/GenerateDocx/${quarterId}`);
      }
    },
    delete: {
      quarter: quarterId => {
        return WebAround.delete(`${API_ENDPOINT}/QuarterTalks/${quarterId}`);
      },
      question: questionId => {
        return WebAround.delete(`${API_ENDPOINT}/QuarterTalks/Question/${questionId}`);
      }

    },
    put: {
      reactivate: quarterId => {
        return WebAround.put(
          `${API_ENDPOINT}/QuarterTalks/Reactivate/${quarterId}`
        );
      },
      populateQuarter: (model, quarterId) => {
        return WebAround.put(`${API_ENDPOINT}/QuarterTalks/${quarterId}`, model);
      }
    },
    post: {
      addQuestion: model => {
        return WebAround.post(`${API_ENDPOINT}/QuarterTalks/Question`, model)
      },
      createQuarter: model => {
        return WebAround.post(`${API_ENDPOINT}/QuarterTalks`, model);
      },
      planQuarter: (model, shouldSync) => {
        return WebAround.post(
          `${API_ENDPOINT}/QuarterTalks/Planned?syncCalendar=${shouldSync}`,
          model
        );
      },
      reservedDates: (model, checkOutlook) => {
        return WebAround.post(
          `${API_ENDPOINT}/QuarterTalks/GetReservedDates?checkOutlook=${checkOutlook}`,
          model
        );
      }
    }
  },
  certificates: {
    get: {
      byEmployee: employeeId => {
        return WebAround.get(
          `${API_ENDPOINT}/certificates/employee/${employeeId}`
        );
      }
    },
    post: {
      add: certificateModel => {
        return WebAround.post(`${API_ENDPOINT}/certificates`, certificateModel);
      }
    },
    put: {
      update: (certificateId, certificateModel) => {
        return WebAround.put(
          `${API_ENDPOINT}/certificates/${certificateId}`,
          certificateModel
        );
      }
    },
    delete: {
      deleteById: certificateId => {
        return WebAround.delete(
          `${API_ENDPOINT}/certificates/${certificateId}`
        );
      }
    }
  },
  employees: {
    get: {
      byEmployee: employeeId => {
        return WebAround.get(`${API_ENDPOINT}/employees/${employeeId}`);
      },
      capacity: employeeId => {
        return WebAround.get(
          `${API_ENDPOINT}/employees/${employeeId}/capacity`
        );
      },
      capacityRefactor: employeeId => {
        return WebAround.get(
          `${API_ENDPOINT}/employees/${employeeId}/capacityRefactor`
        );
      },
      employeesAndManagers: () => {
        return WebAround.get(`${API_ENDPOINT}/sharedEmployees/getEmployeesAndManagers`);
      },
      emplo: {
        contact: employeeId => {
          return WebAround.get(
            `${API_ENDPOINT}/employees/billenniumemplocontact`,
            params({ employeeId })
          );
        },
        skills: employeeId => {
          return WebAround.get(
            `${API_ENDPOINT}/employees/billenniumemploskills`,
            params({ employeeId })
          );
        }
      }
    },
    post: {
      list: (settings = {}) => {
        return WebAround.post(`${API_ENDPOINT}/employees/`, settings);
      },
      add: employee => {
        return WebAround.post(`${API_ENDPOINT}/employees/add`, employee);
      }
    },
    delete: employeeId => {
      return WebAround.delete(`${API_ENDPOINT}/employees/${employeeId}`);
    },
    put: {
      skills: (employeeId, skillsArray) => {
        return WebAround.put(
          `${API_ENDPOINT}/employees/${employeeId}`,
          skillsArray
        );
      },
      foreignLanguages: (employeeId, languagesArray) => {
        return WebAround.put(
          `${API_ENDPOINT}/employees/${employeeId}`,
          languagesArray
        );
      },
      updateSkype: (skypeId, employeeId) => {
        return WebAround.put(`${API_ENDPOINT}/employees/UpdateSkype`, {
          skypeId,
          employeeId
        });
      }
    },
    patch: {
      data: (employeeId, model) => {
        return WebAround.patch(
          `${API_ENDPOINT}/employees/${employeeId}`,
          model
        );
      },
      reactivate: employeeId => {
        return WebAround.patch(
          `${API_ENDPOINT}/employees/reactivate/${employeeId}`
        );
      }
    }
  },
  sharedEmployees: {
    get: {
      forManager: (managerId) => {
        return WebAround.get(`${API_ENDPOINT}/sharedEmployees/forManager/${managerId}`);
      }
    },
    post: {
      add: (sharedEmployeeModel) => {
        return WebAround.post(`${API_ENDPOINT}/sharedEmployees`, sharedEmployeeModel)
      }
    },
    delete: {
      deleteById: (sharedEmployeeId) => {
        return WebAround.delete(`${API_ENDPOINT}/sharedEmployees/${sharedEmployeeId}`)
      }
    }
  },
  feedbacks: {
    get: {
      all: () => {},
      byFeedback: feedbackId => {},
      byAuthor: authorId => {},
      byEmployee: employeeId => {
        return WebAround.get(
          `${API_ENDPOINT}/feedbacks/employee/${employeeId}?isDeleted=false`
        );
      },
      byProject: projectId => {}
    },
    post: {
      feedback: model => {
        return WebAround.post(`${API_ENDPOINT}/feedbacks`, model);
      }
    }
  },
  foreignLanguages: {
    get: {
      all: () => {},
      byForeignLanguage: foreignLanguageId => {}
    },
    post: () => {},
    delete: foreignLanguageId => {},
    put: foreignLanguageId => {}
  },
  projects: {
    get: {
      projects: (projectId, onlyActiveAssignments = true) => {
        return WebAround.get(
          `${API_ENDPOINT}/projects/${projectId}?onlyActiveAssignments=${onlyActiveAssignments}`
        );
      },
      suggestEmployees: projectId => {
        return WebAround.get(
          `${API_ENDPOINT}/projects/EmployeeWithFreeCapacity?projectId=${projectId}`
        );
      }
    },
    post: {
      list: (settings = {}) => {
        return WebAround.post(`${API_ENDPOINT}/projects/`, settings);
      },
      add: projectModel => {
        return WebAround.post(`${API_ENDPOINT}/projects/add`, projectModel);
      }
    },
    put: {
      project: (projectId, projectModel) => {
        return WebAround.put(
          `${API_ENDPOINT}/projects/${projectId}`,
          projectModel
        );
      },
      owner: (projectId, ownersIdsArray) => {
        return WebAround.put(`${API_ENDPOINT}/projects/owner/${projectId}`, {
          usersIds: ownersIdsArray
        });
      },
      closeProject: projectId => {
        return WebAround.put(`${API_ENDPOINT}/projects/close/${projectId}`);
      },
      close: model => {
        return WebAround.put(`${API_ENDPOINT}/projects/close/${model[0]}`);
      },
      reactivate: model => {
        return WebAround.put(`${API_ENDPOINT}/projects/reactivate/${model[0]}`);
      },
      reactivateProject: projectId => {
        return WebAround.put(
          `${API_ENDPOINT}/projects/reactivate/${projectId}`
        );
      },
      skills: (projectId, skillsArray) => {
        return WebAround.put(
          `${API_ENDPOINT}/projects/skills/${projectId}`,
          skillsArray
        );
      }
    },
    delete: {
      owner: model => {
        return WebAround.delete(`${API_ENDPOINT}/projects/owner/${model[0]}`, {
          data: {
            userId: model[1]
          }
        });
      },
      project: model => {
        return WebAround.delete(`${API_ENDPOINT}/projects/delete/${model[0]}`);
      },
      deleteProject: projectId => {
        return WebAround.delete(`${API_ENDPOINT}/projects/delete/${projectId}`);
      }
    }
  },
  shareProject:{
    get:{
      managers: (projectId) =>{
        return WebAround.get(`${API_ENDPOINT}/shareProject/DestinationManagers/${projectId}`);
      },
      alreadySharedManagers: (projectId) =>{
        return WebAround.get(`${API_ENDPOINT}/shareProject/AlreadySharedManagers/${projectId}`);
      }
    },
    post:{
      add: (projectId, shareProjectModel)=>{
        return WebAround.post(`${API_ENDPOINT}/shareProject/${projectId}`, shareProjectModel);
      }
    },
    delete:{
      cancel: (projectId, shareProjectId)=>{
        return WebAround.delete(`${API_ENDPOINT}/shareProject/${projectId}/${shareProjectId}`);
      }
    }
  },
  reports: {
    get: {
      developers: fileName => {
        return WebAround.get(
          `${API_ENDPOINT}/reports/developers`,
          params({ fileName })
        );
      },
      cv: employeeId => {
        return WebAround.get(`${API_ENDPOINT}/reports/cv/${employeeId}`);
      },
      teams: () => {
        return WebAround.get(`${API_ENDPOINT}/reports/teams/`);
      },
      report: fileName => {
        return WebAround.get(
          `${API_ENDPOINT}/reports/developers?fileName=${fileName}`
        );
      },
      recentReports: numberOfReports =>
        WebAround.get(
          `${API_ENDPOINT}/reports/recentAndFavorites?numberOfReports=${numberOfReports}`
        )
    },
    post: {
      report: (model, hyperlinksOnGDrive, hyperlinksOnOneDrive) => {
        return WebAround.post(
          `${API_ENDPOINT}/reports/developers?hyperlinksOnGDrive=${hyperlinksOnGDrive}&hyperlinksOnOneDrive=${hyperlinksOnOneDrive}`,
          model
        );
      },
      cv: employeeId => {
        return WebAround.post(
          `${API_ENDPOINT}/reports/cv/${employeeId}?forceIncompletePDF=true`
        );
      },
      wordcv: employeeId => {
        return WebAround.post(`${API_ENDPOINT}/reports/WordCv/${employeeId}`);
      }
    },
    delete: {
      report: reportId =>
        WebAround.delete(`${API_ENDPOINT}/reports/unfavorite/${reportId}`)
    }
  },
  CvImport: {
    post: files => {
      return WebAround.post(
        `${API_ENDPOINT}/CvImport/ImportCv`,
        files
        // {
        //   headers: { "Content-Type": "multipart/form-data" }
        // }
      );
    }
  },
  gDrive: {
    get: {
      login: () => {
        return WebAround.get(`${API_ENDPOINT}/gdrive/Login`);
      }
    },
    post: {
      generateShareLink: model => {
        return WebAround.post(
          `${API_ENDPOINT}/GDrive/GenerateShareLink`,
          model
        );
      },
      getFolders: model => {
        return WebAround.post(`${API_ENDPOINT}/GDrive/Get`, model);
      },
      deleteFolder: model => {
        return WebAround.post(`${API_ENDPOINT}/GDrive/Delete`, model);
      },
      updateFolder: model => {
        return WebAround.post(`${API_ENDPOINT}/GDrive/Update`, model);
      },
      createFolder: model => {
        return WebAround.post(`${API_ENDPOINT}/GDrive/Create`, model);
      },
      uploadFile: (model, config) => {
        return WebAround.post(`${API_ENDPOINT}/GDrive/Upload`, model, config);
      }
    }
  },
  oneDrive: {
    get: {
      getRedirectLink: shouldRedirectOnCalendar => {
        return WebAround.get(
          `${API_ENDPOINT}/onedrive/auth?=${
            shouldRedirectOnCalendar ? shouldRedirectOnCalendar : false
          }`
        );
      },
      sendQuertToAuth: (code, shouldRedirectOnCalendar) => {
        return WebAround.get(
          `${API_ENDPOINT}/onedrive/authenticated?code=${code}&calendar=${
            shouldRedirectOnCalendar ? shouldRedirectOnCalendar : false
          }`
        );
      },
      refreshToken: oldToken => {
        return WebAround.get(
          `${API_ENDPOINT}/Onedrive/refresh?refresh_token=${oldToken}`
        );
      }
    },
    post: {
      generateShareLink: model => {
        return WebAround.post(`${API_ENDPOINT}/onedrive/share`, model);
      },
      getFolders: model => {
        return WebAround.post(`${API_ENDPOINT}/onedrive/files`, model);
      },
      createFolder: model => {
        return WebAround.post(`${API_ENDPOINT}/onedrive/createFolder`, model);
      },
      deleteFolder: model => {
        return WebAround.post(`${API_ENDPOINT}/onedrive/deleteFolder`, model);
      },
      updateFolder: model => {
        return WebAround.post(`${API_ENDPOINT}/onedrive/updateFolder`, model);
      },
      uploadFile: (model, config) => {
        return WebAround.post(`${API_ENDPOINT}/onedrive/upload`, model, config);
      }
    }
  },
  responsiblePerson: {
    get: {
      byClient: clientId => {
        return WebAround.get(
          `${API_ENDPOINT}/responsiblepersons/client/${clientId}`
        );
      },
      byResponsiblePerson: responsiblePersonId => {
        return WebAround.get(
          `${API_ENDPOINT}/responsiblepersons/${responsiblePersonId}`
        );
      }
    },
    edit: (
      responsiblePersonId,
      firstName,
      lastName,
      email,
      phoneNumber,
      client
    ) => {
      return WebAround.put(
        `${API_ENDPOINT}/responsiblePersons/${responsiblePersonId}`,
        {
          firstName,
          lastName,
          email,
          phoneNumber,
          client
        }
      );
    },
    post: (firstName, lastName, client, email, phoneNumber) => {
      return WebAround.post(`${API_ENDPOINT}/responsiblepersons`, {
        firstName,
        lastName,
        client,
        email,
        phoneNumber
      });
    },
    delete: responsiblePersonId => {
      return WebAround.delete(
        `${API_ENDPOINT}/responsiblepersons`,
        params({ responsiblePersonId })
      );
    },
    reactivate: responsiblePersonId => {
      return WebAround.put(
        `${API_ENDPOINT}/responsiblepersons/${responsiblePersonId}/reactivate`
      );
    }
  },
  skills: {
    get: {
      all: () => {
        return WebAround.get(`${API_ENDPOINT}/skills`);
      },
      bySkill: skillId => {
        return WebAround.get(`${API_ENDPOINT}/skills/${skillId}`);
      }
    },
    post: newName => {
      return WebAround.post(`${API_ENDPOINT}/skills`, { name: newName });
    },
    delete: skillId => {
      return WebAround.delete(`${API_ENDPOINT}/skills/${skillId}`);
    },
    put: (skillId, skillModel) => {
      return WebAround.put(`${API_ENDPOINT}/skills/${skillId}`, skillModel);
    }
  },
  stats: {
    get: {
      basic: () => {
        return WebAround.get(`${API_ENDPOINT}/stats/basic`);
      }
    }
  },
  users: {
    get: {
      byUser: userId => {
        return WebAround.get(`${API_ENDPOINT}/account/${userId}`);
      },
      adSearch: query => {
        return WebAround.get(`${API_ENDPOINT}/account/searchAD/${query}`);
      }
    },
    post: {
      list: (settings = {}) => {
        return WebAround.post(`${API_ENDPOINT}/account`, settings);
      },
      listOfRequests: (settings = {}) => {
        return WebAround.post(`${API_ENDPOINT}/account/requests`, settings);
      },
      add: (userId, roles) => {
        return WebAround.post(`${API_ENDPOINT}/account/add`, {
          id: userId,
          roles
        });
      },
      login: (login, password) => {
        return axios
          .post(`${API_ENDPOINT}/account/login`, { login, password })
          .then(response => response.data.dtoObject);
      },
      logout: () => {
        return axios.post(`${API_ENDPOINT}/account/logout`);
      },
      token: refreshToken => {
        return axios.post(`${API_ENDPOINT}/account/login`, { refreshToken });
      }
    },
    delete: {
      user: userId => {
        return WebAround.delete(`${API_ENDPOINT}/account/${userId}`);
      },
      request: userId => {
        return WebAround.delete(
          `${API_ENDPOINT}/account/requests`,
          params({ userId })
        );
      }
    },
    patch: {
      roles: (userId, roles) => {
        return WebAround.patch(`${API_ENDPOINT}/account`, {
          Id: userId,
          Roles: roles
        });
      },
      reactivate: userId => {
        return WebAround.patch(`${API_ENDPOINT}/account/reactivate/${userId}`);
      }
    }
  },
  workExperience: {
    get: {
      byExperience: workExperienceId => {},
      byEmployee: employeeId => {}
    },
    post: () => {},
    delete: () => {},
    put: () => {}
  }
};

class DCMTWebApi {
  auth(login, password) {
    return axios
      .post(`${API_ENDPOINT}/account/login`, { login, password })
      .then(response => response.data.dtoObject);
  }

  getStatistics() {
    return axios.get(`${API_ENDPOINT}/statistics`);
  }

  getUsers(settings = {}) {
    return axios
      .post(`${API_ENDPOINT}/account`, settings)
      .catch(response => authValidator(response));
  }

  searchAD(user) {
    return axios
      .get(`${API_ENDPOINT}/account/searchAD/${user}`)
      .catch(response => authValidator(response));
  }

  addUser(id, roles) {
    return axios
      .post(`${API_ENDPOINT}/account/add`, { id, roles })
      .catch(response => authValidator(response));
  }

  deleteUser(id) {
    return axios
      .delete(`${API_ENDPOINT}/account/${id}`)
      .catch(response => authValidator(response));
  }

  getUser(id) {
    return axios
      .get(`${API_ENDPOINT}/account/${id}`)
      .catch(response => authValidator(response));
  }

  reactivateUser(id) {
    return axios
      .patch(`${API_ENDPOINT}/account/reactivate/${id}`)
      .catch(response => authValidator(response));
  }

  changeUserRole(id, roles) {
    return axios
      .patch(`${API_ENDPOINT}/account`, {
        id,
        roles
      })
      .catch(response => authValidator(response));
  }

  getProjects(settings = {}) {
    return axios
      .post(`${API_ENDPOINT}/projects`, settings)
      .catch(response => authValidator(response));
  }

  getProject(id) {
    return axios
      .get(`${API_ENDPOINT}/projects/${id}`)
      .catch(response => authValidator(response));
  }

  addProject({
    name,
    description,
    client,
    responsiblePerson,
    startDate,
    estimatedEndDate
  }) {
    return axios.post(`${API_ENDPOINT}/projects/add`, {
      name,
      description,
      client,
      responsiblePerson,
      startDate,
      estimatedEndDate
    });
    //.catch(response => authValidator(response));
  }

  editProject({
    id,
    name,
    description,
    client,
    responsiblePerson,
    startDate,
    estimatedEndDate
  }) {
    return axios.put(`${API_ENDPOINT}/projects/${id}`, {
      name,
      client,
      description,
      responsiblePerson,
      startDate,
      estimatedEndDate
    });
    //.catch(response => authValidator(response));
  }

  addOwners(projectId, ownersArray) {
    return axios.put(`${API_ENDPOINT}/projects/${projectId}/owner`, {
      usersIds: ownersArray
    });
    //.catch(response => authValidator(response));
  }

  deleteProject(id) {
    return axios.delete(`${API_ENDPOINT}/projects/${id}/delete`);
    //.catch(response => authValidator(response));
  }

  closeProject(id) {
    return axios.put(`${API_ENDPOINT}/projects/${id}/close`);
    //.catch(response => authValidator(response));
  }

  reactivateProject(id) {
    return axios.put(`${API_ENDPOINT}/projects/${id}/reactivate`);
    //.catch(response => authValidator(response));
  }

  putProjectSkills(id, skillsArray) {
    return axios.put(`${API_ENDPOINT}/projects/${id}/skills`, skillsArray);
    //.catch(response => authValidator(response));
  }

  deleteProjectOwner(ownerId, projectId) {
    return axios.delete(`${API_ENDPOINT}/projects/${projectId}/owner`, {
      data: {
        userId: ownerId
      }
    });
    //.catch(response => authValidator(response));
  }

  getAssignmentsForEmployee(id) {
    return axios.get(`${API_ENDPOINT}/assignments/employee/${id}`);
    //.catch(response => authValidator(response));
  }

  getAssignmentsForProject(id) {
    return axios.get(`${API_ENDPOINT}/assignments/project/${id}`);
    //.catch(response => authValidator(response));
  }

  addAssignment(
    employeeId,
    projectId,
    startDate,
    endDate,
    role,
    assignedCapacity,
    responsibilitiesArray
  ) {
    return axios.post(`${API_ENDPOINT}/assignments`, {
      employeeId,
      projectId,
      startDate,
      endDate,
      role,
      assignedCapacity,
      responsibilities: responsibilitiesArray
    });
    //.catch(response => authValidator(response));
  }

  editAssignment(id, startDate, endDate, role, assignedCapacity) {
    return axios.put(`${API_ENDPOINT}/assignments/${id}`, {
      startDate,
      endDate,
      role,
      assignedCapacity
    });
    //.catch(response => authValidator(response));
  }

  deleteAssignment(id) {
    return axios.delete(`${API_ENDPOINT}/assignments/${id}`);
    //.catch(response => authValidator(response));
  }

  getEmployees(settings = {}) {
    return (
      axios
        .post(`${API_ENDPOINT}/employees`, settings)
        .then(response => parseSuccess(response))
        //.catch(response => authValidator(response))
        .catch(response => parseFailure(response))
    );
  }

  getEmployee(id) {
    return axios.get(`${API_ENDPOINT}/employees/${id}`);
    //.catch(response => authValidator(response));
  }

  addEmployee(id, capacity, seniority, skillsArray) {
    return axios.post(`${API_ENDPOINT}/employees/add`, {
      id,
      capacity,
      seniority,
      skills: skillsArray
    });
    //.catch(response => authValidator(response));
  }

  editEmployee(id, seniority, capacity) {
    return axios.patch(`${API_ENDPOINT}/employees/${id}`, {
      seniority,
      capacity
    });
    //.catch(response => authValidator(response));
  }

  editEmployeeSkills(id, skillsArray) {
    return axios.put(`${API_ENDPOINT}/employees/${id}/skills`, skillsArray);
    //.catch(response => authValidator(response));
  }

  getEmploSkills(employeeId) {
    return axios.get(`${API_ENDPOINT}/employees/BillenniumEmploSkills`, {
      params: {
        employeeId
      }
    });
    //.catch(response => authValidator(response));
  }

  getEmploContactInfo(employeeId) {
    return axios.get(`${API_ENDPOINT}/employees/BillenniumEmploContact`, {
      params: {
        employeeId
      }
    });
    //.catch(response => authValidator(response));
  }

  overrideSkillsOnEmployee(id, skillsArray) {
    return axios.put(`${API_ENDPOINT}/employee/${id}`, skillsArray);
    //.catch(response => authValidator(response));
  }

  deleteEmployee(id) {
    return axios.delete(`${API_ENDPOINT}/employees/${id}`);
    //.catch(response => authValidator(response));
  }

  changeEmployeeSeniority(id, seniority, role) {
    return axios.patch(`${API_ENDPOINT}/employees/${id}`, { seniority, role });
    //.catch(response => authValidator(response));
  }

  addSkill(name) {
    return axios.post(`${API_ENDPOINT}/skills`, { name });
    //.catch(response => authValidator(response));
  }

  getSkills() {
    return axios.get(`${API_ENDPOINT}/skills`);
    //.catch(response => authValidator(response));
  }

  deleteSkill(name, level) {
    return axios.delete(`${API_ENDPOINT}/skills`, { name, level });
    //.catch(response => authValidator(response));
  }

  // addResponsiblePerson(firstName, lastName, clientId, phoneNumber, email) {
  //   return axios.post(`${API_ENDPOINT}/responsiblepersons`, {
  //     firstName,
  //     lastName,
  //     clientId,
  //     phoneNumber,
  //     email
  //   });
  // }
}

// ------------------------------------------------------------------------------

class DCMTMockApi extends DCMTWebApi {
  pretendResponse(dtoObject, simulateError) {
    const status = simulateError ? 400 : 200;
    const statusText = simulateError ? "Internal Server Error" : "OK";
    return {
      data: {
        dtoObject,
        errorOccurred: simulateError,
        errors: {}
      },
      status,
      statusText
    };
  }

  auth(username, password) {
    return BluebirdResolve({
      email: "jane.doe@kappa.com",
      extra: "Jane Doe"
    });
  }

  getUsers(page, simulateError = false) {
    return BluebirdResolve(
      this.pretendResponse(usersMocks.UsersObject(page), simulateError)
    );
  }

  searchAD(user, simulateError = false) {
    return BluebirdResolve(
      this.pretendResponse(usersMocks.ActiveDirectory(user, simulateError))
    );
  }

  addUser(id, role, simulateError = false) {
    return BluebirdResolve(this.pretendResponse(null, simulateError));
  }

  getUser(id, simulateError = false) {
    return BluebirdResolve(
      this.pretendResponse(usersMocks.UserObject(id, simulateError))
    );
  }

  changeUserRole(id, role, simulateError = false) {
    return BluebirdResolve(this.pretendResponse(null, simulateError));
  }

  deleteUser(id, simulateError = false) {
    return BluebirdResolve(this.pretendResponse(null, simulateError));
  }

  addProject(
    { projectName, description, client, responsiblePerson, startDate, endDate },
    simulateError = false
  ) {
    return BluebirdResolve(this.pretendResponse(null, simulateError));
  }

  editProject(
    id,
    name,
    description,
    client,
    responsiblePerson,
    startDate,
    estimatedEndDate,
    simulateError = false
  ) {
    return BluebirdResolve(this.pretendResponse(null, simulateError));
  }

  deleteProject(id, simulateError = false) {
    return BluebirdResolve(this.pretendResponse(null, simulateError));
  }

  getProjects(page, simulateError = false) {
    return BluebirdResolve(
      this.pretendResponse(projectsMocks.ProjectsObject(page), simulateError)
    );
  }

  getProject(id, simulateError = false) {
    return BluebirdResolve(
      this.pretendResponse(projectsMocks.ProjectObject(id, simulateError))
    );
  }

  addOwner(id, simulateError = false) {
    return BluebirdResolve(this.pretendResponse(null, simulateError));
  }
}

export default WebApi;
