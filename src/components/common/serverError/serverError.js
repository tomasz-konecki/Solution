import React from 'react'
import './serverError.scss';


const serverError = ({message}) => (
    <p className="server-error">
        {message}
    </p>
);

export default serverError;