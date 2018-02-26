import React from "react";
import { withRouter, NavLink } from "react-router-dom";
import Icon from "../../../components/common/Icon";

class VerticalMenuElement extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { iconType, iconSize, icon, title, path, match, extended } = this.props;
    return (
      <NavLink to={match.url + path} activeClassName="active">
        <li>
          <Icon icon={icon} iconType={iconType} iconSize={iconSize}/>
          {extended && <span>{title}</span>}
        </li>
      </NavLink>
    );
  }
}

export default withRouter(VerticalMenuElement);
