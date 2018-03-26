import React, { Component } from "react";
import "../../scss/components/projectsModals/ResponsiblePersonBlock.scss";

class ResponsiblePersonBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
    let responsiblePerson = this.state;
    this.props.setResponsiblePerson(responsiblePerson);
  };

  render() {
    return (
      <div className="responsible-person-container">
        <div className="form-group row">
          <div className="col-sm-6 responsible-person-left">
            <input
              name="firstName"
              placeholder="Imię"
              className="form-control"
              onChange={this.handleChange}
            />
          </div>
          <div className="col-sm-6 responsible-person-right">
            <input
              name="lastName"
              placeholder="Nazwisko"
              className="form-control"
              onChange={this.handleChange}
            />
          </div>
        </div>

        <div className="form-group row">
          <div className="col-sm-6 responsible-person-left">
            <input
              name="email"
              pattern="/^(([^<>()\[\]\\.,;:\s@&quot;]+(\.[^<>()\[\]\\.,;:\s@&quot;]+)*)|(&quot;.+&quot;))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/"
              placeholder="Email"
              className="form-control"
              onChange={this.handleChange}
            />
          </div>
          <div className="col-sm-6 responsible-person-right">
            <input
              name="phoneNumber"
              placeholder="Telefon"
              className="form-control"
              onChange={this.handleChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ResponsiblePersonBlock;
