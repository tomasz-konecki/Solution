import React from "react";
import "./employeeContent.scss";
import FteBar from '../fteBar/fteBar';
import DegreeBar from '../degreeBar/degreeBar';
import Button from '../../../common/button/button';
import Quaters from '../quaters/quaters';
import Spinner from '../../../common/spinner/small-spinner';

const employeeContent = ({employee, editSeniority, employeeErrors, 
  editCapacity, activateEmployee, isChangingEmployeeData, reactivateEmployee, deleteEmployee,
  deleteQuaterStatus, deleteQuaterErrors, deleteQuaterACreator, 
  reactivateQuaterACreator, reactivateQuaterStatus, reactivateQuaterErrors, 
  }) => {

    const status = employee.isDeleted ? "Usunięty" : employee.seniority ? "Aktywny" : "Nieaktywny";
    const email = employee.email ? employee.email : "Brak adresu email";
    return (
  <section className="top-content-container">
    <div className="employee-details-bar">
      <div className="left-content">
        <header>
          <span className={(employee.seniority && !employee.isDeleted) ? "has-acc" : "no-acc"}>
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
          Email: <span>{email}</span>
        </p>
        <p>
          Numer telefonu: <span>{employee.phoneNumber ? employee.phoneNumber : "Nie podano"} </span>
        </p>
        <p>
          Lokalizacja: <span>{employee.localization ? employee.localization : "Nie podano"}</span>
        </p>
        <button>Więcej</button>
      </div>
      

      {(employee.seniority && !employee.isDeleted) && 
        <React.Fragment>
            <FteBar capacityLeft={employee.baseCapacity} 
            editCapacity={editCapacity} employeeErrors={employeeErrors} />
          
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
        
        {status !== "Aktywny" && 
          <div className="information-for-statuses">
            <p>Zanim zmienisz status</p>
            <article>
              Zmiana statusów pracownika polega na przypisaniu mu wymiaru czasu pracy oraz poziomu doświadczenia.
              Pamiętaj, że możesz także zmienić jego status na <b>Usunięty</b> co spowoduje zablokowanie możliwości edycji.
              Zmiana statusu na <b>Aktywny</b> pozwoli na ponowną zmiane danych tego pracownika.
            </article>
          </div>
        }
        
    </div>
    {console.log(status)}
    <Quaters reactivateQuaterACreator={reactivateQuaterACreator}
    status={status}
    reactivateQuaterStatus={reactivateQuaterStatus}
    reactivateQuaterErrors={reactivateQuaterErrors}
    deleteQuaterStatus={deleteQuaterStatus}
    deleteQuaterErrors={deleteQuaterErrors}
    employeeId={employee.id}
    deleteQuaterACreator={deleteQuaterACreator}
    paginationLimit={5} 
    quarterTalks={employee.quarterTalks}/>
    
  </section>
  );
  };

export default employeeContent;
