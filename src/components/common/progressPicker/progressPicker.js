import React from 'react'
import './progressPicker.scss';

const progressPicker = props => (
    <div className="progress-btns">
        {props.createResult.map(j => {
            return j;
        })}
    </div>
);

export default progressPicker;