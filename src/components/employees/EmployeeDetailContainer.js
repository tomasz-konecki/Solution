import React, { Component } from 'react';
import LoaderCircular from './../common/LoaderCircular';
import Icon from './../common/Icon';

class EmployeeDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  pullDOM = () => {
    return <div className="row">
      <div className="col-sm-5 employee-id-block">
        <Icon icon="address-card" iconSize="3x"/>
        <h1>Artur Bartczak</h1>
        <hr/>
      </div>
    </div>;
  };

  render() {
    return (
      <div className="content-container employee-detail-container">
        { this.state.loading ? <LoaderCircular/> : this.pullDOM() }
      </div>
    );
  }
}

export default EmployeeDetailContainer;
