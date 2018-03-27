import React, { Component } from "react";
import "../../scss/components/projectsModals/ResponsiblePersonBlock.scss";

const ResponsiblePersonBlock = project => {
  return (
    <div className="responsible-person-container col-sm-9">
      <div className="form-group row">
        <div className="col-sm-6 responsible-person-left">
          <input
            name="firstName"
            value={project.responsiblePerson.firstName}
            placeholder="Imię"
            className="form-control"
            onChange={project.setResponsiblePerson}
          />
        </div>
        <div className="col-sm-6 responsible-person-right">
          <input
            name="lastName"
            value={project.responsiblePerson.lastName}
            placeholder="Nazwisko"
            className="form-control"
            onChange={project.setResponsiblePerson}
          />
        </div>
      </div>

      <div className="form-group row">
        <div className="col-sm-6 responsible-person-left">
          <input
            name="email"
            pattern="/^(([^<>()\[\]\\.,;:\s@&quot;]+(\.[^<>()\[\]\\.,;:\s@&quot;]+)*)|(&quot;.+&quot;))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/"
            value={project.responsiblePerson.email}
            placeholder="Email"
            className="form-control"
            onChange={project.setResponsiblePerson}
          />
        </div>
        <div className="col-sm-6 responsible-person-right">
          <input
            name="phoneNumber"
            value={project.responsiblePerson.phoneNumber}
            placeholder="Telefon"
            className="form-control"
            onChange={project.setResponsiblePerson}
          />
        </div>
      </div>
    </div>
  );
};

export default ResponsiblePersonBlock;
