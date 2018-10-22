import React, { PureComponent } from "react";
import "react-bootstrap-typeahead/css/Typeahead.min.css";
import WebApi from "../../../../api/index";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.min.css";
import { translate } from "react-translate";
import SmallSpinner from "../../../common/spinner/small-spinner";
import ConfirmModal from "../../../common/confimModal/confirmModal";
import "./Owners.scss";

function getIndex(value, arr, prop) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1; //to handle the case where the value doesn't exist
}

class Owners extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addingNewOwner: false,
      employeesArray: [],
      loading: false,
      disabled: false,
      owners: props.owners,
      status: false,
      errorMessage: null,
      employee: null,
      deleteOwnerModalOpen: false,
      deleteOwnerId: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.addProjectOwnerToProjectStatus !==
      nextProps.addProjectOwnerToProjectStatus
    ) {
      this.setState({ status: nextProps.addProjectOwnerToProjectStatus });
      if (nextProps.addProjectOwnerToProjectStatus) {
        this.afterEmployeeHasBeenAdded();
      } else {
        this.setState({ disabled: false });
      }
    }

    if(nextProps.owners !== this.props.owners)
    {
      this.setState({
        owners: nextProps.owners
      })
    }
  }

  componentDidMount() {
    WebApi.employees.post
      .list({
        pageNumber: 1,
        limit: 1000,
        isDeleted: false
      })
      .then(response => {
        let employeesArray = response.extractData().results;
        let index;
        for (var i = 0; i < this.state.owners.length; i++) {
          index = getIndex(this.state.owners[i].id, employeesArray, "id");
          employeesArray.splice(index, 1);
        }
        this.setState({ employeesArray });
      });
  }

  deleteProjectOwner() {
    this.setState({
      deleteOwnerModalOpen: false
    })

    this.props.changeProjectState(
      this.props.WebApi.projects.delete.owner,
      "deleteOwner",
      {
        projectId: this.props.projectId,
        ownerId: this.state.deleteOwnerId
      }
    )
  }

  setProjectOwnerToDeleteId = ownerId => {
    if(this.props.loggedUser && this.props.loggedUser === ownerId)
    {
      this.setState({
        deleteOwnerId: ownerId,
        deleteOwnerModalOpen: true
      })
    }else{
      this.props.changeProjectState(
        this.props.WebApi.projects.delete.owner,
        "deleteOwner",
        {
          projectId: this.props.projectId,
          ownerId: ownerId
        }
      )
    }


  }

  afterEmployeeHasBeenChoosen = employee => {
    this.setState({ loading: true, disabled: true, employee }, () =>
      this.props.addProjectOwner(this.props.projectId, [employee[0].id])
    );
  };

  afterEmployeeHasBeenAdded = () => {
    const { employee } = this.state;
    let owners = [...this.state.owners];
    owners.push(employee[0]);
    let employeesArray = [...this.state.employeesArray];

    var index = getIndex(employee[0].id, employeesArray, "id");
    employeesArray.splice(index, 1);
    employee.length && this.typeahead.getInstance().clear();
    this.setState({ owners, employeesArray, loading: false });
  };

  render() {
    const {
      changeProjectState,
      WebApi,
      projectId,
      isProjectOwner,
      t
    } = this.props;

    const {
      addingNewOwner,
      employeesArray,
      loading,
      disabled,
      owners,
      status,
      employee
    } = this.state;

    return (
      <div className="progress-bars-container">
        <h3>
          {t("Owners")}
          {isProjectOwner &&
            !addingNewOwner && (
              <i
                onClick={() =>
                  this.setState({ addingNewOwner: !addingNewOwner })
                }
                className="fa fa-plus"
                title={t("AddProjectOwner")}
              />
            )}
          {status && (
            <b
              className="owner-adding-notiffication"
              style={{ color: "green" }}
            >
              {t("ProjectOwnerHasBeenAdded")}
            </b>
          )}

          {status === null && (
            <b className="owner-adding-notiffication" style={{ color: "red" }}>
              {t("ProjectOwnerHasNotBeenAdded")}
            </b>
          )}
        </h3>

        <div className="owners-list">
          {addingNewOwner && (
            <button className="owner-btn">
              {loading && <SmallSpinner />}
              <Typeahead
                disabled={disabled}
                emptyLabel={true ? t("EmployeeNotFound") : undefined}
                labelKey={option => `${option.fullName}`}
                onChange={employee => {
                  this.afterEmployeeHasBeenChoosen(employee);
                }}
                ref={typeahead => (this.typeahead = typeahead)}
                selectHintOnEnter
                highlightOnlyResult
                options={employeesArray}
                placeholder={t("ChooseAnOwner")}
              />
            </button>
          )}

          {owners.map((i, index) => {
            return (
              <button key={i.id} className="owner-btn">
                {i.fullName}
                {owners.length > 1 &&
                  isProjectOwner && (
                    <i
                      onClick={() =>
                        this.setProjectOwnerToDeleteId(owners[index].id)
                      }
                    >
                      {t("Delete")}
                    </i>
                  )}
              </button>
            );
          })}
        </div>

        <ConfirmModal
          open={this.state.deleteOwnerModalOpen}
          content="Delete project modal"
          onClose={() =>
            this.setState({
              deleteOwnerModalOpen: !this.state.deleteOwnerModalOpen
            })
          }
          header={t("DeleteYourselfeMessage")}
          operationName={t("Delete")}
          denyName={t("Cancel")}
          operation={() =>
            this.deleteProjectOwner()
          }
        />

      </div>
    );
  }
}

export default translate("AddProjectOwner")(Owners);
