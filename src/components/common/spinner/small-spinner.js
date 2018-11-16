import React from 'react'
import './spinner.scss';

const smallSpinner = props => (
    <div className={`small-spiner ${props.nameOfClass}`}></div>
);
smallSpinner.defaultProps = {
  nameOfClass: ""
}

export default smallSpinner;
