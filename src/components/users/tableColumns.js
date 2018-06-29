import React, { Component } from "react";
import binaryPermissioner from './../../api/binaryPermissioner';
import { setActionConfirmation } from "../../actions/asyncActions";

const rolesArrayToSignificantSymbol = (rolesArray) => {
    const symbol = [
      'D', 'S', 'H', 'T', 'A', 'M'
    ];
    const roles = [
      'Developer', 'Tradesman', 'Human Resources', 'Team Leader', 'Administrator', 'Manager'
    ];
    let symbols = [];

    for(let i = 0; i < symbol.length; i++){
      if(rolesArray.indexOf(roles[i]) >= 0) symbols.push(
        <span className={'user-role-symbol ' + roles[i]} key={i} title={roles[i]}>{symbol[i]}</span>
      );
      else {
        symbols.push(
          <span className={'user-role-symbol'} key={i}/>
        );
      }
    }

    return symbols;
  }

const createColumns = {
    defaultTable: function ( binPem, t, handleGetUser, dispatch){
        return (
            [
                { width: 1, pretty: "Role", manualResolver: (user, column) => {
                    return rolesArrayToSignificantSymbol(user.roles);
                }},
                { width: 20, field: "firstName", pretty: "Name", type: "text", filter: true },
                { width: 30, field: "lastName", pretty: "Surname", type: "text", filter: true },
                { width: 30, field: "email", pretty: "Email", type: "text", filter: true },
                { width: 19, field: "phoneNumber", pretty: "Phone", type: "text", filter: true },
                {
                  width: 1,
                  comparator: object => binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(binPem),
                  toolBox: [
                    {
                      icon: { icon: "sync-alt" },
                      title: t("ReactivateUserImperativus"),
                      click: object => {
                        dispatch(
                          setActionConfirmation(true, {
                            key: "reactivateUser",
                            string: `${"ReactivateUserInfinitive"} ${object.firstName} ${
                              object.lastName
                            }`,
                            id: object.id,
                            successMessage: "UserReactivated"
                          })
                        );
                      },
                      comparator: object => object.isDeleted && binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(binPem)
                    },
                    {
                      icon: { icon: "times" },
                      title: "DeleteUserImperativus",
                      click: object => {
                        this.props.dispatch(
                          setActionConfirmation(true, {
                            key: "deleteUser",
                            string: `${"DeleteUserInfinitive"} ${object.firstName} ${
                              object.lastName
                            }`,
                            id: object.id,
                            successMessage: "UserDeleted"
                          })
                        );
                      },
                      comparator: object => !object.isDeleted && binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(binPem)
                    },
                    {
                      icon: { icon: "edit", iconType: "far" },
                      title: "EditUserImperativus",
                      click: object => {
                        handleGetUser(object);
                      },
                      comparator: object => binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(binPem)
                    }
                  ],
                  pretty: "DeleteEdit"
                }
              ]
        )
    }
} 

export default createColumns;
