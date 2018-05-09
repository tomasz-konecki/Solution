import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { setActionConfirmation } from "./../../actions/asyncActions";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import EditProjectDetails from "../projects/modals/EditProjectDetails";
import DCMTWebApi from "../../api";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import ProjectRowUnfurl from './ProjectRowUnfurl';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import { push } from 'react-router-redux';

class ProjectsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      project: {},
      responseBlock: {},
      loading: false
    };
  }

  handleGetProject = object => {
    DCMTWebApi.getProject(object.id)
      .then(response => {
        if (response.status === 200) {
          this.setState({
            project: response.data.dtoObject,
            showModal: true
          });
        }
      })
      .catch(error => {
        this.setState({
          responseBlock: error,
          loading: false
        });
      });
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
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
      unfurler: ProjectRowUnfurl,
      showDeletedCheckbox: true,
      disabledRowComparator: (object) => {
        return object.isDeleted;
      },
      handles: {
        refresh: () => {
          this.props.pageChange();
        },
        ownerDelete: (ownerId, projectId) => {
          this.props.dispatch(
            setActionConfirmation(true, {
              key: "deleteProjectOwner",
              string: t("DeleteOwnerFuture", { ownerId, projectId }),
              ownerId,
              projectId,
              successMessage: t("OwnerHasBeenDeleted")
            })
          );
        },
        putSkills: (projectId, skillsArray) => {
          this.props.dispatch(
            setActionConfirmation(true, {
              key: "putProjectSkills",
              string: t("ChangeSkillSettingsFuture", { projectId }),
              skillsArray,
              projectId,
              successMessage: t("SettingsHaveBeenSaved")
            })
          );
        }
      },
      operators: [
        {
          pretty: t("Add"),
          click: () => {
            this.props.openAddProjectModal();
          }
        }
      ],
      columns: [
        { width: 20, field: "name", pretty: t("ProjectName"), type: "text", filter: true },
        { width: 20, field: "client", pretty: t("Client"), type: "text", filter: true },
        { width: 20, field: "startDate", pretty: t("StartDate"), type: "date", filter: true, filterFieldOverride: "fromDate" },
        { width: 20, field: "endDate", pretty: t("EndDate"), type: "date", filter: true, filterFieldOverride: "toDate" },
        {
          width: 10,
          field: "isActive",
          pretty: t("Status"),
          multiState: { true: t("Active"), false: t("Closed") },
          type: "multiState",
          filter: true
        },
        {
          width: 1,
          toolBox: [
            {
              icon: { icon: "file-archive", iconType: "far" },
              title: t("CloseProjectImperativus"),
              click: object => {
                this.props.dispatch(
                  setActionConfirmation(true, {
                    key: "closeProject",
                    string: `${t("CloseProjectInfinitive")} ${object.name}`,
                    id: object.id,
                    successMessage: t("ProjectClosed")
                  })
                );
              },
              comparator: object => object.isActive
            },
            {
              icon: { icon: "angle-double-up", iconType: "fas" },
              title: t("CloseProjectImperativus"),
              click: object => {
                this.props.dispatch(
                  setActionConfirmation(true, {
                    key: "reactivateProject",
                    string: `${t("ReactivateProjectInfinitive")} ${object.name}`,
                    id: object.id,
                    successMessage: t("ProjectReactivated")
                  })
                );
              },
              comparator: object => !object.isActive
            },
            {
              icon: { icon: "times" },
              title: t("DeleteProjectImperativus"),
              click: object => {
                this.props.dispatch(
                  setActionConfirmation(true, {
                    key: "deleteProject",
                    string: `${t("DeleteProjectInfinitive")} ${object.name}`,
                    id: object.id,
                    successMessage: t("ProjectDeleted")
                  })
                );
              },
              comparator: object => !object.isDeleted
            },
            {
              icon: { icon: "edit", iconType: "far" },
              title: t("EditProject"),
              click: object => {
                this.handleGetProject(object);
              }
            },
            {
              icon: { icon: "arrow-right", iconType: "fas" },
              title: t("SeeMore"),
              click: object => {
                this.props.dispatch(
                  push(`/main/projects/${object.id}`)
                );
              }
            }
          ],
          pretty: ''
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
          open={this.state.showModal}
          classNames={{ modal: "Modal Modal-projects" }}
          contentLabel="Edit projects details"
          onClose={this.handleCloseModal}
        >
          <EditProjectDetails
            closeModal={this.handleCloseModal}
            project={this.state.project}
            responseBlock={this.state.responseBlock}
            loading={this.state.loading}
            projectActions={this.props.projectActions}
            limit={this.state.limit}
            currentPage={this.state.currentPage}
          />
        </Modal>
      </div>
    );
  }
}

ProjectsList.propTypes = {
  pageChange: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
  openAddProjectModal: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPageCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object),
  projectActions: PropTypes.object
};

export default connect()(translate("ProjectsList")(ProjectsList));
