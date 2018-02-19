import React from "react";
<<<<<<< HEAD:src/containers/login/FrontScreen.js
import "../../scss/LoginForm.scss";
import "../../scss/Logo.scss";
=======
>>>>>>> 51d87ad94065318878484ff2a2b34ce8f069d393:src/containers/main/FrontScreen.js
import LoginForm from "../login/LoginForm";
import Logo from "../../components/common/Logo";

class FrontScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="front-screen">
        <Logo size="vector" container/>
        <LoginForm login={this.props.login} />
      </div>
    );
  }
}

export default FrontScreen;
