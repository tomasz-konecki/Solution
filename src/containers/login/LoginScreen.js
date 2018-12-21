import React from "react";
import "../../scss/LoginForm.scss";
import colors from "../../scss/ColorSchema.scss";
import LoginForm from "../login/LoginForm";
import Logo from "components/common/Logo";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { authSuccess } from "actions/authActions";
import { withRouter } from 'react-router-dom';
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
  }


  componentWillMount(){
    document.body.style.backgroundColor = colors.mainColor;
  }
  componentWillUnmount(){
    document.body.style.backgroundColor = colors.contentBackground;
  }

  render() {
    return (
      <div className="login-screen">  
        <Logo size="vector_cut" container />
        <LoginForm languageSwitch={this.props.languageSwitch} />
      </div>
    );
  }
}

export default connect(null, dispatch => ({
  login: credentials => {
    dispatch(authSuccess());
    dispatch(push("/main"));
  }
}))(withRouter(LoginScreen));
