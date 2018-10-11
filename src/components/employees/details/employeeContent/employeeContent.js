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
import CallSkype from "./callSkype";

const employeeContent = ({
  changeCurrentWatchedUser,
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
  editSkypeId,
  skypeIdAddLoading,
  updateSkypeIdResult,

  getEmployeePromise,
  isYou,
  binPem
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

  const title = `${t("ProfilePhoto")} ${employee.id} `;

  const profilePhoto =
    "http://10.255.20.241/ProfilePhotos/" + employee.id + ".jpg";
  const imgContent = employee.profilePhoto ? (
    <img alt={title} title={title} src={profilePhoto} />
  ) : (
    <figure>
      <i className="fa fa-user" />
    </figure>
  );
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
              {imgContent}
              <p>{employee.roles ? employee.roles[0] : t("RoleMissing")}</p>
            </div>
            <div className="text-center" style={{ width: "100%" }}>
              <h2> {employee.firstName + " " + employee.lastName + " "}</h2>
              <CallSkype
                editSkypeFormItems={editSkypeFormItems}
                employee={employee}
                editSkypeId={editSkypeId}
                skypeIdAddLoading={skypeIdAddLoading}
                updateSkypeIdResult={updateSkypeIdResult}
                t={t}
                canEditSkypeId={isYou || binPem >= 32}
              />
            </div>
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
          <div className="managerHierarchy">
            {(employee.manager || employee.managersManager) && (
              <h2>{t("Superiors")}</h2>
            )}
            {employee.managersManager && (
              <React.Fragment>
                {employee.managersManager.fullName}
                <Icon icon="angle-down" />
              </React.Fragment>
            )}
            {employee.manager && (
              <React.Fragment>
                {employee.manager.fullName}
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
                canEditFteBar={binPem > 1}
              />

              <div className="degree-bar-container">
                <DegreeBar
                  editSeniority={editSeniority}
                  seniority={employee.seniority}
                  employeeErrors={employeeErrors}
                  range={4}
                  canEditDegreeBar={binPem > 1}
                />
              </div>
            </React.Fragment>
          )}

        {binPem === 32 && (
          <React.Fragment>
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
                    status === t("Deleted")
                      ? reactivateEmployee
                      : activateEmployee
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
                <article>{t("BeforeYouChangeStatusContent")}</article>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
      <Quaters
        changeCurrentWatchedUser={changeCurrentWatchedUser}
        getEmployeePromise={getEmployeePromise}
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
