import React from 'react';

const dataList = props => (
    <div className="data-list-container">
        <input value={props.value}
        list={props.identity}
        onChange={props.onChange}
        onBlur={props.onBlur}
        autoComplete="off"
        className={props.error !== "" ? "input-error" : null}
        type={props.type} placeholder={props.placeholder}/>
        <datalist id={props.identity} className="select-input">
            {props.dataToMap && props.dataToMap.length > 0 && props.dataToMap.map(i => {
                return (<option value={i.name}  
                id={i.id}  key={i.id}>
                {i.name}
                </option>);
            })}
        </datalist>

    </div>
      
);

dataList.defaultProps = {
    type: "text"
}

export default dataList;