import React from 'react'
import './spinner.scss';

const spinner = ({containerClass, positionClass, message, ...styles}) => {
    const spinnerContent = (
        <div className={containerClass + " " + positionClass}>
            <div style={{...styles}} className="load-page-spinner" />
            {message && 
                <p>
                    <span>{message}</span>
                </p>
            }
        </div>
    );
    return spinnerContent;
}

spinner.defaultProps = {
    containerClass: "load-page-container",
    positionClass: "fixed-centered-content"

}

export default spinner;
