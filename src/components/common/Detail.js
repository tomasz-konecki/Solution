import React from "react";
import "../../scss/components/common/Detail.scss";


const Detail = details => {
  return (
    <div className="form-group row">
      <label className="col-sm-3 col-form-label">{details.pretty}</label>

      {details.editable === true && details.type === "textarea" ? (
        <div className="col-sm-9">
          <textarea
            rows={details.rows}
            cols={details.cols}
            resize="none"
            className="form-control"
            name={details.name}
            value={details.value || ""}
            onChange={details.handleChange}
          />
        </div>
      ) : details.editable === true ? (
        <div className="col-sm-9">
        <input
            onBlur={details.goForClient}
            list={details.forList ? "exampleList" : null}
            type={details.type}
            className="form-control"
            name={details.name}
            value={details.value || ""}
            placeholder={details.value}
            required={details.required}
            onChange={details.handleChange}
          />

          {details.autoCorrect ?
            details.clientsWhichMatch && 
          details.clientsWhichMatch.length > 0 ? 

          <datalist id="exampleList" className="select-input">
              {details.clientsWhichMatch.map(i => {
                return (<option value={i.name}  
                id={i.id}  key={i.id}>
                  {i.name}
                </option>);
              })}
          </datalist> : null : null}

          

          
        </div>
      ) : (
        <div className="col-sm-9">
          <span>{details.value}</span>
        </div>
      )}

    
     
    </div>
  );
};

export default Detail;
