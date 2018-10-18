import React, { PureComponent } from "react";
import "./ApiEndPoint.scss";

class ApiEndPoint extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { endPoints, name } = this.props;

    const listOfPermissions = endPoints.map((permission, key) => {
      console.log(permission, "helo");
      const circle = permission.havePerm ? (
        <div className="circle green" />
      ) : (
        <div className="circle red" />
      );
      return (
        <div key={key}>
          <div>{permission.text}</div>
          <div>{circle}</div>
        </div>
      );
    });

    return (
      <div className="api-end-point-container">
        <li>
          <h3>{name}</h3>
          {listOfPermissions}
        </li>
      </div>
    );
  }
}

export default ApiEndPoint;
