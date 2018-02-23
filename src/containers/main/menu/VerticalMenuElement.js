import React from "react";
import { withRouter, Link } from "react-router-dom";
import Icon from "../../../components/common/Icon";

class VerticalMenuElement extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { iconType, icon, title, path, match } = this.props;
    return (
      <Link to={match.url + path}><li><Icon icon={icon} iconType={iconType}/><span>{title}</span></li></Link>
    );
  }
}

export default withRouter(VerticalMenuElement);
