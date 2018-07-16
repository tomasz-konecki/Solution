import React from 'react'
import './operationLoader.scss';
import Spinner from '../spinner/spinner';
const operationLoader = props => (
    <div onClick={props.close} className="backdrop">
        {props.isLoading ? 
            <Spinner /> : 
            <p>{props.operationError}</p>
        }
    </div>
);

export default operationLoader;