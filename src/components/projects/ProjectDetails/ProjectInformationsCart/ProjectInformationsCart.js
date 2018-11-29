import React from 'react'
import './ProjectInformationsCart.scss';
import Aux from '../../../../services/auxilary';
import { contains } from '../../../../services/methods';

const projectInformationsCart = props => {
    const { t } = props;
    return (
    <Aux>
        <h4>{props.headerTitle}</h4>
        <ul className="project-overview">
        {props.items.keys.map((i, index) => {
            var field = props.originalObject[i];
            if(field !== null && typeof(field) === "string")
            {
                if(field === "Do uzupełnienia") field = t("ToFill")
                else if(field === "do@uzupelnienia.pl") field = t("ToFillEmail")
                else if(field.includes("Do uzupelnienia") || field.includes("do@uzupelnienia.pl"))
                    field = ""
            }
            return (
                <li key={i}>
                    {
                        field && props.items.names[index] &&
                        <span>{t(props.items.names[index])}: </span>
                    }

                    {field && 

                    <b>
                       { 
                         (props.dateKeys &&
                         contains(i, props.dateKeys) ? 
                         field.slice(0, 10) : 
                         field)
                       }
                    </b>
                    }
                    
                </li>
            );
        })}
        </ul>
    </Aux>
    );

};

export default projectInformationsCart;

