import React from "react";
import Header from "../components/Header";
import Content from "../components/Content";
import Navigation from "../components/Navigation";
import "../scss/MainContainer.scss";

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrapper">
        <Header />
        <Content />
      </div>
    );
  }
}

export default MainContainer;
