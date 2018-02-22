import React from "react";
import { Field, reduxForm } from 'redux-form';
import submit from '../../auth/submit';
import "../../scss/LoginForm.scss";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSubmit, error } = this.props;

    return (
      <div className="container login-form">
        <form onSubmit={handleSubmit}>
          <div className="container login-details">
            <div className="user-container">
              <Field
                component="input"
                type="text"
                placeholder="Enter Username"
                name="uname"
                required
              />
            </div>

            <div className="password-container">
              <Field
                type="password"
                component="input"
                placeholder="Enter Password"
                name="psw"
                required
              />
            </div>

            {error && <strong>{error}</strong>}

            <div className="centric-container">
              <button className="submitter" type="submit">Login</button>
            </div>
          </div>

          <div className="container">
            <span className="psw">
              Forgot <a href="#">password?</a>
            </span>
          </div>
        </form>
      </div>
    );
  }
}
export default reduxForm({
  form: 'login',
  onSubmit: submit
})(LoginForm);
