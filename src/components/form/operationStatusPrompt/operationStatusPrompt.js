import React from 'react'
import './operationStatusPrompt.scss';

const operationStatusPrompt = ({closePrompt, operationPrompt, operationPromptContent}) => (
    <div className={`operation-prompt ${operationPrompt === true ? 
    "operation-ok" : "operation-false"}`}>
        {operationPromptContent}
        {closePrompt && 
            <i onClick={closePrompt} className="fa fa-times"></i>
        }
    </div>
);
export default operationStatusPrompt;