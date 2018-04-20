import React, { Component } from 'react';

class EmployeesRowUnfurl extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-9"/>
        <div className="col-sm-3">
          <button className="dcmt-button button-success">Aktywuj pracownika</button>
        </div>
      </div>
    );
  }
}

export default EmployeesRowUnfurl;
