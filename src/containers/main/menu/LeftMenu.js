import React from "react";
import { withRouter } from "react-router-dom";
import VerticalMenuElement from "./VerticalMenuElement";

class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { match } = this.props;
    return (
      <ul className="left-menu">
        <VerticalMenuElement
          match={match}
          path="/users"
          icon="user-circle"
          iconType="far"
          title="Użytkownicy"
        />
        <VerticalMenuElement
          match={match}
          path="/employees"
          icon="user"
          iconType="fas"
          title="Pracownicy"
        />
        <VerticalMenuElement
          match={match}
          path="/projects"
          icon="briefcase"
          iconType="fas"
          title="Projekty"
        />
        <VerticalMenuElement
          match={match}
          path="/assign"
          icon="pencil-alt"
          iconType="fas"
          title="Przypisz"
        />
      </ul>
    );
  }
}

export default withRouter(LeftMenu);
