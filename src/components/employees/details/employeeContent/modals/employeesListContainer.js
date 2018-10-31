import React from "react";

class EmployeesListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employeesFilter: ''
    };
  }

  filterEmployees = e => {
    this.setState({
      employeesFilter: e.target.value.toLowerCase()
    });
  };

  render() {
    const {t} = this.props;
    return (
      <React.Fragment>
        <div className="row" style={{ marginTop: "10px", alignItems: "center" }} >
          <div className="col-6">{t("Employees")} :</div>
          <div className="col-6">
            {this.props.employees && this.props.employees.length > 0 ? (
              <input type="text" placeholder={t("Search") + "..."} className="form-control search-btn" onChange={e => this.filterEmployees(e)}/>
            ) : (
              <input type="text" placeholder={t("Search") + "..."} className="form-control search-btn" disabled />
            )}
          </div>
        </div>

        <div className="employees-container">
          {this.props.employees && this.props.employees.map((employee, index) => {
              return (
                <div key={index} className="emp-row">
                  {!employee.employeeShared && this.props.sharedEmployeesForManager.filter(e => e.employeeId === employee.id).length === 0 &&
                    (employee.firstName.toLowerCase() + " " + employee.lastName.toLowerCase()).includes(this.state.employeesFilter) &&
                    (
                      <div className={this.props.errorElementsAdding.filter(e => e.empId === employee.id).length > 0? "row red align-center": "row align-center"}>
                        <div className="col-7">
                          {employee.firstName} {employee.lastName}
                          {this.props.employees.filter( e => e.managerId === employee.id).length > 0 &&
                          (
                            <span>
                              <i className="fa fa-caret-down" style={{ marginLeft: "5px", cursor: "pointer" }} onClick={() =>this.props.getSubordinates(employee.id)}/>
                            </span>
                          )}
                        </div>

                        <div className="col-5">
                          <button onClick={() => this.props.shareEmployee(employee.id)}
                            className={this.props.currentlyAddingIds.includes(employee.id) ? "clicked emp-btn" : "emp-btn"}
                          >
                            {this.props.currentlyAddingIds.includes(employee.id) ?
                            (
                              <div className="align-center">
                                <div className="lds-dual-ring" />
                                <div className="clicked">
                                  <i className="fa fa-share-alt btn-icon"/>
                                  {this.props.employees.filter(e => e.managerId === employee.id).length > 0
                                    ? t("ShareTeam") + " [" + this.props.generateSubordinates(employee.id).length +"]"
                                    : t("Share")}
                                </div>
                              </div>
                            ) : (
                              <div className="align-center">
                                <i className="fa fa-share-alt btn-icon"/>
                                {this.props.employees.filter(e => e.managerId === employee.id).length > 0
                                  ? t("ShareTeam") +" [" + this.props.generateSubordinates(employee.id).length +"]"
                                  : t("Share")}
                              </div>
                            )}
                          </button>
                        </div>

                        {this.props.showSubordinatesId === employee.id && this.props.subordinates.length > 0 &&
                          this.props.subordinates.map(subordinate => {
                            return (
                              <div className="col-sm-12" style={{ paddingLeft: "20px" }} key={subordinate.id} >
                                <i className="fa fa-angle-right subordinate-right-arrow" />{subordinate.firstName}{" "}{subordinate.lastName}
                              </div>
                            );
                          })}

                        {this.props.errorElementsAdding.filter(e => e.empId === employee.id).length > 0 &&
                          this.props.errorElementsAdding
                            .filter(e => e.empId === employee.id)
                            .map(error => (
                              <div className="col-sm-12" style={{textAlign: "center", fontSize: "0.8rem"}}>
                                {error.error}
                              </div>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}
        </div>
      </React.Fragment>
    )
  }
}

export default EmployeesListContainer;
