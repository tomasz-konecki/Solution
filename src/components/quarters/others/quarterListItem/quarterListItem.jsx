import React from 'react'
import './quarterListItem.scss';

const quarterListItem = ({item, clickItemFunction}) => (
    <div className="single-quarter" onClick={clickItemFunction}>
        <p>
            <i title="Osoba przeprowadzająca rozmowe" className="fa fa-user"></i>
            <span>{item.questionerId}</span>

            {item.isTaken ?
                <span className="span-light" title="Data odbycia rozmowy">{item.quarterTalkDate}</span> :
                <span title="Zaplanowana data rozmowy">{item.plannedTalkDate}</span>
            }

           
            <i title="Status rozmowy" className={`fa fa-${item.isTaken ? "check" : "times"}`}></i>
        </p>
    </div>
);

export default quarterListItem;