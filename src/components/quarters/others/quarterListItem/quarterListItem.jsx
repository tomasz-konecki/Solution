import React from 'react'
import './quarterListItem.scss';
import QuarterDetalilsItem from '../quarterDetailsItem/quarterDetailsItem';

const quarterListItem = ({index, item, clickItemFunction, currentWatchedItemId, subHeader, reactivate, 
    deleteTranslation, conduct, quarter, QuarterDeletedPrompt, isDetailItemFromEmployeeDetails, answers, forQuarter,
    connector, inYear, doneQuarter, incomingQuarter}) => (
    <div className={`single-quarter ${item.isDeleted ? "deleted-quarter" : ""} ${index === currentWatchedItemId ? "current-watched-item" : ""}`} onClick={e => clickItemFunction(e)}>
        <p>
            <i title="Osoba przeprowadzająca rozmowe" className="fa fa-user"></i>
            <span title="Osoba przeprowadzająca rozmowe">{item.questionerId}</span>
            <span className="span-light">{item.isTaken ? subHeader : conduct}</span>
            {item.isTaken && !isDetailItemFromEmployeeDetails &&
                <i title="Pobierz rozmowę w formacie .doc" onClick={e => clickItemFunction(e, "generateDoc")} className="fa fa-file-alt"></i>
            }
            <i title={item.isTaken ? doneQuarter : incomingQuarter} className={`fas fa-${item.isTaken ? "check" : "question"}`}></i>
        </p>
        <p>
            <span>
                 {forQuarter} {item.quarter} {quarter} {item.year} {inYear} <b>{connector}</b> 
            </span>
            <span className="span-light" title={item.isTaken ? "Data przeprowadzenia rozmowy" : "Planowana data odbycia rozmowy"}>
                <i className="fa fa-calendar-alt"></i>{item.isTaken ? item.aswerQuestionDate : item.plannedTalkDate}
            </span>
        </p>
        <p className={(isDetailItemFromEmployeeDetails && index === currentWatchedItemId) ? "border-paragraph" : ""}>
            {isDetailItemFromEmployeeDetails && item.isTaken && 
                <span className="details-span" onClick={e => clickItemFunction(e, "expendDetails")}>
                    <i className={`fa fa-chevron-down ${index === currentWatchedItemId ? "rot-chev" : ""}`}></i>    
                </span>
            }
            {isDetailItemFromEmployeeDetails ||
                <span className="delete-span" onClick={e => clickItemFunction(e, "delete")}>{deleteTranslation}</span>
            }
        </p>
        {isDetailItemFromEmployeeDetails && index === currentWatchedItemId && item.isTaken &&
            answers.length > 0 && answers.map((answer, index) => (
                <QuarterDetalilsItem item={answer} key={index}/>
            ))
        }
        {item.isDeleted && 
            <div className="backdrop-prompt">
                <p>{QuarterDeletedPrompt}</p>
                <span onClick={e => clickItemFunction(e, "reactivate")}>{reactivate}</span>
            </div>
        }
        
    </div>
);
export default quarterListItem;