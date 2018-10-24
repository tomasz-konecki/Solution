import React, { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as infoActions from "../../../actions/infoActions";
import ApiEndPoint from "./ApiEndPoint/ApiEndPoint";

import "./AllRoles.scss";

class AllRoles extends PureComponent {
  state = {};

  componentDidMount = () => {
    this.props.infoActions();
  };

  render() {
    const { account, projects, client, t } = this.props;
    const AccountRequests = [
      {
        text: t("SearchingUsersAccounts"),
        values: account.searchUserAccounts
      },
      {
        text: t("EditingUsersRoles"),
        values: account.editUsersRoles
      },
      {
        text: t("SearchAD"),
        values: account.canSearchAD
      },
      {
        text: t("AddUser"),
        values: account.addUser
      },
      {
        text: t("ReactivateUser"),
        values: account.canReactivateUser
      },
      {
        text: t("DeleteUser"),
        values: account.canDeleteUser
      },
      {
        text: t("DeleteUserRequest"),
        values: account.canDeleteUserRequest
      }
    ];
    const ProjectsRequests = [
      {
        text: t("SearchingProjects"),
        values: projects.searchProjects
      }
    ];
    const ClientRequests = [
      {
        text: t("GettingListOfClients"),
        values: client.getListOfClients
      },
      {
        text: t("AddingClient"),
        values: client.addingClient
      },
      {
        text: t("DeletingClient"),
        values: client.deleteClient
      },
      {
        text: t("EditingClient"),
        values: client.editClient
      },
      {
        text: t("ReactivatingClient"),
        values: client.reactivateClient
      }
    ];

    return (
      <div id="all-roles" className="content-container">
        <ApiEndPoint name="Account" endPoints={AccountRequests} />
        <ApiEndPoint name="Projects" endPoints={ProjectsRequests} />
        <ApiEndPoint name="Client" endPoints={ClientRequests} />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    account: state.infoReducer.account,
    projects: state.infoReducer.projects,
    client: state.infoReducer.client
  };
}
function mapDispatchToProps(dispatch) {
  return {
    infoActions: bindActionCreators(infoActions.infoActionCreator, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllRoles);
