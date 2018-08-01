import React from "react";
import "./employeeContent.scss";
import FteBar from '../fteBar/fteBar';
import DegreeBar from '../degreeBar/degreeBar';
import Button from '../../../common/button/button';
import Quaters from '../quaters/quaters';
import Spinner from '../../../common/spinner/small-spinner';
const employeeContent = ({employee, editSeniority, employeeErrors, 
  editCapacity, activateEmployee, isChangingEmployeeData, reactivateEmployee, deleteEmployee}) => {

    const status = employee.isDeleted ? "Usunięty" : employee.hasAccount ? "Aktywny" : "Nieaktywny";

    return (
  <section className="top-content-container">
    <div className="employee-details-bar">
      <div className="left-content">
        <header>
          <span className={(employee.hasAccount && !employee.isDeleted) ? "has-acc" : "no-acc"}>
            {status}
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
        <button>Więcej</button>
      </div>
      

      {(employee.hasAccount && !employee.isDeleted) && 
        <React.Fragment>
          <div className="fte-bar-container">
            <FteBar capacityLeft={employee.baseCapacity} 
            editCapacity={editCapacity} employeeErrors={employeeErrors} />
          
          </div>
          <div className="degree-bar-container">
          <DegreeBar
              editSeniority={editSeniority}
              seniority={employee.seniority}
              employeeErrors={employeeErrors}
              range={4}
            />
          </div>
        </React.Fragment> 
      }

        <div className="emp-btns-container">
          {
            status === "Aktywny" ?
            <Button mainClass="option-btn option-very-dang" title="Usuń" disable={isChangingEmployeeData} onClick={deleteEmployee}>
              {isChangingEmployeeData && <Spinner /> } 
            </Button> :

            <Button disable={isChangingEmployeeData} onClick={status === "Usunięty" ? 
              reactivateEmployee : activateEmployee} 
            title="Aktywuj" mainClass="option-btn green-btn">
              {isChangingEmployeeData && <Spinner /> } 
            </Button> 
          }
        </div>
        
        {status === "Nieaktywny" && 
          <div className="information-for-statuses">
            <p>Zanim zmienisz status</p>
            <article>
              Zmiana statusów pracownika polega na przypisaniu mu wymiaru czasu pracy oraz poziomu doświadczenia.
              Pamiętaj, że możesz także zmienić jego status na <b>Usunięty</b> co spowoduje wymazanie dotychczasowych ustawień.
            </article>
          </div>
        }
        
    </div>
    <Quaters paginationLimit={5} quarterTalks={employee.quarterTalks}/>
    
  </section>
  );
  };

export default employeeContent;
