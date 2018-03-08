import React, { Component } from "react";
import Icon from "../common/Icon";

const UsersList = props => {
  console.log("USERS LIST: ", props.users);

  const usersList = props.users.map((item, index) => (
    <div key={item.id} className="smooth-row user-block">
      <div className="smooth-cell smooth-2x">{item.firstName}</div>
      <div className="smooth-cell smooth-3x">{item.lastName}</div>
      <div className="smooth-cell smooth-1x">{item.email}</div>
      <div className="smooth-cell smooth-1x">{item.phoneNumber}</div>
      <div className="smooth-cell smooth-0x">
        <button>
          <Icon icon="times" />
        </button>
        <button>
          <Icon iconType="far" icon="edit" />
        </button>
      </div>
    </div>
  ));

  return <div className="smooth-table users-list-container">{usersList}</div>;
};

export default UsersList;
