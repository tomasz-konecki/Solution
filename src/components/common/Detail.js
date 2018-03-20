import React from "react";
import "bootstrap/dist/css/bootstrap.css";

const Detail = props => {
  return (
    <div className="detail-container">
      <label>{props.pretty}</label>

      {props.editable === true && props.type === "textarea" ? (
        <textarea rows={props.rows} cols={props.cols} resize="none">
          {props.value}
        </textarea>
      ) : props.editable === true ? (
        <input
          type={props.type}
          name={props.name}
          value={props.value}
          placeholder={props.value}
          required={props.required}
          onChange={props.handleChange}
        />
      ) : (
        <span>{props.value}</span>
      )}
    </div>
  );
};

export default Detail;
