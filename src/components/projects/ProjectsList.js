import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { setActionConfirmation } from "./../../actions/asyncActions";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import EditProjectDetails from "../projectsModals/EditProjectDetails";
import DCMTWebApi from "../../api";

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
            project: response.data.dtoObject
          });

          console.log("ProjectsList:");
          console.table(this.state.project);
          console.log("DESCRIPTION:", this.state.project.description);
        }
      })
      .catch(error => {
        throw error;
      });

    this.setState({
      showModal: true
    });
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const construct = {
      rowClass: "project-block",
      tableClass: "projects-list-container",
      keyField: "id",
      pageChange: this.props.pageChange,
      operators: [
        {
          pretty: "DODAJ",
          click: () => {
            this.props.openAddProjectModal();
          }
        }
        // {
        //   pretty: "ODŚWIEŻ",
        //   click: () => {
        //     this.props.pageChange(this.props.currentPage);
        //   }
        // }
      ],
      columns: [
        { width: 20, field: "name", pretty: "Nazwa projektu" },
        { width: 20, field: "client", pretty: "Klient" },
        { width: 20, field: "startDate", pretty: "Data rozpoczęcia" },
        { width: 20, field: "endDate", pretty: "Data zakończenia" },
        {
          width: 10,
          field: "isActive",
          pretty: "Status",
          multiState: { true: "Aktywny", false: "Zakończony" }
        },
        {
          width: 1,
          toolBox: [
            {
              icon: { icon: "times" },
              click: object => {
                this.props.dispatch(
                  setActionConfirmation(true, {
                    key: "deleteProject",
                    string: `Delete project ${object.name}`,
                    id: object.id,
                    successMessage: "Projekt został usunięty"
                  })
                );
              }
            },
            {
              icon: { icon: "edit", iconType: "far" },
              click: object => {
                this.handleGetProject(object);
              }
            }
          ],
          pretty: "Usuń/Edytuj"
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
          classNames={{ modal: "Modal" }}
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

export default connect()(ProjectsList);
