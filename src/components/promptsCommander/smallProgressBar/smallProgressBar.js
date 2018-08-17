import React from 'react'
import './smallProgressBar.scss';

const smallProgressBar = ({percentage, message}) => (
    <div className="small-progress-bar">
        {percentage > 0 && 
        <div style={{width: `${percentage}%`}} className="progress-state">
            <span>{percentage} %</span>
        </div>
        }
        
        <div className="progress-message">{message}</div>
    </div>
);

export default smallProgressBar;