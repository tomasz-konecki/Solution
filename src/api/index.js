import axios from "axios";
import * as jwtDecode from "jwt-decode";
import * as Promise from "bluebird";
import * as usersMocks from "./mock/users";
import * as projectsMocks from "./mock/projects";
import redux from "redux";
import storeCreator from "./../store";
import storage from "redux-persist/lib/storage";
import { push } from "react-router-redux";
import { logout } from "./../actions/authActions";
import ResponseParser from "./responseParser";
import Config from "Config";

const { store } = storeCreator;

const API_ENDPOINT = Config.serverUrl;

store.subscribe(listener);
``;

const select = state =>
  state.authReducer.tokens !== undefined ? state.authReducer.tokens.token : "";

const selectLang = state =>
  state.languageReducer.language !== undefined
    ? state.languageReducer.language
    : "pl";

function listener() {
  const token = `Bearer ${select(store.getState())}`;

  let langHeader = "";

  switch (selectLang(store.getState())) {
    case "pl":
      langHeader = "pl-PL";
      break;
    case "en":
      langHeader = "en-US";
      break;
  }

  axios.defaults.headers.common["Authorization"] = token;
  axios.defaults.headers.common["Accept-Language"] = langHeader;
}

const authValidator = response => {
  if (response.response === undefined) {
    throw response;
  }
  if (response.response.status === 401) {
    store.dispatch(logout());
    store.dispatch(push("/"));
  }
  throw response;
};

const parseSuccess = response => {
  let parser = new ResponseParser(response);
  parser.parse();
  return Promise.resolve(parser);
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
  clients: {
    get: {
      all: () => {
        return WebAround.get(`${API_ENDPOINT}/clients`);
      },
      byClientId: clientId => {
        return WebAround.get(`${API_ENDPOINT}/clients/${clientId}`);
      }
    },
    post: name => {
      return WebAround.post(`${API_ENDPOINT}/clients/`, { name });
    },
    delete: clientId => {
      return WebAround.delete(`${API_ENDPOINT}/clients/${clientId}`);
    },
    put: {
      info: (clientId, clientName) => {
        return WebAround.put(`${API_ENDPOINT}/clients/${clientId}`, {
          name: clientName
        });
      },
      reactivate: clientId => {
        return WebAround.put(`${API_ENDPOINT}/clients/${clientId}/reactivate`);
      }
    }
  },
  clouds: {
    post: (name, clientId) => {
      return WebAround.post(`${API_ENDPOINT}/clouds/`, { name, clientId });
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
          `${API_ENDPOINT}/employees/${employeeId}/reactivate`
        );
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
          `${API_ENDPOINT}/feedbacks/employee/${employeeId}`
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
    get: projectId => {
      return WebAround.get(`${API_ENDPOINT}/projects/${projectId}`);
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
          userIds: ownersIdsArray
        });
      },
      close: projectId => {
        return WebAround.put(`${API_ENDPOINT}/projects/close/${projectId}`);
      },
      reactivate: projectId => {
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
      owner: (projectId, ownerId) => {
        return WebAround.delete(`${API_ENDPOINT}/projects/owner/${projectId}`, {
          data: {
            userId: ownerId
          }
        });
      },
      project: projectId => {
        return WebAround.delete(`${API_ENDPOINT}/projects/delete/${projectId}`);
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
      }
    },
    post: {
      report: (model, param) => {
        return WebAround.post(`${API_ENDPOINT}/reports/developers`, model);
      }
    }
  },
  gDrive: {
    get: {
      login: () => {
        return WebAround.get(`${API_ENDPOINT}/gdrive/Login`);
      }
    }
  },
  oneDrive: {
    get: {
      authBegin: () => {
        return WebAround.get(`${API_ENDPOINT}/api/onedrive/auth`);
      },
      sendQuertToAuth: (code) => {
        return WebAround.get(`${API_ENDPOINT}/api/onedrive/authenticated?code=${code}`);
      }
    },
    post: {
      getFolders: (model) => {
        return WebAround.post(`${API_ENDPOINT}/api/onedrive/files`, model);
      },
      createFolder: (model) => {
        return WebAround.post(`${API_ENDPOINT}/api/onedrive/createFolder`, model);
      },
      deleteFolder: (model) => {
        return WebAround.post(`${API_ENDPOINT}/api/onedrive/deleteFolder`, model);
      },
      updateFolder: (model) => {
        return WebAround.post(`${API_ENDPOINT}/api/onedrive/updateFolder`, model);
      },
      uploadFile: (model, config) => {
        return WebAround.post(`${API_ENDPOINT}/api/onedrive/upload`, model, config);
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
        return WebAround.get(`${API_ENDPOINT}/users/${userId}`);
      },
      adSearch: query => {
        return WebAround.get(`${API_ENDPOINT}/users/searchAD/${query}`);
      }
    },
    post: {
      list: (settings = {}) => {
        return WebAround.post(`${API_ENDPOINT}/users`, settings);
      },
      listOfRequests: (settings = {}) => {
        return WebAround.post(`${API_ENDPOINT}/users/requests`, settings);
      },
      add: (userId, roles) => {
        return WebAround.post(`${API_ENDPOINT}/users/add`, {
          id: userId,
          roles
        });
      },
      login: (login, password) => {
        return axios
          .post(`${API_ENDPOINT}/users/login`, { login, password })
          .then(response => response.data.dtoObject);
      },
      logout: () => {
        return axios.post(`${API_ENDPOINT}/users/logout`);
      },
      token: refreshToken => {
        return axios.post(`${API_ENDPOINT}/users/login`, { refreshToken });
      }
    },
    delete: {
      user: userId => {
        return WebAround.delete(`${API_ENDPOINT}/users/${userId}`);
      },
      request: userId => {
        return WebAround.delete(
          `${API_ENDPOINT}/users/requests`,
          params({ userId })
        );
      }
    },
    patch: {
      roles: (userId, roles) => {
        return WebAround.patch(`${API_ENDPOINT}/users`, {
          id: userId,
          roles
        });
      },
      reactivate: userId => {
        return WebAround.patch(`${API_ENDPOINT}/users/reactivate/${userId}`);
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
      .post(`${API_ENDPOINT}/users/login`, { login, password })
      .then(response => response.data.dtoObject);
  }

  getStatistics() {
    return axios.get(`${API_ENDPOINT}/statistics`);
  }

  getUsers(settings = {}) {
    return axios
      .post(`${API_ENDPOINT}/users`, settings)
      .catch(response => authValidator(response));
  }

  searchAD(user) {
    return axios
      .get(`${API_ENDPOINT}/users/searchAD/${user}`)
      .catch(response => authValidator(response));
  }

  addUser(id, roles) {
    return axios
      .post(`${API_ENDPOINT}/users/add`, { id, roles })
      .catch(response => authValidator(response));
  }

  deleteUser(id) {
    return axios
      .delete(`${API_ENDPOINT}/users/${id}`)
      .catch(response => authValidator(response));
  }

  getUser(id) {
    return axios
      .get(`${API_ENDPOINT}/users/${id}`)
      .catch(response => authValidator(response));
  }

  reactivateUser(id) {
    return axios
      .patch(`${API_ENDPOINT}/users/reactivate/${id}`)
      .catch(response => authValidator(response));
  }

  changeUserRole(id, roles) {
    return axios
      .patch(`${API_ENDPOINT}/users`, {
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
    return axios
      .post(`${API_ENDPOINT}/projects/add`, {
        name,
        description,
        client,
        responsiblePerson,
        startDate,
        estimatedEndDate
      })
      .catch(response => authValidator(response));
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
    return axios
      .put(`${API_ENDPOINT}/projects/${id}`, {
        name,
        client,
        description,
        responsiblePerson,
        startDate,
        estimatedEndDate
      })
      .catch(response => authValidator(response));
  }

  addOwners(projectId, ownersArray) {
    return axios
      .put(`${API_ENDPOINT}/projects/${projectId}/owner`, {
        usersIds: ownersArray
      })
      .catch(response => authValidator(response));
  }

  deleteProject(id) {
    return axios
      .delete(`${API_ENDPOINT}/projects/${id}/delete`)
      .catch(response => authValidator(response));
  }

  closeProject(id) {
    return axios
      .put(`${API_ENDPOINT}/projects/${id}/close`)
      .catch(response => authValidator(response));
  }

  reactivateProject(id) {
    return axios
      .put(`${API_ENDPOINT}/projects/${id}/reactivate`)
      .catch(response => authValidator(response));
  }

  putProjectSkills(id, skillsArray) {
    return axios
      .put(`${API_ENDPOINT}/projects/${id}/skills`, skillsArray)
      .catch(response => authValidator(response));
  }

  deleteProjectOwner(ownerId, projectId) {
    return axios
      .delete(`${API_ENDPOINT}/projects/${projectId}/owner`, {
        data: {
          userId: ownerId
        }
      })
      .catch(response => authValidator(response));
  }

  getAssignmentsForEmployee(id) {
    return axios
      .get(`${API_ENDPOINT}/assignments/employee/${id}`)
      .catch(response => authValidator(response));
  }

  getAssignmentsForProject(id) {
    return axios
      .get(`${API_ENDPOINT}/assignments/project/${id}`)
      .catch(response => authValidator(response));
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
    return axios
      .post(`${API_ENDPOINT}/assignments`, {
        employeeId,
        projectId,
        startDate,
        endDate,
        role,
        assignedCapacity,
        responsibilities: responsibilitiesArray
      })
      .catch(response => authValidator(response));
  }

  editAssignment(id, startDate, endDate, role, assignedCapacity) {
    return axios
      .put(`${API_ENDPOINT}/assignments/${id}`, {
        startDate,
        endDate,
        role,
        assignedCapacity
      })
      .catch(response => authValidator(response));
  }

  deleteAssignment(id) {
    return axios
      .delete(`${API_ENDPOINT}/assignments/${id}`)
      .catch(response => authValidator(response));
  }

  getEmployees(settings = {}) {
    return axios
      .post(`${API_ENDPOINT}/employees`, settings)
      .then(response => parseSuccess(response))
      .catch(response => authValidator(response))
      .catch(response => parseFailure(response));
  }

  getEmployee(id) {
    return axios
      .get(`${API_ENDPOINT}/employees/${id}`)
      .catch(response => authValidator(response));
  }

  addEmployee(id, capacity, seniority, skillsArray) {
    return axios
      .post(`${API_ENDPOINT}/employees/add`, {
        id,
        capacity,
        seniority,
        skills: skillsArray
      })
      .catch(response => authValidator(response));
  }

  editEmployee(id, seniority, capacity) {
    return axios
      .patch(`${API_ENDPOINT}/employees/${id}`, {
        seniority,
        capacity
      })
      .catch(response => authValidator(response));
  }

  editEmployeeSkills(id, skillsArray) {
    return axios
      .put(`${API_ENDPOINT}/employees/${id}/skills`, skillsArray)
      .catch(response => authValidator(response));
  }

  getEmploSkills(employeeId) {
    return axios
      .get(`${API_ENDPOINT}/employees/BillenniumEmploSkills`, {
        params: {
          employeeId
        }
      })
      .catch(response => authValidator(response));
  }

  getEmploContactInfo(employeeId) {
    return axios
      .get(`${API_ENDPOINT}/employees/BillenniumEmploContact`, {
        params: {
          employeeId
        }
      })
      .catch(response => authValidator(response));
  }

  overrideSkillsOnEmployee(id, skillsArray) {
    return axios
      .put(`${API_ENDPOINT}/employee/${id}`, skillsArray)
      .catch(response => authValidator(response));
  }

  deleteEmployee(id) {
    return axios
      .delete(`${API_ENDPOINT}/employees/${id}`)
      .catch(response => authValidator(response));
  }

  changeEmployeeSeniority(id, seniority, role) {
    return axios
      .patch(`${API_ENDPOINT}/employees/${id}`, { seniority, role })
      .catch(response => authValidator(response));
  }

  addSkill(name) {
    return axios
      .post(`${API_ENDPOINT}/skills`, { name })
      .catch(response => authValidator(response));
  }

  getSkills() {
    return axios
      .get(`${API_ENDPOINT}/skills`)
      .catch(response => authValidator(response));
  }

  deleteSkill(name, level) {
    return axios
      .delete(`${API_ENDPOINT}/skills`, { name, level })
      .catch(response => authValidator(response));
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
    return Promise.resolve({
      email: "jane.doe@kappa.com",
      extra: "Jane Doe"
    });
  }

  getUsers(page, simulateError = false) {
    return Promise.resolve(
      this.pretendResponse(usersMocks.UsersObject(page), simulateError)
    );
  }

  searchAD(user, simulateError = false) {
    return Promise.resolve(
      this.pretendResponse(usersMocks.ActiveDirectory(user, simulateError))
    );
  }

  addUser(id, role, simulateError = false) {
    return Promise.resolve(this.pretendResponse(null, simulateError));
  }

  getUser(id, simulateError = false) {
    return Promise.resolve(
      this.pretendResponse(usersMocks.UserObject(id, simulateError))
    );
  }

  changeUserRole(id, role, simulateError = false) {
    return Promise.resolve(this.pretendResponse(null, simulateError));
  }

  deleteUser(id, simulateError = false) {
    return Promise.resolve(this.pretendResponse(null, simulateError));
  }

  addProject(
    { projectName, description, client, responsiblePerson, startDate, endDate },
    simulateError = false
  ) {
    return Promise.resolve(this.pretendResponse(null, simulateError));
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
    return Promise.resolve(this.pretendResponse(null, simulateError));
  }

  deleteProject(id, simulateError = false) {
    return Promise.resolve(this.pretendResponse(null, simulateError));
  }

  getProjects(page, simulateError = false) {
    return Promise.resolve(
      this.pretendResponse(projectsMocks.ProjectsObject(page), simulateError)
    );
  }

  getProject(id, simulateError = false) {
    return Promise.resolve(
      this.pretendResponse(projectsMocks.ProjectObject(id, simulateError))
    );
  }

  addOwner(id, simulateError = false) {
    return Promise.resolve(this.pretendResponse(null, simulateError));
  }
}

export default WebApi;
