import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { authSuccess } from '../actions/authActions';

import MainContainer from "../containers/main/MainContainer";

export const Home = connect()(MainContainer);
