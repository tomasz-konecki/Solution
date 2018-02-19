import React from "react";
import VerticalMenuElement from "./VerticalMenuElement";

class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ul className="left-menu">
        <VerticalMenuElement icon="user-circle" iconType="far" title="Użytkownicy"/>
        <VerticalMenuElement icon="user" iconType="fas" title="Pracownicy"/>
        <VerticalMenuElement icon="briefcase" iconType="fas" title="Projekty"/>
        <VerticalMenuElement icon="pencil-alt" iconType="fas" title="Przypisz"/>
      </ul>
    );
  }
}

export default LeftMenu;
