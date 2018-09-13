import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import * as languageActions from "../../actions/languageActions";
import PropTypes from "prop-types";
import submit from "../../auth/submit";
import LoaderHorizontal from "../../components/common/LoaderHorizontal";
import Modal from 'react-responsive-modal';
import "../../scss/LoginForm.scss";
import { push } from "react-router-redux";
import { translate } from "react-translate";
import { bindActionCreators } from "redux";
import { CSSTransitionGroup } from "react-transition-group";
import { clearAccountRequest } from "../../actions/authActions";
import AddPreferedRoles from "./AddPreferedRolesModal";
import loadRoles from '../../actions/usersActions';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      singleTimout: null,
      showPreferedRolesModal: false,
      userId: null,
      userIdSaved: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && this.state.error !== nextProps.error) {
      this.setState({ error: nextProps.error });
    }

    if(nextProps.accountRequest && this.state.showPreferedRolesModal !== nextProps.accountRequest){
      if(this.state.userIdSaved !== this.state.userId){
        this.setState({
          showPreferedRolesModal: nextProps.accountRequest,
          userIdSaved: this.state.userId
        })
      }
    }
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.dispatch(push("/main"));
    }
    this.props.clearAccountRequest();
  }

  languageSwitch(language) {
    return event => {
      this.props.lang.languageChange(language);
    };
  }

  closePreferedRolesModal = () => {
    this.setState({
      showPreferedRolesModal: false
    })
  }

  handleUserIdChange = (e) => {
    let value = e.target.value;

    this.setState({
      userId: value
    })
  }

  render() {
    const { handleSubmit, t } = this.props;
    const { error } = this.state;

    return (
      <div className="login-wrapper">
        <div className="container login-form">
          <form onSubmit={handleSubmit}>
            <div className="container login-details">
              <div className="user-container">
                <Field
                  onChange={this.handleUserIdChange}
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
              <div style={{ height: "7px" }}>
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
                {t("Forgot")}{" "}
                <a
                  target="_blank"
                  href="https://support.billennium.pl/Users/Account/RequestLostPassword"
                >
                  {t("Password")}?
                </a>
              </span>
              <span className="psr">
                <span
                  onClick={this.languageSwitch("pl")}
                  className="flag-pol"
                />
                <span
                  onClick={this.languageSwitch("en")}
                  className="flag-gbr"
                />
              </span>
            </div>
          </form>
        </div>
        <CSSTransitionGroup
          transitionName="error-validation"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        >
          {error && (
            <div className="context-container">
              <strong>{error}</strong>
            </div>
          )}
        </CSSTransitionGroup>

        <Modal
              key={1}
              open={this.state.showPreferedRolesModal}
              classNames={{ modal: "Modal Modal-add-owner" }}
              contentLabel="Choose prefered roles"
              onClose={this.closePreferedRolesModal}
          >
              <AddPreferedRoles
                userId={this.state.userId}
                closeModal={this.closePreferedRolesModal}
              />
        </Modal>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.authReducer.loading,
    isAuthenticated: state.authReducer.isAuthenticated,
    tokenExpirationDate: state.authReducer.tokens.tokenExpirationDate,
    accountRequest: state.authReducer.accountRequest,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    lang: bindActionCreators(languageActions, dispatch),
    clearAccountRequest: () => dispatch(clearAccountRequest()),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("LoginForm")(Form));
