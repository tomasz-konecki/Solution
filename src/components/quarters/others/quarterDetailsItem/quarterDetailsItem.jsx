import React from 'react'
import './quarterDetailsItem.scss';

const quarterDetailsItem = ({item}) => (
    <div className="quarter-details-item">
        <p><i className="fa fa-question"></i> {item.question}</p>
        <p><i className="fa fa-comment"></i> {item.answer}</p>
        
    </div>
);

export default quarterDetailsItem;