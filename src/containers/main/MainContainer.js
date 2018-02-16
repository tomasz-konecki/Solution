import React from "react";
import Header from "./Header";
import Content from "./Content";
import Navigation from "../../components/menu/horizontal/Navigation";
import "../../scss/MainContainer.scss";

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
