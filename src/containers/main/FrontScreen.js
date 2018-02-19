import React from "react";
import LoginForm from "../login/LoginForm";
import Logo from "../../components/common/Logo";

class FrontScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="front-screen">
        <Logo />
        <LoginForm />
      </div>
    );
  }
}

export default FrontScreen;
