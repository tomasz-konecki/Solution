import React, { Component } from "react";

const UsersList = props => {
  // console.log("USERS LIST: ", props.users);

  const numbers = props.users.map((item, index) => {
    index += 1;
    index = index < 10 ? (index = "0" + index) : index;
    return <li key={index}>{index}</li>;
  });

  const createList = property =>
    props.users.map((item, index) => <li key={index}>{item[property]}</li>);

  const firstNames = createList("firstName");
  const lastNames = createList("lastName");
  const roles = createList("role");

  return (
    <div className="users-list-container">
      <ul className="numbers">{numbers}</ul>
      <ul className="firstNames">{firstNames}</ul>
      <ul className="lastNames">{lastNames}</ul>
      <ul className="roles">{roles}</ul>
    </div>
  );
};

export default UsersList;
