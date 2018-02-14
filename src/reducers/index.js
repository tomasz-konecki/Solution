import { combineReducers } from "redux";
import workersReducer from "./workers-reducer";
import projectsReducer from "./projects-reducer";

const reducers = combineReducers({
  workersReducer,
  projectsReducer
});

export default reducers;
