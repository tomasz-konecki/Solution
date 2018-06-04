import React from "react";
import { withRouter, NavLink } from "react-router-dom";
import Icon from "../../../components/common/Icon";
import PropTypes from 'prop-types';

class VerticalMenuElement extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { iconType, icon, title, path, match, extended } = this.props;
    return (
      <NavLink exact to={match.url + path} activeClassName="active">
        <li>
          <Icon icon={icon} iconType={iconType} iconSize="lg"/>
          <span>{title}</span>
        </li>
      </NavLink>
    );
  }
}

VerticalMenuElement.propTypes = {
  iconType: PropTypes.string,
  iconSize: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
  path: PropTypes.string,
  match: PropTypes.object,
  extended: PropTypes.bool
};

export default withRouter(VerticalMenuElement);
