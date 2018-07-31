import React from "react";
import "./employeeContent.scss";
import FteBar from '../fteBar/fteBar';
import DegreeBar from '../degreeBar/degreeBar';
import Button from '../../../common/button/button';

const employeeContent = ({employee}) => (
  <section className="top-content-container">
    <div className="employee-details-bar">
      <div className="left-content">
        <header>
          <span className={(employee.hasAccount && !employee.isDeleted) ? "has-acc" : "no-acc"}>
            {(employee.hasAccount && !employee.isDeleted) ? "Aktywny" : "Nieaktywny"}
          </span>
          <div className="icon-container">
            <figure>
              <i className="fa fa-user" />
            </figure>
            <p>{employee.roles ? employee.roles[0] : "Brak roli"}</p>
          </div>
          <h2> {employee.firstName + " " + employee.lastName} </h2>
        </header>

        <div className="seniority">{employee.seniority ? employee.seniority : "Brak stopnia"}</div>
        <p>{employee.title}</p>
      </div>

      <div className="right-content">
        <h2>Kontakt</h2>
        <p>
          Email: <span>{employee.email ? employee.email : "Brak adresu email"}</span>
        </p>
        <p>
          Numer telefonu: <span>{employee.phoneNumber ? employee.phoneNumber : "Nie podano"} </span>
        </p>
        <p>
          Lokalizacja: <span>{employee.localization ? employee.localization : "Nie podano"}</span>
        </p>
        <button>Zmień</button>
      </div>
      <div className="fte-bar-container">
        <FteBar capacityLeft={employee.capacityLeft} />
        
      </div>

      <div className="degree-bar-container">
        <DegreeBar
            seniority={employee.seniority}
            range={4}
          />
      </div>

      <Button title="Edytuj" mainClass="option-btn normal-btn" />

    </div>

    <div className="quaters-container">
      <h2>Rozmowy kwartalne</h2>
      <ul>
        <li><span>Rozmowa w sprawie pracy</span>19-12-1994</li>
        <li><span>Rozmowa w sprawie pracy</span>19-12-1994</li>
        <li><span>Rozmowa w sprawie pracy</span>19-12-1994</li>
        <li><span>Rozmowa w sprawie pracy</span>19-12-1994</li>
        <li><span>Rozmowa w sprawie pracy</span>19-12-1994</li>
        <li><span>Rozmowa w sprawie pracy</span>19-12-1994</li>
        <li><span>Rozmowa w sprawie pracy</span>19-12-1994</li>
        <li><span>Rozmowa w sprawie pracy</span>19-12-1994</li>
        <li><span>Rozmowa w sprawie pracy</span>19-12-1994</li>
        <li><span>Rozmowa w sprawie pracy</span>19-12-1994</li>
      </ul>
      <Button title="Dodaj" mainClass="option-btn normal-btn" />
      
    </div>
  </section>
);

export default employeeContent;
