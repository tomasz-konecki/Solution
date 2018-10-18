import React from "react";
import "./YourPermissions.scss";

const YourPermissions = props => {
  return (
    <div className="your-permissions">
      <h2>
        {props.t("YourRoleIs")} <strong>{props.role}</strong>.
      </h2>
    </div>
  );
};

export default YourPermissions;
