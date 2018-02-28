import React from "react";
import PropTypes from 'prop-types';

const Icon = ({iconType = "fas", iconSize = "lg", icon}) => {
  return (
    <i className={iconType + " fa-" + icon + " fa-" + iconSize}/>
  );
};

Icon.propTypes = {
  iconType: PropTypes.string,
  iconSize: PropTypes.string,
  icon: PropTypes.string
};

export default Icon;
