import axios from "axios";
import * as jwtDecode from "jwt-decode";
import * as Promise from "bluebird";
import * as usersMocks from "./mock/users";
import * as projectsMocks from "./mock/projects";
import redux from "redux";
import storeCreator from "./../store";
import storage from "redux-persist/lib/storage";
import { push } from 'react-router-redux';

const { store } = storeCreator;

const API_ENDPOINT = "http://10.24.14.148";

store.subscribe(listener);

const select = state =>
  state.authReducer.tokens !== undefined ? state.authReducer.tokens.token : "";

const selectLang = state =>
  state.languageReducer.language !== undefined ? state.languageReducer.language : "pl";

function listener() {
  const token = `Bearer ${select(store.getState())}`;

  let langHeader = "";

  switch(selectLang(store.getState())){
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

const authValidator = (response) => {
  if(response.response.status === 401){
    store.dispatch(push('/'));
    throw response;
  }
  return response;
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
    return axios.post(`${API_ENDPOINT}/users`, settings)
      .catch(response => authValidator(response));
  }

  searchAD(user) {
    return axios.get(`${API_ENDPOINT}/users/searchAD/${user}`)
      .catch(response => authValidator(response));
  }

  addUser(id, roles) {
    return axios.post(`${API_ENDPOINT}/users/add`, { id, roles })
      .catch(response => authValidator(response));
  }

  deleteUser(id) {
    return axios.delete(`${API_ENDPOINT}/users/${id}`)
      .catch(response => authValidator(response));
  }

  getUser(id) {
    return axios.get(`${API_ENDPOINT}/users/${id}`)
      .catch(response => authValidator(response));
  }

  reactivateUser(id) {
    return axios.patch(`${API_ENDPOINT}/users/reactivate/${id}`)
      .catch(response => authValidator(response));
  }

  changeUserRole(id, roles) {
    return axios.patch(`${API_ENDPOINT}/users`, {
      id,
      roles
    })
      .catch(response => authValidator(response));
  }

  getProjects(settings = {}) {
    return axios.post(`${API_ENDPOINT}/projects`, settings)
      .catch(response => authValidator(response));
  }

  getProject(id) {
    return axios.get(`${API_ENDPOINT}/projects/${id}`)
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
    return axios.put(`${API_ENDPOINT}/projects/${id}`, {
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
    return axios.put(`${API_ENDPOINT}/projects/${projectId}/owner`, {
      usersIds: ownersArray
    })
      .catch(response => authValidator(response));
  }

  deleteProject(id) {
    return axios.delete(`${API_ENDPOINT}/projects/${id}/delete`)
      .catch(response => authValidator(response));
  }

  closeProject(id) {
    return axios.put(`${API_ENDPOINT}/projects/${id}/close`)
      .catch(response => authValidator(response));
  }

  reactivateProject(id) {
    return axios.put(`${API_ENDPOINT}/projects/${id}/reactivate`)
      .catch(response => authValidator(response));
  }

  putProjectSkills(id, skillsArray) {
    return axios.put(`${API_ENDPOINT}/projects/${id}/skills`, skillsArray)
      .catch(response => authValidator(response));
  }

  deleteProjectOwner(ownerId, projectId) {
    return axios.delete(`${API_ENDPOINT}/projects/${projectId}/owner`, {
      data: {
        userId: ownerId
      }
    })
      .catch(response => authValidator(response));
  }

  getAssignmentsForEmployee(id) {
    return axios.get(`${API_ENDPOINT}/assignments/employee/${id}`)
      .catch(response => authValidator(response));
  }

  getAssignmentsForProject(id) {
    return axios.get(`${API_ENDPOINT}/assignments/project/${id}`)
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
    return axios.post(`${API_ENDPOINT}/assignments`, {
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
    return axios.put(`${API_ENDPOINT}/assignments/${id}`, {
      startDate,
      endDate,
      role,
      assignedCapacity
    })
      .catch(response => authValidator(response));
  }

  deleteAssignment(id) {
    return axios.delete(`${API_ENDPOINT}/assignments/${id}`)
      .catch(response => authValidator(response));
  }

  getEmployees(settings = {}) {
    return axios.post(`${API_ENDPOINT}/employees`, settings)
      .catch(response => authValidator(response));
  }

  getEmployee(id) {
    return axios.get(`${API_ENDPOINT}/employees/${id}`)
      .catch(response => authValidator(response));
  }

  addEmployee(id, capacity, seniority, skillsArray) {
    return axios.post(`${API_ENDPOINT}/employees/add`, {
      id,
      capacity,
      seniority,
      skills: skillsArray
    })
      .catch(response => authValidator(response));
  }

  editEmployee(id, seniority, capacity) {
    return axios.patch(`${API_ENDPOINT}/employees/${id}`, {
      seniority,
      capacity
    })
      .catch(response => authValidator(response));
  }

  editEmployeeSkills(id, skillsArray) {
    return axios.put(`${API_ENDPOINT}/employees/${id}/skills`, skillsArray)
      .catch(response => authValidator(response));
  }

  getEmploSkills(employeeId) {
    return axios.get(`${API_ENDPOINT}/employees/BillenniumEmploSkills`, {
      params: {
        employeeId
      }
    })
      .catch(response => authValidator(response));
  }

  getEmploContactInfo(employeeId) {
    return axios.get(`${API_ENDPOINT}/employees/BillenniumEmploContact`, {
      params: {
        employeeId
      }
    })
      .catch(response => authValidator(response));
  }

  overrideSkillsOnEmployee(id, skillsArray) {
    return axios.put(`${API_ENDPOINT}/employee/${id}`, skillsArray)
      .catch(response => authValidator(response));
  }

  deleteEmployee(id) {
    return axios.delete(`${API_ENDPOINT}/employees/${id}`)
      .catch(response => authValidator(response));
  }

  changeEmployeeSeniority(id, seniority, role) {
    return axios.patch(`${API_ENDPOINT}/employees/${id}`, { seniority, role })
      .catch(response => authValidator(response));
  }

  addSkill(name) {
    return axios.post(`${API_ENDPOINT}/skills`, { name })
      .catch(response => authValidator(response));
  }

  getSkills() {
    return axios.get(`${API_ENDPOINT}/skills`)
      .catch(response => authValidator(response));
  }

  deleteSkill(name, level) {
    return axios.delete(`${API_ENDPOINT}/skills`, { name, level })
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

export default new DCMTWebApi();
