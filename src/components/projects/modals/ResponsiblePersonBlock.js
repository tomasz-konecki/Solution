import React, { Component } from "react";
import "../../../scss/components/projects/modals/ResponsiblePersonBlock.scss";
import { translate } from 'react-translate';

const ResponsiblePersonBlock = ({project, t}) => {
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
            {t("NameNoSpecial")}
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
            {t("SurnameNoSpecial")}
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
            {t("EmailToBeValid")}
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
            {t("NumberValid")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default translate("ResponsiblePersonBlock")(ResponsiblePersonBlock);
