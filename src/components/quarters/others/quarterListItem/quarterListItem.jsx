import React from 'react'
import './quarterListItem.scss';

const quarterListItem = ({item, clickItemFunction}) => (
    <div className={`single-quarter ${item.isDeleted ? "deleted-quarter" : ""}`} onClick={e => clickItemFunction(e)}>
        <p>
            <i title="Osoba przeprowadzająca rozmowe" className="fa fa-user"></i>
            <span title="Osoba przeprowadzająca rozmowe">{item.questionerId}</span>
            <span className="span-light">{item.isTaken ? "przeprowadził" : "przeprowadzi"}</span>
            <i title="Status rozmowy" className={`fa fa-${item.isTaken ? "check" : "times"}`}></i>
        </p>
        <p>
            <span>
                {item.quarter} kwartał
            </span>
            <span className="span-light" title={item.isTaken ? "Data przeprowadzenia rozmowy" : "Planowana data odbycia rozmowy"}>
                <i className="fa fa-calendar-alt"></i>{item.isTaken ? item.aswerQuestionDate : item.plannedTalkDate}
            </span>
        </p>
        <p>
            <span onClick={e => clickItemFunction(e, "delete")}>Usuń</span>
        </p>
        {item.isDeleted && 
            <div className="backdrop-prompt">
                <p>Ta rozmowa jest usunięta</p>
                <span onClick={e => clickItemFunction(e, "reactivate")}>Reaktywuj</span>
            </div>
        }
        
    </div>
);

export default quarterListItem;