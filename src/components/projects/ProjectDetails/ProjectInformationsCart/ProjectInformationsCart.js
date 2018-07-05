import React from 'react'
import './ProjectInformationsCart.scss';
import Aux from '../../../../services/auxilary';
import { contains } from '../../../../services/methods';

const projectInformationsCart = props => {
    return (
    <Aux>
        <h4>{props.headerTitle}</h4>
        <ul className="project-overview">
        {props.items.keys.map((i, index) => {
            return (
                <li key={i}>
                    <span>{props.items.names[index]}: </span>
                    <b>
                       {
                         props.originalObject[i] &&
                         props.dateKeys ?
                         contains(i, props.dateKeys) ? 
                         props.originalObject[i].slice(0, 10) : 

                         props.originalObject[i]
                         : 
                         props.originalObject[i]
                       }
                    </b>
                </li>
            );
        })}
        </ul>
    </Aux>
    );

};

export default projectInformationsCart;

