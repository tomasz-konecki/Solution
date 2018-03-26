import React from "react";
import "../../scss/components/projectsModals/ResponsiblePersonBlock.scss";

const ResponsiblePersonBlock = () => {
  return (
    <div className="responsible-person-container">
      <div className="form-group row">
        <div className="col-sm-6 responsible-person-left">
          <input placeholder="Imię" className="form-control" />
        </div>
        <div className="col-sm-6 responsible-person-right">
          <input placeholder="Nazwisko" className="form-control" />
        </div>
      </div>

      <div className="form-group row">
        <div className="col-sm-6 responsible-person-left">
          <input placeholder="Email" className="form-control" />
        </div>
        <div className="col-sm-6 responsible-person-right">
          <input placeholder="Telefon" className="form-control" />
        </div>
      </div>
    </div>
  );
};

export default ResponsiblePersonBlock;
