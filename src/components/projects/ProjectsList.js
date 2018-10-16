import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { setActionConfirmation } from "./../../actions/asyncActions";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import WebApi from "../../api";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import { translate } from "react-translate";
import { push } from "react-router-redux";
import binaryPermissioner from "./../../api/binaryPermissioner";
import specialPermissioner from "./../../api/specialPermissioner";
import "../../scss/components/projects/ProjectsList.scss";
import { bindActionCreators } from "redux";
import ProjectDetailsBlock from "../projects/modals/ProjectDetailsBlock";
import {
  editProjectPromise,
  getContactPersonDataACreator
} from "../../actions/projectsActions";

class ProjectsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditProjectModal: false,
      project: {},
      responseBlock: {},
      loading: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.editProjectErrors !== this.props.editProjectErrors &&
      nextProps.editProjectStatus
    ) {
      setTimeout(() => {
        this.props.pageChange();
      }, 3000);
    }
  }

  handleGetProject = project => {
    this.setState({ project: project, showEditProjectModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showEditProjectModal: false });
  };

  clearEditModalData = () => {
    this.setState({ showEditProjectModal: false });
  };

  render() {
    const { t } = this.props;
    const construct = {
      rowClass: "project-block",
      tableClass: "projects-list-container",
      keyField: "id",
      pageChange: this.props.pageChange,
      defaultSortField: "name",
      defaultSortAscending: true,
      filtering: true,
      filterClass: "ProjectFilter",
      rowDetailUnfurl: true,
      showDeletedCheckbox: true,
      showAllCheckbox: true,
      redirectPath: "/main/projects/",
      disabledRowComparator: object => {
        return object.isDeleted;
      },
      handles: {
        refresh: () => {
          this.props.pageChange();
        },
        ownerDelete: (ownerId, projectId) => {
          this.props.setActionConfirmation(true, {
            key: "deleteProjectOwner",
            string: t("DeleteOwnerFuture", { ownerId, projectId }),
            ownerId,
            projectId,
            successMessage: t("OwnerHasBeenDeleted")
          });
        },
        putSkills: (projectId, skillsArray) => {
          this.props.setActionConfirmation(true, {
            key: "putProjectSkills",
            string: t("ChangeSkillSettingsFuture", { projectId }),
            skillsArray,
            projectId,
            successMessage: t("SettingsHaveBeenSaved")
          });
        }
      },
      operators: [
        {
          pretty: t("Add"),
          click: () => {
            this.props.openAddProjectModal();
          },
          comparator: () =>
            binaryPermissioner(false)(0)(0)(0)(1)(1)(1)(this.props.binPem)
        }
      ],
      columns: [
        {
          width: 20,
          field: "name",
          pretty: t("ProjectName"),
          type: "text",
          filter: true
        },
        {
          width: 20,
          field: "client",
          pretty: t("Client"),
          type: "text",
          filter: true
        },
        {
          width: 20,
          field: "startDate",
          pretty: t("StartDate"),
          type: "date",
          filter: true,
          filterFieldOverride: "fromDate"
        },
        {
          width: 20,
          field: "estimatedEndDate",
          pretty: t("EndDate"),
          type: "date",
          filter: true,
          filterFieldOverride: "toDate"
        },
        {
          width: 10,
          field: "status",
          pretty: t("Status"),
          multiState: {
            null: t("SelectStatus"),
            0: t("Activated"),
            1: t("NotActivated"),
            2: t("Closed")
          },
          type: "multiState",
          filter: true
        },
        {
          width: 1,
          toolBox: [
            {
              icon: { icon: "minus-square", iconType: "fas" },
              title: t("CloseProjectImperativus"),
              click: object => {
                this.props.setActionConfirmation(true, {
                  key: "closeProject",
                  string: `${t("CloseProjectInfinitive")} ${object.name}`,
                  id: object.id,
                  successMessage: t("ProjectClosed")
                });
              },
              comparator: object => {
                return (
                  (specialPermissioner().projects.isOwner(
                    object,
                    this.props.login
                  ) ||
                    binaryPermissioner(false)(0)(0)(0)(0)(1)(1)(
                      this.props.binPem
                    )) &&
                  object.status === 0 &&
                  object.isDeleted == false
                );
              }
            },
            {
              icon: { icon: "eject", iconType: "fas" },
              title: t("ReactivateProjectImperativus"),
              click: object => {
                this.props.setActionConfirmation(true, {
                  key: "reactivateProject",
                  string: `${t("ReactivateProjectInfinitive")} ${object.name}`,
                  id: object.id,
                  successMessage: t("ProjectReactivated")
                });
              },
              comparator: object => {
                return (
                  specialPermissioner().projects.isOwner(
                    object,
                    this.props.login
                  ) ||
                  (binaryPermissioner(false)(0)(0)(0)(0)(1)(1)(
                    this.props.binPem
                  ) &&
                    object.isDeleted)
                );
              }
            },
            {
              icon: { icon: "times" },
              title: t("DeleteProjectImperativus"),
              click: object => {
                this.props.setActionConfirmation(true, {
                  key: "deleteProject",
                  string: `${t("DeleteProjectInfinitive")} ${object.name}`,
                  id: object.id,
                  successMessage: t("ProjectDeleted")
                });
              },
              comparator: object => {
                return (
                  specialPermissioner().projects.isOwner(
                    object,
                    this.props.login
                  ) ||
                  (binaryPermissioner(false)(0)(0)(0)(0)(1)(1)(
                    this.props.binPem
                  ) &&
                    !object.isDeleted)
                );
              }
            },
            {
              icon: { icon: "pen-square", iconType: "fas" },
              title: t("EditProject"),
              click: object => {
                this.handleGetProject(object);
              },
              comparator: object => {
                return (
                  specialPermissioner().projects.isOwner(
                    object,
                    this.props.login
                  ) ||
                  binaryPermissioner(false)(0)(0)(0)(0)(1)(1)(this.props.binPem)
                );
              }
            },
            {
              icon: { icon: "sign-in-alt", iconType: "fas" },
              title: t("SeeMore"),
              click: object => {
                this.props.push(`/main/projects/${object.id}`);
              },
              comparator: object => {
                return (
                  specialPermissioner().projects.isOwner(
                    object,
                    this.props.login
                  ) ||
                  binaryPermissioner(false)(1)(0)(1)(0)(1)(1)(this.props.binPem)
                );
              }
            }
          ],
          pretty: ""
        }
      ]
    };

    return (
      <div>
        <SmoothTable
          currentPage={this.props.currentPage}
          totalPageCount={this.props.totalPageCount}
          loading={this.props.loading}
          data={this.props.projects}
          construct={construct}
        />
        <Modal
          open={this.state.showEditProjectModal}
          classNames={{ modal: "Modal Modal-projects" }}
          contentLabel="Edit projects details"
          onClose={this.handleCloseModal}
        >
          <ProjectDetailsBlock
            shouldOnlyEdit={true}
            editProjectStatus={this.props.editProjectStatus}
            editProjectErrors={this.props.editProjectErrors}
            project={this.state.project}
            getContactPersonDataACreator={
              this.props.getContactPersonDataACreator
            }
            editProject={this.props.editProjectPromise}
            closeEditProjectModal={this.clearEditModalData}
          />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    binPem: state.authReducer.binPem,
    login: state.authReducer.login,
    editProjectStatus: state.projectsReducer.editProjectStatus,
    editProjectErrors: state.projectsReducer.editProjectErrors
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getContactPersonDataACreator: clientId =>
      dispatch(getContactPersonDataACreator(clientId)),
    editProjectPromise: (projectToSend, projectId) =>
      dispatch(editProjectPromise(projectToSend, projectId)),
    setActionConfirmation: (confirmationInProgress, toConfirm) =>
      dispatch(setActionConfirmation(confirmationInProgress, toConfirm))
  };
}

ProjectsList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object),
  pageChange: PropTypes.func.isRequired,
  openAddProjectModal: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPageCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  projectActions: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("ProjectsList")(ProjectsList));
