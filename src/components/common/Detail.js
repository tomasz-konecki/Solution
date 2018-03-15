import React from "react";

const Detail = props => {
  return (
    <div className="detail-container">
      <label>{props.pretty}</label>
      {props.editable === true ? (
        <input type={props.type} placeholder={props.user} />
      ) : (
        <span>{props.user}</span>
      )}
    </div>
  );
};

export default Detail;
