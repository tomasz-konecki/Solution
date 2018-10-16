import React from "react";

class SharedEmployeesListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharedEmployeesFilter: ''
    };
  }

  filterSharedEmployees = e => {
    this.setState({
      sharedEmployeesFilter: e.target.value.toLowerCase()
    });
  };

  render() {
    const {t} = this.props;

    return (
      <React.Fragment>

      <div className="row" style={{ marginTop: "10px", alignItems: "center" }}>
        <div className="col-6">{t("SharedEmployees")} :</div>
        <div className="col-6">
          {this.props.sharedEmployeesForManager &&
          this.props.sharedEmployeesForManager.length > 0 ? (
            <input
              type="text"
              placeholder={t("Search") + "..."}
              className="form-control search-btn"
              onChange={e => this.filterSharedEmployees(e)}
            />
          ) : (
            <input
              type="text"
              placeholder={t("Search") + "..."}
              className="form-control search-btn"
              disabled
            />
          )}
        </div>
      </div>

      <div className="shared-employees-container">
        {this.props.sharedEmployeesForManager && this.props.sharedEmployeesForManager.map((sharedEmployee, index) => {
            return (
              <div
                className={this.props.errorElementsDeleting.filter(e => e.empId === sharedEmployee.employeeId ).length > 0 ? "red shared-row" : "shared-row"}
                key={index}
              >
                {(sharedEmployee.firstName.toLowerCase() + " " + sharedEmployee.lastName.toLowerCase()).includes(this.state.sharedEmployeesFilter) ? (
                  <div className="row align-center">
                    <div className="col-7">{sharedEmployee.firstName}{" "}{sharedEmployee.lastName}</div>
                    <div className="col-5">
                      <button onClick={() => this.props.stopSharingEmployee(sharedEmployee.id,sharedEmployee.employeeId)}
                        className={this.props.currentlyDeletingIds.includes(sharedEmployee.employeeId) ? "clicked shared-btn" : "shared-btn"}
                      >
                        {this.props.currentlyDeletingIds.includes(sharedEmployee.employeeId) ?
                        (
                          <div className="align-center">
                            <div className="lds-dual-ring" />
                            <div>
                              <i className="fa fa-stop-circle btn-icon" />
                              {t("StopSharing")}
                            </div>
                          </div>
                        ) : (
                          <div className="align-center">
                            <i className="fa fa-stop-circle btn-icon" />
                            {t("StopSharing")}
                          </div>
                        )}
                      </button>
                    </div>

                    {this.props.errorElementsDeleting.filter(e => e.empId === sharedEmployee.employeeId).length > 0 &&
                      this.props.errorElementsDeleting.filter(e => e.empId === sharedEmployee.employeeId).map(
                        error => (<div className="col-sm-12" style={{textAlign: "center",fontSize: "0.8rem"}}>{error.error}</div>)
                    )}

                  </div>
                ) : (
                  <div />
                )}
              </div>
            );
          })}
      </div>
      </React.Fragment>
    )
  }
}

export default SharedEmployeesListContainer;
