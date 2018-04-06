import React from "react";
import PropTypes from "prop-types";

const Logo = props => {
  return (
    <div className={'logo ' + props.size}/>
  );
};

Logo.propTypes = {
  size: PropTypes.string
};

export default Logo;
