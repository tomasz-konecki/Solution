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
            onChange={project.handleChange}
          />
          <p className={project.styles.firstName}>
            Imię nie może zawierać znaków specjalnych ani cyfr.
          </p>
        </div>
        <div className="col-sm-6 responsible-person-right">
          <input
            name="lastName"
            value={project.responsiblePerson.lastName}
            placeholder="Nazwisko"
            className="form-control"
            onChange={project.handleChange}
          />
          <p className={project.styles.lastName}>
            Nazwisko nie może zawierać znaków specjalnych ani cyfr.
          </p>
        </div>
      </div>

      <div className="form-group row">
        <div className="col-sm-6 responsible-person-left">
          <input
            name="email"
            value={project.responsiblePerson.email}
            placeholder="Email"
            className="form-control"
            onChange={project.handleChange}
          />
          <p className={project.styles.email}>
            Adres email powinien mieć odpowiednią strukturę, np. me@mydomain.com
          </p>
        </div>
        <div className="col-sm-6 responsible-person-right">
          <input
            name="phoneNumber"
            value={project.responsiblePerson.phoneNumber}
            placeholder="Telefon"
            className="form-control"
            maxLength="11"
            onChange={project.handleChange}
          />
          <p className={project.styles.phoneNumber}>
            Numer telefonu powinien zawierać od 9 do 11 cyfr
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResponsiblePersonBlock;
