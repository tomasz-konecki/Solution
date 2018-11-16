import React from "react";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import {loadSharedEmployeesForManager,loadEmployees, addSharedEmployee, deleteSharedEmployee, loadTeamLeadersAndManagers} from "../../../../../actions/employeesActions";
import Spinner from "../../../../common/spinner/spinner";
import Button from "../../../../common/button/button";
import { translate } from "react-translate";
import SharedEmployeesListContainer from './sharedEmployeesListContainer';
import EmployeesListContainer from './employeesListContainer';
import "./sharedEmployeesModal.scss";

class ShareEmployeesModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      loadingTeamLeadersAndManagers: false,
      loadingSharedEmployees: false,
      loadingEmployees: false,
      choosenLeader: false,
      activeLeader: null,

      employeesFilter: "",
      sharedEmployeesFilter: "",

      currentlyAddingIds: [],
      currentlyDeletingIds: [],
      errorElementsAdding: [],
      errorElementsDeleting: [],

      showSubordinatesId: null,
      subordinates: []
    };
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.teamLeadersAndManagers !== this.props.teamLeadersAndManagers)
    {
      this.state.loadingTeamLeadersAndManagers = false
    }

    if (nextProps.sharedEmployeesForManager !== this.props.sharedEmployeesForManager)
    {
      this.state.loadingSharedEmployees = false
    }

    if (nextProps.employees !== this.props.employees)
    {
      nextProps.employees.forEach(employee => {
        let deletingIds = this.state.currentlyDeletingIds;
        const id = deletingIds.indexOf(employee.id);
        deletingIds.splice(id, 1);
        this.setState({
          currentlyDeletingIds: deletingIds
        })
      });
      this.state.loadingEmployees = false
    }
  };

  componentDidMount = () => {
    const { loadTeamLeadersAndManagers } = this.props;

    if (!this.state.loadingTeamLeadersAndManagers) {
      this.setState({
        loadingTeamLeadersAndManagers: true
      });
    }

    loadTeamLeadersAndManagers();
  };

  shareEmployee = sharedEmployeeId => {
    let deletingIds = [...this.state.currentlyDeletingIds];
    const index = deletingIds.indexOf(sharedEmployeeId);
    deletingIds.splice(index, 1);

    const sharedEmployeeModel = {
      employeeId: sharedEmployeeId,
      destinationManagerId: this.state.activeLeader
    };

    this.setState({
      currentlyAddingIds: [...this.state.currentlyAddingIds, sharedEmployeeId],
      currentlyDeletingIds: deletingIds
    });

    this.props
      .addSharedEmployee(sharedEmployeeModel, this.state.activeLeader)
      .then()
      .catch(err => {
        let addingIds = [...this.state.currentlyAddingIds];
        const i = addingIds.indexOf(sharedEmployeeId);
        addingIds.splice(i, 1);

        let errors = [
          ...this.state.errorElementsAdding,
          { empId: sharedEmployeeId, error: err }
        ];
        this.setState({
          errorElementsAdding: errors,
          currentlyAddingIds: addingIds
        });
      });
  };

  stopSharingEmployee = (sharedEmployeeId, employeeId) => {
    let addingIds = [...this.state.currentlyAddingIds];
    const index = addingIds.indexOf(employeeId);
    addingIds.splice(index, 1);

    this.setState({
      currentlyDeletingIds: [...this.state.currentlyDeletingIds, employeeId],
      currentlyAddingIds: addingIds
    });

    this.props
      .deleteSharedEmployee(sharedEmployeeId, this.state.activeLeader)
      .then()
      .catch(err => {
        let deletingIds = [...this.state.currentlyDeletingIds];
        const i = deletingIds.indexOf(employeeId);
        deletingIds.splice(i, 1);

        let errors = [
          ...this.state.errorElementsDeleting,
          { empId: employeeId, error: err }
        ];
        this.setState({
          errorElementsDeleting: errors,
          currentlyDeletingIds: deletingIds
        });
      });
  };

  getSubordinates = employeeId => {
    if (employeeId === this.state.showSubordinatesId) {
      this.setState({
        showSubordinatesId: null,
        subordinates: []
      });
    } else {
      let emp = this.generateSubordinates(employeeId)

      this.setState({
        showSubordinatesId: employeeId,
        subordinates: emp
      });
    }
  };

  generateSubordinates = (employeeId) => {
    var result = [];
    var employees = this.props.employees.filter(e => e.managerId === employeeId);
    result = [...result, ...employees];
    employees.forEach(s => {
      result =  [...result, ...this.generateSubordinates(s.id)]
    });
    return result;
  }

  chooseLeader = (e) => {
    this.state.choosenLeader  &&
      this.setState({
        choosenLeader: true
      });

    if (!this.state.loadingSharedEmployees) {
      this.setState({
        loadingSharedEmployees: true
      });
    }
    if (!this.state.loadingEmployees) {
      this.setState({
        loadingEmployees: true
      });
    }

    this.setState({
      activeLeader: e.target.value,
      currentlyAddingIds: [],
      currentlyDeletingIds: [],
      errorElementsAdding: [],
      errorElementsDeleting: []
    });

    this.props.loadSharedEmployeesForManager(e.target.value);
    this.props.loadEmployees(1, 10000, null);
  };

  filterEmployees = e => {
    this.setState({
      employeesFilter: e.target.value.toLowerCase()
    });
  };

  filterSharedEmployees = e => {
    this.setState({
      sharedEmployeesFilter: e.target.value.toLowerCase()
    });
  };

  toogleModal = () => {
    this.setState({
      open: !this.state.open
    });
  };

  render() {
    const { t } = this.props;

    return (
      <div className="shared-employees-modal">

        {this.props.employee.roles && this.props.employee.roles.includes("Team Leader") && (
          <Button
            onClick={this.toogleModal}
            children={<i className="fa fa-share-alt" />}
            title={t("ShareEmployees")}
            mainClass="generate-raport-btn share-btn"
          />
        )}

        <Modal
          key={1}
          open={this.state.open}
          classNames={{ modal: "Modal share-employees-modal-container" }}
          contentLabel="Share Employees Modal"
          onClose={() => this.toogleModal()}
        >
          <div>
            <header>{t("ChooseEmployeesToShare")}</header>
            <div style={{ marginBottom: "10px" }}>{t("ChooseLeader")} :</div>
            <select
              className="form-control form-control-sm"
              onChange={e => this.chooseLeader(e)}
              disabled={this.state.loadingTeamLeadersAndManagers}
              defaultValue={t("ChooseLeader")}
            >
              <option disabled>{t("ChooseLeader")}</option>
              {this.props.teamLeadersAndManagers && this.props.teamLeadersAndManagers.map((leader, index) => {
                return (
                  <option key={index} value={leader.id}>{leader.firstName} {leader.lastName}</option>
                );
              })}
            </select>

            {this.state.loadingEmployees || this.state.loadingSharedEmployees || this.state.loadingTeamLeadersAndManagers ? (<div><Spinner/></div>) :(
              <div>

                <SharedEmployeesListContainer
                  sharedEmployeesForManager={this.props.sharedEmployeesForManager}
                  stopSharingEmployee={this.stopSharingEmployee}
                  currentlyDeletingIds={this.state.currentlyDeletingIds}
                  errorElementsDeleting={this.state.errorElementsDeleting}
                  t={t}
                />

                <EmployeesListContainer
                  employees={this.props.employees}
                  sharedEmployeesForManager={this.props.sharedEmployeesForManager}
                  errorElementsAdding={this.state.errorElementsAdding}
                  getSubordinates={this.getSubordinates}
                  shareEmployee={this.shareEmployee}
                  currentlyAddingIds={this.state.currentlyAddingIds}
                  showSubordinatesId={this.state.showSubordinatesId}
                  subordinates={this.state.subordinates}
                  generateSubordinates={this.generateSubordinates}
                  t={t}
                />

              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loadSharedEmployeesForManagerStatus: state.employeesReducer.loadSharedEmployeesForManagerStatus,
    loadSharedEmployeesForManagerErrors: state.employeesReducer.loadSharedEmployeesForManagerErrors,
    sharedEmployeesForManager: state.employeesReducer.sharedEmployeesForManager,

    teamLeadersAndManagers: state.employeesReducer.teamLeadersAndManagers,
    loadTeamLeadersAndManagersStatus:  state.employeesReducer.loadTeamLeadersAndManagersStatus,
    loadTeamLeadersAndManagersErrors: state.employeesReducer.loadTeamLeadersAndManagersErrors,

    employees: state.employeesReducer.employees,
    resultBlockAddSharedEmployee: state.employeesReducer.resultBlockAddSharedEmployee
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadSharedEmployeesForManager: managerId =>  dispatch(loadSharedEmployeesForManager(managerId)),
    loadEmployees: (page, limit, other) =>  dispatch(loadEmployees(page, limit, other)),
    addSharedEmployee: (sharedEmployeeModel, destManagerId) =>  dispatch(addSharedEmployee(sharedEmployeeModel, destManagerId)),
    deleteSharedEmployee: (sharedEmployeeId, destManagerId) =>  dispatch(deleteSharedEmployee(sharedEmployeeId, destManagerId)),
    loadTeamLeadersAndManagers: () => dispatch(loadTeamLeadersAndManagers())
  };
};

export default connect( mapStateToProps, mapDispatchToProps)(translate("ShareEmployeesModal")(ShareEmployeesModal));
