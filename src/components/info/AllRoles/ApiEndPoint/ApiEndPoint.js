import React, { PureComponent } from "react";
import "./ApiEndPoint.scss";
import SmallSpinner from "../../../common/spinner/small-spinner";

class ApiEndPoint extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { endPoints, name } = this.props;

    const listOfPermissions = endPoints.map((permission, key) => {
      const circle = permission.values.status ? (
        <div className="circle green" />
      ) : (
        <div className="circle red" />
      );
      return (
        <div key={key} className="api-end-point">
          <div className="api-end-point-text">{permission.text}</div>
          <div className="api-end-point-circle">
            {permission.values.loading ? (
              <SmallSpinner />
            ) : (
              <React.Fragment>{circle}</React.Fragment>
            )}
          </div>
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
