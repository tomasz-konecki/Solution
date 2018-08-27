import React from "react";
import "./employeeContent.scss";
import FteBar from "../fteBar/fteBar";
import DegreeBar from "../degreeBar/degreeBar";
import Button from "../../../common/button/button";
import Quaters from "../quaters/quaters";
import Spinner from "../../../common/spinner/small-spinner";
import Icon from "../../../common/Icon";
import { Link } from "react-router-dom";
import Form from "../../../form/form";

const employeeContent = ({
  employee,
  editSeniority,
  employeeErrors,
  editCapacity,
  activateEmployee,
  isChangingEmployeeData,
  reactivateEmployee,
  deleteEmployee,
  deleteQuaterStatus,
  deleteQuaterErrors,
  deleteQuaterACreator,
  reactivateQuaterACreator,
  reactivateQuaterStatus,
  reactivateQuaterErrors,
  t,
  editSkypeFormItems,
  editSkypeId
}) => {
  const status = employee.isDeleted
    ? t("Deleted")
    : employee.seniority
      ? t("Active")
      : t("NotActive");
  const email = employee.email ? (
    <a href={"mailto:" + employee.email}>{employee.email}</a>
  ) : (
    t("EmailMissing")
  );
  const employeeLink = "/main/employees/";

  return (
    <section className="top-content-container">
      <div className="employee-details-bar">
        <div className="left-content">
          <header>
            <span
              className={
                employee.seniority && !employee.isDeleted ? "has-acc" : "no-acc"
              }
            >
              {status}
            </span>
            <div className="icon-container">
              <figure>
                <i className="fa fa-user" />
              </figure>
              <p>{employee.roles ? employee.roles[0] : t("RoleMissing")}</p>
            </div>
            <h2> {employee.firstName + " " + employee.lastName} </h2>
          </header>

          <div className="seniority">
            {employee.seniority ? employee.seniority : t("NoLevel")}
          </div>
          <p>{employee.title}</p>
        </div>

        <div className="right-content">
          <h2>{t("Details")}</h2>
          {email && (
            <p>
              Email: <span>{email}</span>
            </p>
          )}
          {employee.phoneNumber && (
            <p>
              {t("Phone")}:<span>{employee.phoneNumber}</span>
            </p>
          )}
          {employee.localization && (
            <p>
              {t("Localization")}:<span>{employee.localization}</span>
            </p>
          )}
          {employee.skypeId && (
            <a
              title={`${t("CallSkype")} ${employee.skypeId}`}
              className="skype"
              href={"skype:" + employee.skypeId + "?add"}
            >
              <Icon icon="skype" iconType="fab" />
            </a>
          )}
          <div className="managerHierarchy">
            {(employee.manager || employee.managersManager) && (
              <h2>{t("Superiors")}</h2>
            )}
            {employee.managersManager && (
              <React.Fragment>
                <Link to={employeeLink + employee.managersManager.id}>
                  {employee.managersManager.fullName}
                </Link>
                <Icon icon="angle-down" />
              </React.Fragment>
            )}
            {employee.manager && (
              <React.Fragment>
                <Link to={employeeLink + employee.manager.id}>
                  {employee.manager.fullName}
                </Link>
                <Icon icon="angle-down" />
              </React.Fragment>
            )}
            {(employee.manager || employee.managersManager) && (
              <div>{`${employee.firstName} ${employee.lastName}`}</div>
            )}
          </div>
        </div>

        {employee.seniority &&
          !employee.isDeleted && (
            <React.Fragment>
              <FteBar
                capacityLeft={employee.baseCapacity}
                editCapacity={editCapacity}
                employeeErrors={employeeErrors}
              />

              <div className="degree-bar-container">
                <DegreeBar
                  editSeniority={editSeniority}
                  seniority={employee.seniority}
                  employeeErrors={employeeErrors}
                  range={4}
                />
              </div>

              <div className="edit-skypeid-form">
                <Form
                  onSubmit={editSkypeId}
                  formItems={editSkypeFormItems}
                  btnTitle={t("Save")}
                />
              </div>
            </React.Fragment>
          )}

        <div className="emp-btns-container">
          {status === t("Active") ? (
            <Button
              mainClass="option-btn option-very-dang"
              title={t("Delete")}
              disable={isChangingEmployeeData}
              onClick={deleteEmployee}
            >
              {isChangingEmployeeData && <Spinner />}
            </Button>
          ) : (
            <Button
              disable={isChangingEmployeeData}
              onClick={
                status === t("Deleted") ? reactivateEmployee : activateEmployee
              }
              title={t("Activate")}
              mainClass="option-btn green-btn"
            >
              {isChangingEmployeeData && <Spinner />}
            </Button>
          )}
        </div>

        {status !== t("Active") && (
          <div className="information-for-statuses">
            <p>{t("BeforeYouChangeStatus")}</p>
            <article>
              Zmiana statusów pracownika polega na przypisaniu mu wymiaru czasu
              pracy oraz poziomu doświadczenia. Pamiętaj, że możesz także
              zmienić jego status na <b>Usunięty</b> co spowoduje zablokowanie
              możliwości edycji. Zmiana statusu na <b>Aktywny</b> pozwoli na
              ponowną zmiane danych tego pracownika.
            </article>
          </div>
        )}
      </div>
      <Quaters
        reactivateQuaterACreator={reactivateQuaterACreator}
        status={status}
        reactivateQuaterStatus={reactivateQuaterStatus}
        reactivateQuaterErrors={reactivateQuaterErrors}
        deleteQuaterStatus={deleteQuaterStatus}
        deleteQuaterErrors={deleteQuaterErrors}
        employeeId={employee.id}
        deleteQuaterACreator={deleteQuaterACreator}
        paginationLimit={5}
        quarterTalks={employee.quarterTalks}
      />
    </section>
  );
};

export default employeeContent;
