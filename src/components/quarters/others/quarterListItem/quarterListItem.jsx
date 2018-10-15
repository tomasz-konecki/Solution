import React from 'react'
import './quarterListItem.scss';

const quarterListItem = ({index, item, clickItemFunction, currentWatchedItemId, subHeader, reactivate, 
    deleteTranslation, conduct, quarter, QuarterDeletedPrompt}) => (
    <div className={`single-quarter ${item.isDeleted ? "deleted-quarter" : ""} ${index === currentWatchedItemId ? "current-watched-item" : ""}`} onClick={e => clickItemFunction(e)}>
        <p>
            <i title="Osoba przeprowadzająca rozmowe" className="fa fa-user"></i>
            <span title="Osoba przeprowadzająca rozmowe">{item.questionerId}</span>
            <span className="span-light">{item.isTaken ? subHeader : conduct}</span>
            <i title="Pobierz rozmowę w formacie .doc" onClick={e => clickItemFunction(e, "generateDoc")} className="fa fa-file-alt"></i>
            <i title="Status rozmowy" className={`fa fa-${item.isTaken ? "check" : "times"}`}></i>
        </p>
        <p>
            <span>
                {item.quarter} {quarter}
            </span>
            <span className="span-light" title={item.isTaken ? "Data przeprowadzenia rozmowy" : "Planowana data odbycia rozmowy"}>
                <i className="fa fa-calendar-alt"></i>{item.isTaken ? item.aswerQuestionDate : item.plannedTalkDate}
            </span>
        </p>
        <p>
            <span onClick={e => clickItemFunction(e, "delete")}>{deleteTranslation}</span>
        </p>
        {item.isDeleted && 
            <div className="backdrop-prompt">
                <p>{QuarterDeletedPrompt}</p>
                <span onClick={e => clickItemFunction(e, "reactivate")}>{reactivate}</span>
            </div>
        }
        
    </div>
);
export default quarterListItem;