import React from "react";
import Icon from "../../../../components/common/Icon";

class VerticalMenuElement extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { iconType, icon, title} = this.props;
    return (
      <li><Icon icon={icon} iconType={iconType}/><span>{title}</span></li>
    );
  }
}

export default VerticalMenuElement;
