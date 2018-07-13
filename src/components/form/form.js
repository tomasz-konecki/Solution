import React, { Component } from 'react';
import './form.scss';
import DatePicker from "react-datepicker";
import { translate } from 'react-translate';
import moment from "moment";
import { validateInput, validateDate } from '../../services/validation';
import DataList from './dataList/dataList';
import { contains } from '../../services/methods';
import SpinnerButton from './spinner-btn/spinner-btn';
import WebApi from '../../api/index';
import SmallSpinner from '../common/spinner/small-spinner';

class Form extends Component{
    state = {
        startDate: moment(),
        endDate: moment(this.props.estimatedEndDate),
        formItems: this.props.formItems,
        validationResult: true,
        transactionEnd: false,
        isServerSearching: false,
        showList: false,

        searchedList: [],
        showSearchedList: false
    }
    onKeyPress = (e, index, typedVal) => {
        if(e.key === 'Enter')
            this.addItemToList(index, typedVal);
    }
    addItemToList = (index, typedVal) => {
        const formItems = [...this.state.formItems];
        if(contains(typedVal, formItems[index].value))
            formItems[index].error = `Lista zawiera już element ${typedVal}`;
    
        else{
            formItems[index].error = validateInput(
                typedVal,
                false, 
                3,
                120, 
                null, 
                "Zakres obowiązków"
            );
            
            if(formItems[index].error === ""){
                formItems[index].value.push(typedVal);
            }
            
        }
        
        this.setState({formItems: formItems, showList: formItems[index].error ? false : true});
    }
    deleteItemFromList = (index, arrayIndex) => {
        const formItems = [...this.state.formItems];
        let newArray = [...formItems[arrayIndex].value];

        newArray.splice(index, 1);
        formItems[arrayIndex].value = newArray;
        this.setState({formItems: formItems});
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
                    (formItems[key].mode === "input-with-add-items" ? 
                    formItems[key].typedListVal : formItems[key].value),
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
    onDateChange = (date, id) => {
        let newFormItems = [...this.state.formItems];
        newFormItems[id].value = moment(date);
        
        let shouldSubmit = true;
        if(this.props.dateIndexesToCompare){
            const { dateIndexesToCompare } = this.props;
            const startDate = moment(newFormItems[dateIndexesToCompare[0]].value);
            const endDate = moment(newFormItems[dateIndexesToCompare[1]].value);
            const validationResult = validateDate(startDate, endDate);

            for(let i = 0; i < validationResult.length; i++)
                newFormItems[dateIndexesToCompare[i]].error = validationResult[i];
            if(validationResult[0])
                shouldSubmit = false;
        }

        this.setState({formItems: newFormItems, validationResult: shouldSubmit});
    }
    onChangeInput = (e, id, type) => {
        const newFormItems = [...this.state.formItems];

        if(newFormItems[id].mode !== "input-with-add-items")
            newFormItems[id].value = e.target.value;
        else
            newFormItems[id].typedListVal = e.target.value;

        newFormItems[id].error = validateInput(e.target.value,
             newFormItems[id].canBeNull, 
             newFormItems[id].minLength,
             newFormItems[id].maxLength,
             newFormItems[id].inputType, 
             newFormItems[id].title); 

        this.setState({newFormItems: newFormItems, validationResult: newFormItems[id].error ? false : true, 
            showList: newFormItems[id].mode === "input-with-add-items" ? newFormItems[id].error === "" ? 
                true : false : false});
    }
    
    onKeyPressToSearch = (e, index) => {
        if(e.key == 'Enter' && !this.state.formItems[index].error && 
            this.state.formItems[index].value){
            this.searchOnServer(index);
        }
    }
    searchOnServer = index => {
        this.setState({isServerSearching: true});
        const apiCommandSettings={
            "limit": 1000,
            "ascending": true,
            "isDeleted": false,
            "employeeFilter": {
                "hasAccount": true,
                "firstName": this.state.formItems[index].value
            }        
        }
        
        WebApi.employees.post.list(apiCommandSettings).then(response => {
            const formItems = [...this.state.formItems];
            let shouldShowSearchList = false;
            if(response.replyBlock.data.dtoObject.results.length === 0)
                formItems[index].error = "Nie ma takiego pracownika";
            else if(response.replyBlock.data.dtoObject.results.length === 1){
                formItems[index].value = response.replyBlock.data.dtoObject.results[0].id;
            }
            else
                shouldShowSearchList = true;
            
            this.setState({searchedList: response.replyBlock.data.dtoObject.results, 
                isServerSearching: false, formItems: formItems, showSearchedList: shouldShowSearchList});
        }).catch(error => {
            newFormItems[id].error = "Błąd serwera";
            this.setState({isServerSearching: false});
        })                          
    }
    selectSearched = (index, mainListIndex) => {
        const formItems = [...this.state.formItems];
        formItems[mainListIndex].value = this.state.searchedList[index].id;
        formItems[mainListIndex].error = "";
        this.setState({formItems: formItems, showSearchedList: false});
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

    onSelect = (e, index) => {
        const formItems = [...this.state.formItems];
        formItems[index].value = e.target.value;
        this.setState({formItems: formItems});
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
                            /> : 
                            i.mode === "type-ahead" ?
                            
                            <div className="type-ah-container">
                                <input 
                                autoComplete="off"
                                onFocus={this.state.searchedList.length > 0 ? 
                                () => this.setState({showSearchedList: true}) : null}

                                onKeyPress={e => this.onKeyPressToSearch(e, index)}
                                disabled={this.state.isServerSearching ? true : false}
                                className={i.error !== "" ? "input-error" : this.state.isServerSearching ? 
                                    "input-dis" : null} 
                                onChange={e => this.onChangeInput(e, index, i.mode)} 
                                type={i.type} value={i.value} 
                                placeholder={i.placeholder} 
                                />
                                


                                {this.state.isServerSearching ? 
                                    <SmallSpinner /> :
                                    <i onClick={() => this.searchOnServer(index)} className="fa fa-search"></i> 
                                }
                                {(this.state.searchedList.length === 1  && !this.state.formItems[index].error) && 
                                <p className="found-person-succ">
                                    Znaleziono użytkownika {this.state.searchedList[0].fullName}
                                </p>
                                }

                                {this.state.showSearchedList && 
                                    <ol className="responsibilites-list">
                                        {this.state.searchedList.map((j, itemIndex) => {
                                            return (
                                            <li onClick={() => this.selectSearched(itemIndex, index)} key={j.id}>
                                                {j.fullName} 
                                            </li>
                                            );
                                        })}
                                    </ol>
                                }
                                
                            </div> : 
                            
                            i.mode === "input-with-add-items" ? 
                            
                            <div className="input-with-add-list-container">
                                <input
                                onKeyPress={e => this.onKeyPress(e, index, i.typedListVal)}
                                className={i.error !== "" ? "input-error" : null} 
                                value={i.typedListVal} onChange={e => this.onChangeInput(e, index)} type="text" placeholer={i.placeholder} />
                                <i onClick={() => this.addItemToList(index, i.typedListVal)} className="fa fa-plus"></i>

                                {(this.state.showList && this.state.formItems[index].value.length > 0) && 
                                    <ol className="responsibilites-list">
                                        {i.value.map((j, itemIndex) => {
                                            return (
                                            <li key={j}>
                                                {j} 
                                                <i onClick={() => this.deleteItemFromList(itemIndex, index)} className="fa fa-minus"></i>
                                            </li>
                                            );
                                        })}

                                        <li className="list-close" 
                                        onClick={() => this.setState({showList: false})}>Zamknij</li>
                                    </ol>
                                }
                                
                            </div> 

                            :

                            i.mode === "select" ? 
                            <select className="simple-select" 
                            value={i.value} 
                            onChange={e => this.onSelect(e, index)}>
                                {i.selectValues.map(j => {
                                    return (
                                        <option key={j} value={j}>{j}</option>
                                    );
                                })}
                            </select>
                            
                            : null}
                    
                            <p className="form-error">
                                <span>{i.error}</span>
                            </p>
                        </div>
                        
                    </section>
                    );
                })}
                

                {this.props.children}


                <SpinnerButton 
                validationResult={this.state.validationResult}
                transactionEnd={this.state.transactionEnd}
                onClickHandler={this.onClickHandler}
                isLoading={this.props.isLoading}
                shouldSubmit={this.props.shouldSubmit}
                btnTitle={this.props.btnTitle}
                submitResult={this.props.submitResult}
                />
                
            </form> 
        );
    }
}

export default Form;
