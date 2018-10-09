import React from "react";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom';

const Logo = props => {
  return (
    <Link to="/main"> 
        <div className={'logo ' + props.size}/>
    </Link>
  );
};

Logo.propTypes = {
  size: PropTypes.string
};

export default Logo;
