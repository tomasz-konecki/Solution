import React from 'react'
import './questionToSelect.scss';

const questionToSelect = ({item, clickItemFunction}) => (
    <div className={`single-question-to-select ${item.isChecked ? "check-animation" : "un-check-animation"}`}>
        <div className="question-value">
            {item.question}
        </div>
        <div onClick={clickItemFunction} className={`custom-checkbox-container ${item.isChecked ? "checked-checkbox" : "unchecked-checkbox"}`}>
            <i className={`fa fa-check`}></i>
        </div>
    </div>
);

export default questionToSelect;