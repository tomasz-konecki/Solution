import React from "react";

const CheckBox = props => {
  return (
    <div className="check-box-container">
      <input
        type={props.type}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        checked={props.checked}
      />
      <span>{props.value}</span>
    </div>
  );
};

export default CheckBox;
