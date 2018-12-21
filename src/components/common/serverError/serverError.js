import React from 'react'
import './serverError.scss';


const serverError = ({message, errorClass}) => (
    <p className={!errorClass ? "server-error" : errorClass}>
        {message}
    </p>
);

export default serverError;