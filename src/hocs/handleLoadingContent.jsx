import React from 'react';
import OperationStatusPrompt from '../components/form/operationStatusPrompt/operationStatusPrompt.js';
import Spinner from '../components/common/spinner/spinner.js';
const loadHandling = WrappedComponent => ({isLoading, operationStatus, children, errors, closePrompt}) => (
    <WrappedComponent>
        {isLoading ? <Spinner fontSize="7px" /> :  
            operationStatus ? children : 
            operationStatus === false &&
            <OperationStatusPrompt 
            closePrompt={closePrompt}
            operationPromptContent={errors[0]}
            operationPrompt={operationStatus}
            />
        }
    </WrappedComponent>
);

const loadHandlingWrapper = loadHandling(({children}) => <React.Fragment>{children}</React.Fragment>);

export default loadHandlingWrapper;
