import React from 'react'
import './operationStatusPrompt.scss';

const operationStatusPrompt = props => (
    <div className={`operation-prompt ${props.operationPrompt === true ? 
    "operation-ok" : "operation-false"}`}>
        {props.operationPromptContent}
    </div>
);
export default operationStatusPrompt;