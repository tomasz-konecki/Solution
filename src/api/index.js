import axios from "axios";
import * as jwtDecode from "jwt-decode";
import * as Promise from "bluebird";
import * as usersMocks from "./mock/users";
import * as projectsMocks from "./mock/projects";
import redux from "redux";
import storeCreator from "./../store";
import storage from "redux-persist/lib/storage";
const { store } = storeCreator;

const API_ENDPOINT = "http://10.24.14.148";

store.subscribe(listener);

const select = state =>
  state.authReducer.tokens !== undefined ? state.authReducer.tokens.token : "";

function listener() {
  const token = `Bearer ${select(store.getState())}`;

  axios.defaults.headers.common["Authorization"] = token;
}

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
    return axios.post(`${API_ENDPOINT}/users`, settings);
  }

  searchAD(user) {
    return axios.get(`${API_ENDPOINT}/users/searchAD/${user}`);
  }

  addUser(id, roles) {
    return axios.post(`${API_ENDPOINT}/users/add`, { id, roles });
  }

  deleteUser(id) {
    return axios.delete(`${API_ENDPOINT}/users/${id}`);
  }

  getUser(id) {
    return axios.get(`${API_ENDPOINT}/users/${id}`);
  }

  reactivateUser(id) {
    return axios.patch(`${API_ENDPOINT}/users/reactivate/${id}`);
  }

  changeUserRole(id, roles) {
    return axios.patch(`${API_ENDPOINT}/users`, {
      id,
      roles
    });
  }

  getProjects(settings = {}) {
    return axios.post(`${API_ENDPOINT}/projects`, settings);
  }

  getProject(id) {
    return axios.get(`${API_ENDPOINT}/projects/${id}`);
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
  }

  addOwners(projectId, ownersArray) {
    return axios.put(`${API_ENDPOINT}/projects/${projectId}/owner`, {
      usersIds: ownersArray
    });
  }

  deleteProject(id) {
    return axios.delete(`${API_ENDPOINT}/projects/${id}/delete`);
  }

  closeProject(id) {
    return axios.put(`${API_ENDPOINT}/projects/${id}/close`);
  }

  reactivateProject(id) {
    return axios.put(`${API_ENDPOINT}/projects/${id}/reactivate`);
  }

  putProjectSkills(id, skillsArray) {
    return axios.put(`${API_ENDPOINT}/projects/${id}/skills`, skillsArray);
  }

  deleteProjectOwner(ownerId, projectId) {
    return axios.delete(`${API_ENDPOINT}/projects/${projectId}/owner`, {
      data: {
        userId: ownerId
      }
    });
  }

  getAssignmentsForEmployee(id) {
    return axios.get(`${API_ENDPOINT}/assignments/employee/${id}`);
  }

  getAssignmentsForProject(id) {
    return axios.get(`${API_ENDPOINT}/assignments/project/${id}`);
  }

  addAssignment(
    employeeId,
    projectId,
    startDate,
    endDate,
    role,
    assignedCapacity
  ) {
    return axios.post(`${API_ENDPOINT}/assignments`, {
      employeeId,
      projectId,
      startDate,
      endDate,
      role,
      assignedCapacity
    });
  }

  editAssignment(id, startDate, endDate, role, assignedCapacity) {
    return axios.put(`${API_ENDPOINT}/assignments/${id}`, {
      startDate,
      endDate,
      role,
      assignedCapacity
    });
  }

  deleteAssignment(id) {
    return axios.delete(`${API_ENDPOINT}/assignments/${id}`);
  }

  getEmployees(settings = {}) {
    return axios.post(`${API_ENDPOINT}/employees`, settings);
  }

  getEmployee(id) {
    return axios.get(`${API_ENDPOINT}/employees/${id}`);
  }

  addEmployee(id, capacity, seniority, skillsArray) {
    return axios.post(`${API_ENDPOINT}/employees/add`, {
      id,
      capacity,
      seniority,
      skills: skillsArray
    });
  }

  getEmploSkills(employeeId) {
    return axios.get(`${API_ENDPOINT}/employees/BillenniumEmploSkills`, {
      params: {
        employeeId
      }
    });
  }

  overrideSkillsOnEmployee(id, skillsArray) {
    return axios.put(`${API_ENDPOINT}/employee/${id}`, skillsArray);
  }

  deleteEmployee(id) {
    return axios.delete(`${API_ENDPOINT}/employees/${id}`);
  }

  changeEmployeeSeniority(id, seniority, role) {
    return axios.patch(`${API_ENDPOINT}/employees/${id}`, { seniority, role });
  }

  addSkill(name) {
    return axios.post(`${API_ENDPOINT}/skills`, { name });
  }

  getSkills() {
    return axios.get(`${API_ENDPOINT}/skills`);
  }

  deleteSkill(name, level) {
    return axios.delete(`${API_ENDPOINT}/skills`, { name, level });
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
        errorOccured: simulateError,
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
