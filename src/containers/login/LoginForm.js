import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import * as languageActions from "../../actions/languageActions";
import PropTypes from "prop-types";
import submit from "../../auth/submit";
import LoaderHorizontal from "../../components/common/LoaderHorizontal";
import "../../scss/LoginForm.scss";
import { push } from "react-router-redux";
import { translate } from "react-translate";
import { bindActionCreators } from 'redux';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(this.props.isAuthenticated){
      if(new Date(this.props.tokenExpirationDate) > new Date()){
        this.props.dispatch(push("/main"));
      }
    }
  }

  languageSwitch(language) {
    return (event) => {
      this.props.lang.languageChange(language);
    };
  }

  render() {
    const { handleSubmit, error, t } = this.props;

    return (
      <div className="login-wrapper">
        <div className="container login-form">
          <form onSubmit={handleSubmit}>
            <div className="container login-details">
              <div className="user-container">
                <Field
                  component="input"
                  type="text"
                  placeholder={t("EnterUsername")}
                  name="username"
                  required
                />
              </div>

              <div className="password-container">
                <Field
                  type="password"
                  component="input"
                  placeholder={t("EnterPassword")}
                  name="password"
                  required
                />
              </div>

              <div className="context-container">
                {error && <strong>{error}</strong>}
                {this.props.loading === true && <LoaderHorizontal />}
              </div>

              <div className="centric-container">
                <button className="submitter dcmt-button" type="submit">
                  {t("Login")}
                </button>
              </div>
            </div>

            <div className="container">
              <span className="psw">
                {t("Forgot")} <a href="#">{t("Password")}?</a>
              </span>
              <span className="psr">
                <span onClick={this.languageSwitch("pl")} className="flag-pol"/>
                <span onClick={this.languageSwitch("en")} className="flag-gbr"/>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.authReducer.loading,
    isAuthenticated: state.authReducer.isAuthenticated,
    tokenExpirationDate: state.authReducer.tokens.tokenExpirationDate
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    lang: bindActionCreators(languageActions, dispatch)
  };
};

const Form = reduxForm({
  form: "login",
  onSubmit: submit
})(LoginForm);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  tokenExpirationDate: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("LoginForm")(Form));
