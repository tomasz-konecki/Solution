import React from "react";
import PropTypes from 'prop-types';

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

CheckBox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  icon: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool
};

export default CheckBox;
