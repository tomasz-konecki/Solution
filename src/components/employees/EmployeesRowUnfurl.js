import React, { Component } from 'react';
import { translate } from 'react-translate';

class EmployeesRowUnfurl extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { t } = this.props;
    return (
      <div className="row">
        <div className="col-sm-9"/>
        <div className="col-sm-3">
          <button className="dcmt-button button-success">{t("ActivateEmployee")}</button>
        </div>
      </div>
    );
  }
}

export default translate("EmployeesRowUnfurl")(EmployeesRowUnfurl);
