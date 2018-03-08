import axios from "axios";
import * as jwtDecode from "jwt-decode";
import * as Promise from "bluebird";
import * as usersMocks from "./mock/users";
import * as projectsMocks from "./mock/projects";

const API_ENDPOINT = "http://10.24.14.148";

class DCMTWebApi {
  auth(username, password) {
    return axios
      .post(`${API_ENDPOINT}/account/login`, { username, password })
      .then(response => jwtDecode(response.data.id_token));
  }

  getStatistics() {
    return axios.get(`${API_ENDPOINT}/statistics`);
  }

  getUsers(settings = null) {
    if (settings === null) return axios.get(`${API_ENDPOINT}/users`);
    return axios.get(`${API_ENDPOINT}/users`, { params: settings });
  }

  searchAD(user) {
    return axios.get(`${API_ENDPOINT}/users/searchAD/${user}`);
  }

  addUser(id, role) {
    return axios.post(`${API_ENDPOINT}/users`, { id, role });
  }

  deleteUser(id) {
    return axios.delete(`${API_ENDPOINT}/users/${id}`);
  }

  getUser(id) {
    return axios.get(`${API_ENDPOINT}/users/${id}`);
  }

  changeUserRole(id, role) {
    return axios.patch(`${API_ENDPOINT}/users/${id}`, { role });
  }

  getProjects(settings = null) {
    if (settings === null) return axios.get(`${API_ENDPOINT}/projects`);
    return axios.get(`${API_ENDPOINT}/projects`, { params: settings });
  }

  getProject(id) {
    return axios.get(`${API_ENDPOINT}/projects/${id}`);
  }

  addProject(
    name,
    description,
    client,
    responsiblePerson,
    startDate,
    estimatedEndDate
  ) {
    return axios.post(`${API_ENDPOINT}/projects`, {
      name,
      description,
      responsiblePerson,
      startDate,
      estimatedEndDate
    });
  }

  editProject(
    id,
    name,
    description,
    client,
    responsiblePerson,
    startDate,
    estimatedEndDate
  ) {
    return axios.put(`${API_ENDPOINT}/projects/${id}`, {
      name,
      description,
      responsiblePerson,
      startDate,
      estimatedEndDate
    });
  }

  addOwner(projectId, ownerId) {
    return axios.put(`${API_ENDPOINT}/projects/${projectId}/owner`, {
      userId: ownerId
    });
  }

  deleteProject(id) {
    return axios.delete(`${API_ENDPOINT}/projects/${id}`);
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

  getEmployees(settings = null) {
    if (settings === null) return axios.get(`${API_ENDPOINT}/employees`);
    return axios.get(`${API_ENDPOINT}/employees`, { params: settings });
  }

  getEmployee(id) {
    return axios.get(`${API_ENDPOINT}/employees/${id}`);
  }

  addEmployee(id, firstName, lastName, email, role, seniority) {
    return axios.put(`${API_ENDPOINT}/employee`, {
      id,
      firstName,
      lastName,
      email,
      role,
      seniority
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

  addSkill(name, level) {
    return axios.post(`${API_ENDPOINT}/skills`, { name, level });
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

export default new DCMTMockApi();
