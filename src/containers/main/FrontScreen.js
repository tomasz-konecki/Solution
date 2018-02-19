import React from "react";
import "../../scss/LoginForm.scss";
import "../../scss/Logo.scss";
import LoginForm from "../login/LoginForm";
import Logo from "../../components/common/Logo";

class FrontScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="front-screen">
        <Logo size="vector" container={true} />
        <LoginForm />
      </div>
    );
  }
}

export default FrontScreen;
