import React from 'react'
import './detail.scss';

const detail = props => (
    <p onMouseOver={() => props.extendDetailName(props.currentId)} 
        onMouseLeave={() => props.extendDetailName("")}
        className="detail-expander">
        {props.children}

        {props.extend && 
            <span className="show-expander">{props.originalName}</span>
        }
        
    </p>
);

export default detail;