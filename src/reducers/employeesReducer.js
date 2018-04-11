import { LOAD_EMPLOYEES_SUCCESS, LOGOUT } from "../constants";

const initialState = {
  employees: [],
  currentPage: 1,
  totalPageCount: 1
};

export const employeesReducer = (state = "", action) => {
  switch (action.type) {
    case LOAD_EMPLOYEES_SUCCESS:
      return {
        employees: action.employees.results,
        currentPage: action.employees.currentPage,
        totalPageCount: action.employees.totalPageCount
      };
    case LOGOUT:
      return {
        employees: [],
        currentPage: 1,
        totalPageCount: 1
      };

    default:
      return state;
  }
};
