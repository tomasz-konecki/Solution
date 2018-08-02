import React from 'react'

const skill = ({createSpans, skillName, markupWidth, background, arrayElementIndex, experience}) => (
    <li>
        <label>{skillName}</label>
        <div className="spans-container">
            {createSpans(arrayElementIndex)}
            <div style={{width: `${markupWidth}%`, background: `${background}`}} className="progress-markup"></div>
            <div className="years-of-expierience">
                {experience} <i className="fa fa-clock"></i>
            </div>
        </div>
        
    </li>
);

export default skill;