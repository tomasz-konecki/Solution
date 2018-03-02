import React from "react";
import PropTypes from 'prop-types';

const Icon = ({iconType = "fas", iconSize = "", icon}) => {
  return (
    <i className={iconType + " fa-" + icon + (iconSize !== "" ? " fa-" + iconSize : "")}/>
  );
};

Icon.propTypes = {
  iconType: PropTypes.string,
  iconSize: PropTypes.string,
  icon: PropTypes.string
};

export default Icon;
