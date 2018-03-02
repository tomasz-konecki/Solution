import React, { Component } from "react";
import "../../scss/components/users/FoundUsersTable.scss";

const FoundUsersTable = props => {
  console.log("FOUND USERS TABLE, found users:", props.foundUsers);

  const createList = property =>
    props.foundUsers.map((item, index) => (
      <li key={index} onClick={() => console.log("item " + this + " clicked")}>
        {item[property]}
      </li>
    ));

  const firstNames = createList("firstName");
  const lastNames = createList("lastName");
  const emails = createList("email");

  const styles = {
    display: "inline-block",
    padding: "0 20px 0 0"
  };

  return (
    <div className="users-list-container">
      <ul style={styles} className="firstNames">
        {firstNames}
      </ul>
      <ul style={styles} className="lastNames">
        {lastNames}
      </ul>
      <ul style={styles} className="email">
        {emails}
      </ul>
    </div>
  );
};

export default FoundUsersTable;
