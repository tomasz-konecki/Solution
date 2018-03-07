import React from "react";
import "../../scss/LoginForm.scss";
import "../../scss/Logo.scss";
import LoginForm from "../login/LoginForm";
import Logo from "../../components/common/Logo";

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="front-screen">
        <Logo size="vector_cut" container />
        <LoginForm />
      </div>
    );
  }
}

export default LoginScreen;
