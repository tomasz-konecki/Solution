import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "../scss/App.scss";

import FrontScreen from "./main/FrontScreen";
import MainContainer from "./main/MainContainer";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={FrontScreen} />
          <Route path="/main" component={MainContainer} />
        </div>
      </Router>
    );
  }
}

export default App;
