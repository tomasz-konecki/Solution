import React from 'react'
import './calendarItem.scss';

const calendarItem = ({item}) => (
<div key={item.date + item.time} className="date">
    <p>
        <span><b>{item.date}</b> {item.monthName} ({item.dayName})</span> 
        <i title="Pokaż zajęte godziny" className="fas fa-chart-pie"></i>
    </p>
    <p>
        <span>Od: <b>{item.time}</b></span> 
        <span>Do: <b>{item.willLastTo}</b></span> 
    </p>
    <p>
        <span><i className="fa fa-stopwatch"></i> {item.length} minut </span>
        <i className="fa fa-chevron-down"></i>
    </p>
</div>
);

export default calendarItem;