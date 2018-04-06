import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../scss/components/common/Detail.scss";

const Detail = details => {
  return (
    <div className="form-group row">
      <label className="col-sm-3 col-form-label">{details.pretty}</label>

      {details.editable === true && details.type === "textarea" ? (
        <div className="col-sm-9">
          <textarea
            rows={details.rows}
            cols={details.cols}
            resize="none"
            className="form-control"
            name={details.name}
            value={details.value || ""}
            onChange={details.handleChange}
          />
        </div>
      ) : details.editable === true ? (
        <div className="col-sm-9">
          <input
            type={details.type}
            className="form-control"
            name={details.name}
            value={details.value || ""}
            placeholder={details.value}
            required={details.required}
            onChange={details.handleChange}
          />
        </div>
      ) : (
        <div className="col-sm-9">
          <span>{details.value}</span>
        </div>
      )}
    </div>
  );
};

export default Detail;
