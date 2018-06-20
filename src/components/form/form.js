import React, { Component } from 'react';
import './form.scss';
import DatePicker from "react-datepicker";
import { translate } from 'react-translate';
import moment from "moment";
import { validateInput, validateDate } from '../../services/validation';
import DataList from './dataList/dataList';
class Form extends Component{
    state = {
        startDate: moment(),
        endDate: moment(this.props.estimatedEndDate),
        formItems: this.props.formItems,
        validationResult: true,
        transactionEnd: false
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.submitResult){
            if(nextProps.submitResult.status){
                this.setState({transactionEnd: true});
            }
        }
    }
    validateAllInputs = () => {
        let result = true;
        const formItems = [...this.state.formItems];
        for(let key in formItems){
            if(formItems[key].mode !== "date-picker"){
                formItems[key].error = validateInput(
                    formItems[key].value,
                    formItems[key].canBeNull, 
                    formItems[key].minLength,
                    formItems[key].maxLength,
                    formItems[key].inputType, 
                    formItems[key].title
                );
            }
          
            if(formItems[key].error !== ""){
                result = false;
            }

        }
        this.setState({validationResult: result, formItems: formItems});
        return result;
    }
    
    dateValidate = (id, newFormItems) => {
        for(let i = 0; i < this.props.dateIndexesToCompare.length; i++){
            if(this.props.dateIndexesToCompare[i] !== id){
                newFormItems[id].error = validateDate(newFormItems[id].value,
                    newFormItems[id].name, moment(newFormItems[this.props.dateIndexesToCompare[i]].value));

                this.setState({validationResult: newFormItems[id].error ? false : true});
            }
        }
    }

    onDateChange = (date, id) => {
        let newFormItems = [...this.state.formItems];
        newFormItems[id].value = moment(date);
        
        let result = true;
        if(this.props.dateIndexesToCompare){
            for(let i = 0; i < this.props.dateIndexesToCompare.length; i++){
                if(this.props.dateIndexesToCompare[i] !== id){
                    newFormItems[id].error = validateDate(newFormItems[id].value,
                        newFormItems[id].name, moment(newFormItems[this.props.dateIndexesToCompare[i]].value));
    
                    if(newFormItems[id].error)
                        result = false;
                }
            }
        }

        this.setState({formItems: newFormItems, validationResult: result});
    }
    onChangeInput = (e, id) => {
        const newFormItems = [...this.state.formItems];
        newFormItems[id].value = e.target.value;
        newFormItems[id].error = validateInput(e.target.value,
             newFormItems[id].canBeNull, 
             newFormItems[id].minLength,
             newFormItems[id].maxLength,
             newFormItems[id].inputType, 
             newFormItems[id].title)
        
        
        this.setState({newFormItems: newFormItems, validationResult: newFormItems[id].error ? false : true});
    }

    onClickHandler = () => {
        if(this.validateAllInputs() === true){
            this.props.onSubmit();
        }
    }

    onSubmit = e => {
        e.preventDefault();
        if(this.validateAllInputs() === true){
            this.props.onSubmit();
        }
    }
    render(){
        return(
            <form onSubmit={this.props.shouldSubmit ? e => this.onSubmit(e) : null} 
            className="universal-form-container">

                {this.state.formItems.map((i, index) => {
                    return (
                    <section className="input-container" key={i.title}>
                        <label>{i.title}</label>
                        <div className="right-form-container">
                            {!i.mode ? 
                            <input className={i.error !== "" ? "input-error" : null} 
                            id={index} value={i.value} onChange={e => this.onChangeInput(e, index)} type="text" 
                            placeholder={i.placeholder}/> :
        
                            i.mode === "textarea" ?
                            <textarea className={i.error !== "" ? "input-error" : null} 
                            id={index} value={i.value} onChange={e => this.onChangeInput(e, index)}
                            placeholder={i.placeholder}></textarea> : 
        
                            i.mode === "drop-down-with-data" ? 
                            
                            <DataList dataToMap={this.props.clientsWhichMatch} 
                            onChange={this.props.onChangeClient}
                            value={i.value}
                            placeholder={i.placeholder}
                            error={i.error}
                            onBlur={this.props.onBlur}
                            /> :

                            i.mode === "date-picker" ? 
        
                            
                            <DatePicker
                            style={{width: '100%'}}
                            className={i.error !== "" ? "input-error" : "date-picker"} 
                            startDate={i.name === "startDate" ? this.state.startDate : this.state.endDate} 
                            selected={moment(i.value)}
                            endDate={i.name === "endDate" ? this.state.endDate : this.state.startDate}
                            locale="pl"
                            onChange={date => this.onDateChange(date, index)}
                            dateFormat="DD/MM/YYYY"
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            /> : null}
                          
                            <p className="form-error">
                                <span>{i.error}</span>
                            </p>
                        </div>
                        
                    </section>
                    );
                })}
                

                {this.props.children}


                <button 
                    disabled={(!this.state.validationResult || this.props.error || this.state.transactionEnd) ? true : false}
                    onClick={this.onClickHandler} 
                    className={!this.props.isLoading ? `submit-btn ${(!this.state.validationResult || this.props.error || this.state.transactionEnd) ? 
                        "submit-btn-dis" : "submit-btn-cor"}` : "spinner-btn"} 
                        type={this.props.shouldSubmit ? "submit" : "button"}>
            
                        {this.props.isLoading ? "" : this.props.btnTitle}
                </button>
                
                
                
                {(this.props.submitResult && !this.props.isLoading) && 
                this.props.submitResult.status !== null && 
                <p className={this.props.submitResult.status === true ? "correct-status" : "incorrect-status"}>
                    {this.props.submitResult.content}
                </p> 
                }
                
            </form> 
        );
    }
}

export default Form;
