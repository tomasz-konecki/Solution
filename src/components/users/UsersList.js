import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";

const UsersList = props => {

  return (
    <SmoothTable data={props.users}/>
  );
};

export default UsersList;
