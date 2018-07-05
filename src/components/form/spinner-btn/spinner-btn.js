import React from 'react'
import './spinner-btn.scss';
import Aux from '../../../services/auxilary';
const spinnerBtn = props => (
<Aux>
{(props.submitResult && !props.isLoading) && 
    props.submitResult.status !== null && 
    <p className={props.submitResult.status === true ? "correct-status" : "incorrect-status"}>
        {props.submitResult.content}
    </p> 
}


<button 
    disabled={(props.validationResult === false || props.transactionEnd) ? true : false}
    onClick={props.onClickHandler} 
    className={!props.isLoading ? `submit-btn ${(props.validationResult === false || props.transactionEnd) ? 
        "submit-btn-dis" : "submit-btn-cor"}` : "spinner-btn"} 
        type={props.shouldSubmit ? "submit" : "button"}>

        {props.isLoading ? "" : props.btnTitle}
        
</button>
</Aux>


    
);

export default spinnerBtn;