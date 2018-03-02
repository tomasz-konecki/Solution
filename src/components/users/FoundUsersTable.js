import React, { Component } from "react";
import "../../scss/components/users/FoundUsersTable.scss";
import uuid from "uuid";

const FoundUsersTable = props => {
  const tableData = props.foundUsers.map((item, index) => (
    <tr key={uuid.v4()}>
      <td key={uuid.v4()}>{item.firstName}</td>
      <td key={uuid.v4()}>{item.lastName}</td>
      <td key={uuid.v4()}>{item.id}</td>
    </tr>
  ));

  return (
    <div className="users-list-container">
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Last name</th>
          </tr>
          {tableData}
        </tbody>
      </table>
    </div>
  );
};

export default FoundUsersTable;
