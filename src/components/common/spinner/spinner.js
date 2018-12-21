import React from 'react'
import './spinner.scss';

const spinner = props => (
    <div style={{top: props.top}} className="lds-ring"><div></div><div></div><div></div><div></div></div>
);
export default spinner;
