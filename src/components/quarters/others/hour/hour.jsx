import React from 'react'
import './hour.scss';

const hour = ({item, clickItemFunction}) => (
    <div onClick={clickItemFunction} className="hour-label">
        {item.name}
    </div>
);

export default hour;