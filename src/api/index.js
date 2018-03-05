import axios from "axios";
import * as jwtDecode from "jwt-decode";
import * as Promise from "bluebird";

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
    if(settings === null) return axios.get(`${API_ENDPOINT}/users`);
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
    if(settings === null) return axios.get(`${API_ENDPOINT}/projects`);
    return axios.get(`${API_ENDPOINT}/projects`, { params: settings });
  }

  getProject(id) {
    return axios.get(`${API_ENDPOINT}/projects/${id}`);
  }

  addProject(name, description, responsiblePerson, startDate, estimatedEndDate) {
    return axios.post(`${API_ENDPOINT}/projects`,
    { name,
      description,
      responsiblePerson,
      startDate,
      estimatedEndDate
    });
  }

  editProject(id, name, description, responsiblePerson, startDate, estimatedEndDate) {
    return axios.put(`${API_ENDPOINT}/projects/${id}`,
    { name,
      description,
      responsiblePerson,
      startDate,
      estimatedEndDate
    });
  }

  addOwner(projectId, ownerId) {
    return axios.put(`${API_ENDPOINT}/projects/${projectId}/owner`,
    { userId: ownerId });
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

  addAssignment(employeeId, projectId, startDate, endDate, role, assignedCapacity) {
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
    if(settings === null) return axios.get(`${API_ENDPOINT}/employees`);
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
    return axios.patch(`${API_ENDPOINT}/employees/${id}`, { seniority, role});
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

const UsersObject = {
  "results": [
  {
  "id": "Desperados",
  "firstName": "Antonio",
  "lastName": "Banderas",
  "role": null,
  "isDeleted": false,
  "email": "zonororo@nana.pl",
  "phoneNumber": null
  },
  {
  "id": "jgndfkjgdfs",
  "firstName": "Basia",
  "lastName": "Banderas",
  "role": null,
  "isDeleted": false,
  "email": "basiabanda@nana.pl",
  "phoneNumber": null
  },
  {
  "id": "stringyjkjkllut",
  "firstName": "Mikołaj",
  "lastName": "Butkownik",
  "role": null,
  "isDeleted": false,
  "email": "Butkowymifrancuski@sksa.pl",
  "phoneNumber": null
  },
  {
  "id": "programmer",
  "firstName": "Siszarp",
  "lastName": "Ceplusplus",
  "role": null,
  "isDeleted": false,
  "email": "cc@mail.pl",
  "phoneNumber": null
  },
  {
  "id": "ide",
  "firstName": "wizualstudjo",
  "lastName": "codeblokzzz",
  "role": null,
  "isDeleted": false,
  "email": "wizcode@mail.pl",
  "phoneNumber": null
  },
  {
  "id": "csharp",
  "firstName": "csharp",
  "lastName": "csharp",
  "role": null,
  "isDeleted": false,
  "email": "csharp@csharp.csharp",
  "phoneNumber": null
  },
  {
  "id": "jfkskajd21",
  "firstName": "Testownik",
  "lastName": "Czterystacztery",
  "role": null,
  "isDeleted": false,
  "email": "error100404@populacjaeuro.ru",
  "phoneNumber": null
  },
  {
  "id": "fdomurad",
  "firstName": "Fabian",
  "lastName": "Domurad",
  "role": null,
  "isDeleted": false,
  "email": "fabian.domurad@billennium.pl",
  "phoneNumber": null
  },
  {
  "id": "prezydent",
  "firstName": "Adndrzej",
  "lastName": "Duda",
  "role": null,
  "isDeleted": false,
  "email": "Duda@nana.pl",
  "phoneNumber": null
  },
  {
  "id": "pescobar",
  "firstName": "Pablo",
  "lastName": "Escobar",
  "role": null,
  "isDeleted": false,
  "email": "columbia@ciamail.com",
  "phoneNumber": null
  },
  {
  "id": "database",
  "firstName": "majeskuel",
  "lastName": "eskuelserwer",
  "role": null,
  "isDeleted": false,
  "email": "me@mail.pl",
  "phoneNumber": null
  },
  {
  "id": "jfkskafghfjd21",
  "firstName": "Radosław",
  "lastName": "Goniący",
  "role": null,
  "isDeleted": false,
  "email": "radekgoniacypilke@pilkadonogi.me",
  "phoneNumber": null
  },
  {
  "id": "mjackson",
  "firstName": "Michał",
  "lastName": "Jackson",
  "role": null,
  "isDeleted": false,
  "email": "mjackson@mockmail.com",
  "phoneNumber": null
  },
  {
  "id": "json",
  "firstName": "json",
  "lastName": "json",
  "role": null,
  "isDeleted": false,
  "email": "json@json.json",
  "phoneNumber": null
  },
  {
  "id": "Donald",
  "firstName": "Donald",
  "lastName": "Kaczor",
  "role": null,
  "isDeleted": false,
  "email": "DonaldKaczor@nana.pl",
  "phoneNumber": null
  },
  {
  "id": "prezes",
  "firstName": "Jarosław",
  "lastName": "Kaczyński",
  "role": null,
  "isDeleted": false,
  "email": "Juro@nana.pl",
  "phoneNumber": null
  },
  {
  "id": "jkowalski",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "role": null,
  "isDeleted": false,
  "email": "jan.kowalski@mail.com",
  "phoneNumber": null
  },
  {
  "id": "id",
  "firstName": "firstName",
  "lastName": "lastName",
  "role": null,
  "isDeleted": false,
  "email": "email@mail.pl",
  "phoneNumber": null
  },
  {
  "id": "marcin",
  "firstName": "marcin",
  "lastName": "marcin",
  "role": null,
  "isDeleted": false,
  "email": "marcindlu993@gmail.com",
  "phoneNumber": null
  },
  {
  "id": "emelo",
  "firstName": "Elo",
  "lastName": "Melo",
  "role": null,
  "isDeleted": false,
  "email": "zero@elomelo.com",
  "phoneNumber": null
  },
  {
  "id": "Krzysztof",
  "firstName": "Krzysztof",
  "lastName": "Nanna",
  "role": null,
  "isDeleted": false,
  "email": "mamamiak@billennium.pl",
  "phoneNumber": null
  },
  {
  "id": "stringjkl",
  "firstName": "Anna",
  "lastName": "Nowak",
  "role": null,
  "isDeleted": false,
  "email": "annnnnnanoooowaaaak@o222.pl",
  "phoneNumber": null
  },
  {
  "id": "stringyut",
  "firstName": "Joanna",
  "lastName": "Nowocińska",
  "role": null,
  "isDeleted": false,
  "email": "annnanoooowaak@o220002.pl",
  "phoneNumber": null
  },
  {
  "id": "wolczak",
  "firstName": "Wojciech",
  "lastName": "Olczak",
  "role": null,
  "isDeleted": false,
  "email": "testEmail@mail.mock",
  "phoneNumber": null
  },
  {
  "id": "stringyjklut",
  "firstName": "Mariusz",
  "lastName": "Piłosz",
  "role": null,
  "isDeleted": false,
  "email": "polowmariusz123121@o0002.pl",
  "phoneNumber": null
  }
  ],
  "currentPage": 1,
  "totalPageCount": 2
  };

class DCMTMockApi extends DCMTWebApi {
  auth(username, password) {
    return Promise.resolve({
      "email": "jane.doe@kappa.com",
      "extra": "Jane Doe"
    });
  }

  getUsers() {
    return Promise.resolve({
      data: UsersObject
    });
  }

  searchAD(user){
    return Promise.resolve({
      data: [
        {
          firstName: user,
          lastName: "Kowalski",
          email: user + "@kowal.pl",
          phoneNumber: "554663252",
          id: user + "kowalski"
        },
        {
          firstName: user + "2",
          lastName: "Kowalski",
          email: user + "@kowal.pl",
          phoneNumber: "554663252",
          id: user + "kowalski2"
        }
      ]
    });
  }
}


export default new DCMTMockApi();
