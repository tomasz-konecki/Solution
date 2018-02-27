import React, { Component } from "react";

const UsersList = props => {
  console.log("USERS LIST: ", props.users);

  const firstNames = props.users.map((item, index) => {
    index += 1;
    if (index < 10) {
      index = "0" + index;
    }
    return <li key={index}>{`${index}. ${item.firstName}`}</li>;
  });

  const lastNames = props.users.map((item, index) => (
    <li key={index}>{item.lastName}</li>
  ));

  const roles = props.users.map((item, index) => (
    <li key={index}>{item.role}</li>
  ));
  return (
    <div>
      <ul className="firstNames">{firstNames}</ul>
      <ul className="lastNames">{lastNames}</ul>
      <ul className="roles">{roles}</ul>
    </div>
  );
};

export default UsersList;
