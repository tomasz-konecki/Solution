import React from "react";
import { translate } from 'react-translate';

const sideProgressBar = ({ items, shouldShowGlobal, createClassesForLoader, percentage, message,
    generateReportStatus, isStarted, operationName, generateReportErrors, togleSideBarHandler, oneDriveLoginStatus,
    gDriveLoginStatus, t }) => {

  const menuClass = shouldShowGlobal ? "menu-expanded" : "menu-collapsed";
  const btnClass = shouldShowGlobal ? "btn-expanded" : "btn-collapsed";
  const didLocationIsOnGDrive = window.location.href.search("gdrive") !== -1 ? true : false;

  const btnBorderClass = isStarted
    ? createClassesForLoader(percentage)
    : null;

  const btnResultClass = generateReportStatus
    ? "btn-finalized"
    : generateReportStatus === false ? "btn-op-failed" : null;

  const btnIcon = generateReportStatus
    ? "fa-check"
    : generateReportStatus === false ? "fa-times" : "fa-bell";
  return (
    <React.Fragment>
      <div className={`comunicates-window ${menuClass}`}>
        <header>
          <span>{t("Notifications")}</span>
          <span>
            <i className="cor-status">emp</i>
            <i className={`fab fa-windows ${oneDriveLoginStatus ? "cor-status" : "err-status"}`}></i>
            <i className={`fab fa-google-drive ${(gDriveLoginStatus && didLocationIsOnGDrive) ? "cor-status" : "err-status"}`}></i>
          </span>
        </header>
        <ul className="notifictions">
          {items.map(i => {
            return (
              <li key={i.name}>
                <i className={`fa ${i.isShowed ? "fa-check" : "fa-times"}`} />
                <div className="not-content">
                  <b>{i.name}</b> {i.content}
                  <p>
                    {i.date} <b>1000 dni temu</b>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <footer>
          <button className="showed-btn">
            {t("Read")} <i className="fa fa-check" />
          </button>
          <button className="not-showed-btn">
            {t("Unread")} <i className="fa fa-times" />
          </button>
        </footer>
        <div className="operations-messages">
          {isStarted &&
            shouldShowGlobal && (
              <article>
                {operationName} {percentage}%<b> {message}</b>
              </article>
            )}
          {generateReportStatus !== null && (
            <p className={generateReportStatus ? "status-ok" : "status-off"}>
              {generateReportStatus
                ? t("SuccessFullyGeneratedReport")
                : generateReportErrors[0]}
            </p>
          )}
        </div>
      </div>

      <button
        title="Komunikaty"
        onClick={togleSideBarHandler}
        className={`comunicates-btn ${btnResultClass} ${btnClass} ${btnBorderClass}`}
      >
        <i className={`fa ${btnIcon}`} />
        <div />
      </button>
    </React.Fragment>
  );
};

export default (translate("SideProgressBar")(sideProgressBar));
