import React from 'react';

const dataList = props => (
    <div className="data-list-container">
        <input value={props.value}
        list="exampleList"
        onChange={props.onChange}
        onBlur={props.onBlur}
        className={props.error !== "" ? "input-error" : null}
        type="text" placeholder={props.placeholder}/>
        <datalist id="exampleList" className="select-input">
            {props.dataToMap && props.dataToMap.map(i => {
                return (<option value={i.name}  
                id={i.id}  key={i.id}>
                {i.name}
                </option>);
            })}
        </datalist>

    </div>
      
);

export default dataList;