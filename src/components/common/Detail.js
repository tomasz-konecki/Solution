import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../scss/components/Detail.scss";

const Detail = props => {
  return (
    <div className="form-group row">
      <label className="col-sm-3 col-form-label">{props.pretty}</label>

      {props.editable === true && props.type === "textarea" ? (
        <div className="col-sm-9">
          <textarea
            rows={props.rows}
            cols={props.cols}
            resize="none"
            className="form-control"
          >
            {props.value}
          </textarea>
        </div>
      ) : props.editable === true ? (
        <div className="col-sm-9">
          <input
            type={props.type}
            className="form-control"
            name={props.name}
            value={props.value || ""}
            placeholder={props.value}
            required={props.required}
            onChange={props.handleChange}
          />
        </div>
      ) : (
        <div className="col-sm-9">
          <span>{props.value}</span>
        </div>
      )}
    </div>
  );
};

export default Detail;
