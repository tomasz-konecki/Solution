import React from 'react'
import './calendarItem.scss';

const calendarItem = ({item, minutes, from, to}) => (
<div key={item.date + item.time} className="date">
    <p>
        <span><b>{item.date}</b> {item.monthName} ({item.dayName})</span> 
        <i className="fas fa-chart-pie"></i>
    </p>
    <p>
        <span>{from}: <b>{item.time}</b></span> 
        <span>{to}: <b>{item.willLastTo}</b></span> 
    </p>
    <p>
        <span><i className="fa fa-stopwatch"></i> {item.length} {minutes} </span>
        <i className="fa fa-chevron-down"></i>
    </p>
</div>
);

export default calendarItem;