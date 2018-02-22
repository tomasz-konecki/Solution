import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { authSuccess } from '../actions/authActions';
import { push } from 'react-router-redux';
import axios from 'axios';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const submit = (values, dispatch) => {
  // this is a testing endpoint!
  axios.post('http://localhost:8000/jwt', values)
    .then(response => {
      const token = response.data.token;
      console.log(token);
    })
    .catch(error => {
      console.log(error);
    });
  //dispatch(authSuccess());
  //dispatch(push('/main'));
};

export default submit;
