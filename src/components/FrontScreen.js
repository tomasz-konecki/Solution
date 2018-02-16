import React from "react";
import "../scss/FrontScreen.scss";
import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";

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
