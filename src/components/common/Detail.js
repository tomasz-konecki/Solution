import React from "react";

const Detail = props => {
  return (
    <div className="detail-container">
      <label>{props.pretty}</label>
      {props.editable === true ? (
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
