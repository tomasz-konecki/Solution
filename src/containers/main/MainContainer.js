import React from "react";
import { Route } from "react-router-dom";
import Header from "./header/Header";
import Content from "./content/Content";
import Navigation from "../../containers/main/header/nav/Navigation";
import "../../scss/MainContainer.scss";

class MainContainer extends React.Component {
  constructor(props, match) {
    super(props);

  }

  render() {
    const { match } = this.props;

    const pageTemplate = () => (
      <div className="wrapper">
        <Header {...this.props}/>
        <Content {...this.props}/>
      </div>
    );

    return (
      <div>
        <Route exact path={match.url} component={pageTemplate} />
      </div>
    );
  }
}

export default MainContainer;
