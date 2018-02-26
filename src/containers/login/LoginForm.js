import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import submit from '../../auth/submit';
import LoaderHorizontal from "../../components/common/LoaderHorizontal";
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
                name="username"
                required
              />
            </div>

            <div className="password-container">
              <Field
                type="password"
                component="input"
                placeholder="Enter Password"
                name="password"
                required
              />
            </div>

            <div className="context-container">
              {error && <strong>{error}</strong>}
              {this.props.loading && <LoaderHorizontal/>}
            </div>

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

const mapStateToProps = (state) => {
  return {
    loading: state.authReducer.loading
  };
};

const Form = reduxForm({
  form: 'login',
  onSubmit: submit
})(LoginForm);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool
};

export default connect(mapStateToProps)(Form);
