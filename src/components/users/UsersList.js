import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";

const UsersList = props => {
  const construct = {
    rowClass: "user-block",
    tableClass: "users-list-container",
    keyField: "id",
    columns: [
      { width: 20, field: "firstName", pretty: "Imię" },
      { width: 30, field: "lastName", pretty: "Nazwisko" },
      { width: 30, field: "email", pretty: "Email" },
      { width: 19, field: "phoneNumber", pretty: "Telefon" },
      {
        width: 1,
        toolBox: [
          { icon: { icon: "times" }, click: () => {} },
          {
            icon: { icon: "edit", iconType: "far" },
            click: object => {
              alert(object.firstName);
            }
          }
        ]
      }
    ]
  };

  return <SmoothTable construct={construct} data={props.users} />;
};

export default UsersList;
