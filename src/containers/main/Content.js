import React from "react";
import { Route, Link, Switch, withRouter } from "react-router-dom";
import LeftMenu from "./menu/LeftMenu";
import PropTypes from "prop-types";
import UsersContainer from "../../components/users/UsersContainer";
import ProjectsContainer from "../../components/projects/ProjectsContainer";
import Confirmation from "./../../components/common/modals/Confirmation";
import EmployeesContainer from "./../../components/employees/EmployeesContainer";
import StatsContainer from "../../components/stats/StatsContainer";
import SkillsContainer from "../../components/skills/SkillsContainer";
import ReportsContainer from "../../components/reports/ReportsContainer";
import ClientsContainer from "../../components/clients/ClientsContainer";
import PromptsCommander from "../../components/promptsCommander/promptsCommander";
import ImportCVContainer from "../../components/importCV/ImportCVContainer";
import NotFound404 from "../../components/notFound404/NotFound404";

class Content extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div className="content">
        <Confirmation />
      <PromptsCommander />
        <Switch>
          <Route exact path={match.url} component={StatsContainer} />
          <Route path={match.url + "/users"} component={UsersContainer} />
          <Route path={match.url + "/clients"} component={ClientsContainer} />
          <Route
            path={match.url + "/employees"}
            component={EmployeesContainer}
          />
          <Route path={match.url + "/projects"} component={ProjectsContainer} />
          <Route path={match.url + "/skills"} component={SkillsContainer} />
          <Route path={match.url + "/reports"} component={ReportsContainer} />
          <Route
            path={match.url + "/import-cv"}
            component={ImportCVContainer}
          />
          <Route component={NotFound404} />
        </Switch>
        <div className="content-abs-footer">Billennium 2018</div>
      </div>
    );
  }
}

Content.propTypes = {
  match: PropTypes.object
};

export default withRouter(Content);