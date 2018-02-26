import React from "react";
import { withRouter } from "react-router-dom";
import VerticalMenuElement from "./VerticalMenuElement";
import Icon from "../../../components/common/Icon";
import PropTypes from 'prop-types';

class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {extended: false};

    this.handleExtendClick = this.handleExtendClick.bind(this);
  }

  handleExtendClick() {
    this.setState(prevState => ({
      extended: !prevState.extended
    }));
  }

  render() {
    const { match } = this.props;
    const { extended } = this.state;
    return (
      <ul className={"left-menu" + (extended ? " extended" : "")}>
        <VerticalMenuElement
          match={match}
          extended={extended}
          path="/users"
          icon="user-circle"
          iconType="far"
          title="Użytkownicy"
        />
        <VerticalMenuElement
          match={match}
          extended={extended}
          path="/employees"
          icon="user"
          iconType="fas"
          title="Pracownicy"
        />
        <VerticalMenuElement
          match={match}
          extended={extended}
          path="/projects"
          icon="briefcase"
          iconType="fas"
          title="Projekty"
        />
        <VerticalMenuElement
          match={match}
          extended={extended}
          path="/assign"
          icon="pencil-alt"
          iconType="fas"
          title="Przypisz"
        />
        <li onClick={this.handleExtendClick} className="extender">
          <Icon icon="bars"/>
        </li>
      </ul>
    );
  }
}

LeftMenu.propTypes = {
  match: PropTypes.object
};

export default withRouter(LeftMenu);
