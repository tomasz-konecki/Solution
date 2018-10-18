import React, { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as usersActions from "../../../actions/usersActions";
import * as projectsActions from "../../../actions/projectsActions";
import ApiEndPoint from "./ApiEndPoint/ApiEndPoint";

class AllRoles extends PureComponent {
  state = {
    AccountRequests: [{}],
    ProjectsRequests: [{}]
  };

  componentWillReceiveProps = nextProps => {
    console.log(
      this.props.userCanSearchUsersAccounts !==
        nextProps.userCanSearchUsersAccounts,
      this.props.projectCanSearchProjects !== nextProps.projectCanSearchProjects
    );
    if (
      this.props.userCanSearchUsersAccounts !==
        nextProps.userCanSearchUsersAccounts ||
      this.props.projectCanSearchProjects !== nextProps.projectCanSearchProjects
    ) {
      this.setState({
        AccountRequests: [
          {
            text: this.props.t("SearchingUsersAccounts"),
            havePerm: nextProps.userCanSearchUsersAccounts
          }
        ],
        ProjectsRequests: [
          {
            text: this.props.t("SearchingProjects"),
            havePerm: nextProps.projectCanSearchProjects
          }
        ]
      });
    }
  };

  componentDidMount = () => {
    const { userActions, projectActions, t } = this.props;

    userActions.loadUsers(1, 1);
    projectActions.loadProjectsTest();
  };

  render() {
    const { AccountRequests, ProjectsRequests } = this.state;

    return (
      <div id="all-roles">
        <ApiEndPoint name="Account" endPoints={AccountRequests} />
        <ApiEndPoint name="Projects" endPoints={ProjectsRequests} />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    userCanSearchUsersAccounts:
      state.usersReducer.resultBlock &&
      !(state.usersReducer.resultBlock.replyBlock.status === 404),
    projectCanSearchProjects:
      state.projectsReducer.resultBlock &&
      !(state.projectsReducer.resultBlock.replyBlock.status === 404)
  };
}
function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(usersActions, dispatch),
    projectActions: bindActionCreators(projectsActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllRoles);
