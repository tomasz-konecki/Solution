import React from 'react';
import './contactList.scss';

const contactList = props => (
    <section className="contact-list-container">
        <label>Osoba odpowiedzialna</label>
        <select value={props.selected} onChange={props.onChange} className="contact-list">
            <optgroup label="Dane kontaktowe">
                {props.items.map(i => {
                    return <option className="option" value={i.firstName} key={i.id}>{i.firstName}</option>
                })}

            </optgroup>
        </select>
    </section>
);

export default contactList;
