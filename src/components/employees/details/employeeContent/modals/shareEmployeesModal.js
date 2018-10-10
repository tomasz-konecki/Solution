import React from 'react'
import { connect } from "react-redux";
import Modal from 'react-responsive-modal';
import { loadSharedEmployeesForManager, loadEmployees, addSharedEmployee, deleteSharedEmployee, loadTeamLeadersAndManagers } from "../../../../../actions/employeesActions";
import Spinner from "../../../../common/spinner/spinner";
import Button from '../../../../common/button/button';
import { translate } from "react-translate";
import './sharedEmployeesModal.scss';

class ShareEmployeesModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      loadingTeamLeadersAndManagers: false,
      loadingSharedEmployees: false,
      loadingEmployees: false,
      choosenLeader: false,
      activeLeader: null,

      employeesFilter: '',
      sharedEmployeesFilter: '',

      currentlyAddingIds : [],
      currentlyDeletingIds : [],
      errorElementsAdding: [],
      errorElementsDeleting: [],

      showSubordinatesId : null,
      subordinates: []
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.teamLeadersAndManagers !== this.props.teamLeadersAndManagers)
    {
      this.state.loadingTeamLeadersAndManagers = false
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

    if (nextProps.sharedEmployeesForManager !== this.props.sharedEmployeesForManager)
    {
      this.state.loadingSharedEmployees = false
    }
  }


  componentDidMount = () => {
    const { loadTeamLeadersAndManagers } = this.props;

    if(this.state.loadingTeamLeadersAndManagers === false)
    {
      this.setState({
        loadingTeamLeadersAndManagers: true,
      })
    }

    loadTeamLeadersAndManagers();
  }

  shareEmployee = (sharedEmployeeId) => {
    let deletingIds = [...this.state.currentlyDeletingIds];
    const index = deletingIds.indexOf(sharedEmployeeId);
    deletingIds.splice(index, 1);

    const sharedEmployeeModel = {
      employeeId: sharedEmployeeId,
      destinationManagerId: this.state.activeLeader
    };

    this.setState({
      currentlyAddingIds: [...this.state.currentlyAddingIds, sharedEmployeeId ],
      currentlyDeletingIds: deletingIds
    })

    this.props.addSharedEmployee(sharedEmployeeModel, this.state.activeLeader)
      .then()
      .catch((err) => {
        let addingIds = [...this.state.currentlyAddingIds];
        const i = addingIds.indexOf(sharedEmployeeId);
        addingIds.splice(i, 1);

        let errors = [...this.state.errorElementsAdding, {empId: sharedEmployeeId, error: err}];
        this.setState({
          errorElementsAdding: errors,
          currentlyAddingIds: addingIds
        })
      });
  }

  stopSharingEmployee = (sharedEmployeeId, employeeId) => {
    let addingIds = [...this.state.currentlyAddingIds];
    const index = addingIds.indexOf(employeeId);
    addingIds.splice(index, 1);

    this.setState({
      currentlyDeletingIds: [...this.state.currentlyDeletingIds, employeeId ],
      currentlyAddingIds: addingIds
    })

    this.props.deleteSharedEmployee(sharedEmployeeId, this.state.activeLeader)
      .then()
      .catch((err) => {
        let deletingIds = [...this.state.currentlyDeletingIds];
        const i = deletingIds.indexOf(employeeId);
        deletingIds.splice(i, 1);

        let errors = [...this.state.errorElementsDeleting, {empId: employeeId, error: err}];
        this.setState({
          errorElementsDeleting: errors,
          currentlyDeletingIds: deletingIds
        })
      });
  }

  getSubordinates = (employeeId) => {
    if(employeeId === this.state.showSubordinatesId)
    {
      this.setState({
        showSubordinatesId: null,
        subordinates: []
      })
    }else{
      let emp = this.props.employees.filter(e => e.managerId === employeeId);

      this.setState({
        showSubordinatesId: employeeId,
        subordinates: emp
      })
    }
  }

  chooseLeader = (e) => {
    if(this.state.choosenLeader === false)
    {
      this.setState({
        choosenLeader: true
      })
    }
    if(this.state.loadingSharedEmployees === false)
    {
      this.setState({
        loadingSharedEmployees: true,
      })
    }
    if(this.state.loadingEmployees === false)
    {
      this.setState({
        loadingEmployees: true,
      })
    }

    this.setState({
      activeLeader: e.target.value
    })

    this.setState({
      currentlyAddingIds : [],
      currentlyDeletingIds : [],
      errorElementsAdding: [],
      errorElementsDeleting: []
    })

    this.props.loadSharedEmployeesForManager(e.target.value);
    this.props.loadEmployees(1, 10000, null);
  }

  filterEmployees = (e) => {
    this.setState({
      employeesFilter: e.target.value.toLowerCase()
    })
  }

  filterSharedEmployees = (e) => {
    this.setState({
      sharedEmployeesFilter: e.target.value.toLowerCase()
    })
  }

  toogleModal = () => {
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    const {t} = this.props;

    return (
      <div className="shared-employees-modal">
        {this.props.employee.roles && this.props.employee.roles.includes("Team Leader") && (
          <Button
            onClick={this.toogleModal}
            title={<span><i class="fa fa-share-alt"></i> {t("ShareEmployees")} </span>}
            mainClass="generate-raport-btn share-btn"/>
        )}
        <Modal
          key={1}
          open={this.state.open}
          classNames={{ modal: "Modal" }}
          contentLabel="Share Employees Modal"
          onClose={() => this.toogleModal()}
        >
          <div>

            <header>{t("ChooseEmployeesToShare")}</header>
            <div style={{marginBottom: "10px"}}>{t("ChooseLeader")} :</div>
            <select className="form-control form-control-sm" onChange={(e) => this.chooseLeader(e)} disabled={this.state.loadingTeamLeadersAndManagers}>
              <option disabled selected>{t("ChooseLeader")}</option>
            {this.props.teamLeadersAndManagers && this.props.teamLeadersAndManagers.map(leader => {
              return (
                <option key={leader.id} value={leader.id}>{leader.firstName} {leader.lastName}</option>
              );
            })}
            </select>

            {this.state.loadingEmployees || this.state.loadingSharedEmployees || this.state.loadingTeamLeadersAndManagers ? <div><Spinner /></div>
            :<div>

              <div className="row" style={{marginTop: "10px", alignItems: "center"}}>
                <div className="col-sm-6">{t("SharedEmployees")} :</div>
                <div className="col-sm-6">
                  {this.props.sharedEmployeesForManager && this.props.sharedEmployeesForManager.length > 0
                    ? <input type="text" placeholder={t("Search") + '...'} className="form-control search-btn" onChange={(e) => this.filterSharedEmployees(e)}/>
                    : <input type="text" placeholder={t("Search") + '...'}  className="form-control search-btn" disabled/>
                  }
                </div>
              </div>
                <div className="shared-employees-container" >
                {this.props.sharedEmployeesForManager && this.props.sharedEmployeesForManager.map(sharedEmployee => {
                  return (
                    <div className={this.state.errorElementsDeleting.filter(e => e.empId === sharedEmployee.employeeId).length > 0 ? "red shared-row" : "shared-row"} key={sharedEmployee.id}>
                      {(sharedEmployee.firstName.toLowerCase() + ' ' + sharedEmployee.lastName.toLowerCase()).includes(this.state.sharedEmployeesFilter) ?
                      <div className="row">
                      <div className="col-sm-7" > {sharedEmployee.firstName} {sharedEmployee.lastName}</div>
                      <div className="col-sm-5">
                        <button onClick={() => this.stopSharingEmployee(sharedEmployee.id, sharedEmployee.employeeId)} className="shared-btn">
                          {this.state.currentlyDeletingIds.includes(sharedEmployee.employeeId)
                          ? <div>
                              <div className="lds-dual-ring"></div>
                              <div className="clicked">
                                <i className="fa fa-stop-circle btn-icon"></i>{t("StopSharing")}
                              </div>
                            </div>
                          : <div><i className="fa fa-stop-circle btn-icon"></i>{t("StopSharing")}</div>}
                        </button>
                      </div>
                      {this.state.errorElementsDeleting.filter(e => e.empId === sharedEmployee.employeeId).length > 0
                        && this.state.errorElementsDeleting.filter(e => e.empId === sharedEmployee.employeeId).map(error =>
                        <div className="col-sm-12" style={{textAlign: "center", fontSize: "0.8rem"}}>{error.error}</div>
                      )}</div> : <div></div>}
                    </div>
                  );
                })}
                </div>

                <div className="row" style={{marginTop: "10px", alignItems: "center"}}>
                  <div className="col-sm-6">{t("Employees")} :</div>
                  <div className="col-sm-6">
                    {this.props.employees && this.props.employees.length > 0
                      ? <input type="text" placeholder={t("Search") + '...'} className="form-control search-btn" onChange={(e) => this.filterEmployees(e)}/>
                      : <input type="text" placeholder={t("Search") + '...'} className="form-control search-btn" disabled/>}
                  </div>
                </div>
                <div className="employees-container">
                {this.props.employees && this.props.employees.map(employee => {
                  if(this.state.loadingEmployees === true)
                  {
                    this.setState({
                      loadingEmployees: false
                    })
                  }
                  return (
                    <div key={employee.id} className="emp-row">
                    {(employee.employeeShared === false && this.props.sharedEmployeesForManager.filter(e => e.employeeId === employee.id ).length === 0)
                        && (employee.firstName.toLowerCase() + ' ' + employee.lastName.toLowerCase()).includes(this.state.employeesFilter) &&

                        <div className={this.state.errorElementsAdding.filter(e => e.empId === employee.id).length > 0 ? "row red" : "row"}>

                          <div className="col-sm-7"> {employee.firstName} {employee.lastName}
                            {this.props.employees.filter(e => e.managerId === employee.id).length > 0
                              &&
                              <span>
                                <i className="fa fa-caret-down" style={{marginLeft: "5px", cursor: "pointer"}} onClick={() => this.getSubordinates(employee.id)}></i>
                              </span>

                            }
                          </div>

                          <div className="col-sm-5">
                            <button onClick={() => this.shareEmployee(employee.id)} className="emp-btn">
                              {this.state.currentlyAddingIds.includes(employee.id)
                              ? <div><div className="lds-dual-ring"></div>
                                  <div className="clicked"><i className="fa fa-share-alt btn-icon"></i>
                                    {this.props.employees.filter(e => e.managerId === employee.id).length > 0 ? t("ShareTeam") + ' [' + this.props.employees.filter(e => e.managerId === employee.id).length + ']' : t("Share")}
                                  </div>
                                </div>
                              : <div><i className="fa fa-share-alt btn-icon"></i>
                                  {this.props.employees.filter(e => e.managerId === employee.id).length > 0 ? t("ShareTeam") + ' [' + this.props.employees.filter(e => e.managerId === employee.id).length + ']' : t("Share")}
                                </div>}
                            </button>
                          </div>

                          {this.state.showSubordinatesId === employee.id && this.state.subordinates.length > 0 && this.state.subordinates.map(subordinate => {
                            return (
                                <div className="col-sm-12" style={{paddingLeft: "20px"}} key={subordinate.id}>
                                  <i className="fa fa-angle-right"></i> {subordinate.firstName} {subordinate.lastName}
                                </div>
                            )
                          })}

                          {this.state.errorElementsAdding.filter(e => e.empId === employee.id).length > 0
                            && this.state.errorElementsAdding.filter(e => e.empId === employee.id).map(error =>
                            <div className="col-sm-12" style={{textAlign: "center", fontSize: "0.8rem"}}>{error.error}</div>
                          )}

                        </div>
                    }
                    </div>
                  );
                })}
                </div>

              </div>}

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
    loadTeamLeadersAndManagersStatus: state.employeesReducer.loadTeamLeadersAndManagersStatus,
    loadTeamLeadersAndManagersErrors: state.employeesReducer.loadTeamLeadersAndManagersErrors,

    employees: state.employeesReducer.employees,
    resultBlockAddSharedEmployee: state.employeesReducer.resultBlockAddSharedEmployee
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadSharedEmployeesForManager: managerId => dispatch(loadSharedEmployeesForManager(managerId)),
    loadEmployees: (page,limit,other) => dispatch(loadEmployees(page,limit,other)),
    addSharedEmployee: (sharedEmployeeModel, destManagerId) => dispatch(addSharedEmployee(sharedEmployeeModel, destManagerId)),
    deleteSharedEmployee: (sharedEmployeeId, destManagerId) => dispatch(deleteSharedEmployee(sharedEmployeeId, destManagerId)),
    loadTeamLeadersAndManagers: () => dispatch(loadTeamLeadersAndManagers())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("ShareEmployeesModal")(ShareEmployeesModal));
