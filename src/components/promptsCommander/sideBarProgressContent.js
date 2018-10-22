import React from "react";
import { translate } from "react-translate";
import { Link } from "react-router-dom";

const sideProgressBar = ({
  currentDeletedElements,
  currentReadElements,
  shouldShowGlobal,
  createClassesForLoader,
  percentage,
  message,
  generateReportStatus,
  isStarted,
  operationName,
  generateReportErrors,
  togleSideBarHandler,
  oneDriveLoginStatus,
  gDriveLoginStatus,
  notifications,
  t,
  language,
  handleDelete,
  handleMarkAsRead,
  handleDeleteAll,
  handleMarkAllAsRead,
  numberOfNotifications,
  deleteAllSpin,
  readAllSpin,
  changeCurrentWatchedUserHandler,
  putIconInOtherPlace,
  isNotificationIconInSideBar
}) => {
  const menuClass = shouldShowGlobal ? "menu-expanded" : "menu-collapsed";
  const btnClass = shouldShowGlobal ? "btn-expanded" : "btn-collapsed";
  const didLocationIsOnGDrive =
    window.location.href.search("gdrive") !== -1 ? true : false;
  const day = 86400000;

  const btnBorderClass = isStarted ? createClassesForLoader(percentage) : null;

  const btnResultClass = generateReportStatus
    ? "btn-finalized"
    : generateReportStatus === false
      ? "btn-op-failed"
      : null;

  const btnIcon = generateReportStatus
    ? "fa-check"
    : generateReportStatus === false
      ? "fa-times"
      : "fa-bell";

  const notificationDate = date => {
    const timeStamp = new Date().getTime() - Date.parse(date);
    var ago;
    if (timeStamp < day / 24) {
      ago = parseInt(Math.floor(timeStamp / 1000 / 60));
      if (ago < 2) ago = `${t("OneMinute")} ${t("Ago")}`;
      else if (
        (ago > 20 || ago < 5) &&
        [2, 3, 4].includes(
          Number(
            ago
              .toString()
              .split("")
              .pop()
          )
        )
      )
        ago += ` ${t("Minutes")} ${t("Ago")}`;
      else ago += ` ${t("MinutesPl")} ${t("Ago")}`;
    } else if (timeStamp < day) {
      ago = parseInt(Math.floor(timeStamp / 1000 / 60 / 60));
      if (ago === 1) ago += ` ${t("Hour")} ${t("Ago")}`;
      else if ([2, 3, 4, 22, 23].includes(ago))
        ago += ` ${t("Hours")} ${t("Ago")}`;
      else ago += ` ${t("HoursPl")} ${t("Ago")}`;
    } else if (timeStamp >= day && timeStamp < day * 30) {
      ago = parseInt(Math.floor(timeStamp / 1000 / 60 / 60 / 24));
      if (ago === 1) ago += ` ${t("Day")} ${t("Ago")}`;
      else ago += ` ${t("Days")} ${t("Ago")}`;
    } else if (timeStamp >= day * 30 && timeStamp < day * 30 * 12) {
      ago = parseInt(Math.floor(timeStamp / 1000 / 60 / 60 / 24 / 30));
      if (ago === 1) ago = `${t("Month")} ${t("Ago")}`;
      else if (ago >= 5) ago += `${t("Months")} ${t("Ago")}`;
      else ago += ` ${t("MonthsPl")} ${t("Ago")}`;
    } else if (timeStamp >= day * 30 * 12) {
      ago = parseInt(Math.floor(timeStamp / 1000 / 60 / 60 / 24 / 30 / 12));
      if (ago === 1) ago = `${t("Year")} ${t("Ago")}`;
      else ago += ` ${t("Years")} ${t("Ago")}`;
    }

    return <p>{ago}</p>;
  };

  const generateRedirectLink = (notification) => {
    switch(notification.redirectTo){
      case "Projects":
      {
        return "/main/projects/" + notification.redirectId;
      }
      case "QuarterTalk":
      {
        return {
          pathname: "/main/quarters/employees/" + notification.userId + "?=" + notification.userId,
          state: { quarterTalkId: notification.redirectId, employeeId: notification.userId }
        }
      }
      default:
      {
        return null;
      }
    }

  }
  
  const notificationContent = notification => {
    const redirectLink = generateRedirectLink(notification);

    return (
      <React.Fragment>
        <div className="container row">
          <div className="col-2 col-sm-3">
            <i
              className={`fa fa-trash-alt deleteNotificationBtn ${
                currentDeletedElements.includes(notification.id)
                  ? "spinAnimation"
                  : ""
              }`}
              onClick={() => handleDelete(notification.id)}
            />
            {notification.isRead ? (
              <i className="far fa-envelope-open" />
            ) : (
                <i
                  className={`fa fa-envelope 
                  ${currentReadElements.includes(notification.id)
                      ? "spinAnimation"
                      : ""
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                  style={{ cursor: "pointer" }}
                />
            )}
          </div>
          <div 
          onClick={() => changeCurrentWatchedUserHandler(notification)}
          className="not-content col-10 col-sm-9">
            <div 
            className={`${redirectLink === null ? "noRedirect" : "redirect"} 
            ${notification.isRead ? "" : "pointer"}`} 
            onClick={notification.isRead ? null : () => handleMarkAsRead(notification.id, false)}>
            
              <span className={`${notification.isRead ? "" : "font-weight-bold"}`}>
                {language === "pl"
                  ? notification.contentPl
                  : notification.contentEng}
              </span>
              {notificationDate(notification.date)}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div className={`comunicates-window ${menuClass}`}>
        <header>
          <span>{t("Notifications")}</span>
          <span>
            <i onClick={putIconInOtherPlace} title={t("Tack")} className="fa fa-thumbtack" />
            <i className="cor-status">emp</i>
            <i
              className={`fab fa-windows ${
                oneDriveLoginStatus ? "cor-status" : "err-status"
              }`}
            />
            <i
              className={`fab fa-google-drive ${
                gDriveLoginStatus && didLocationIsOnGDrive
                  ? "cor-status"
                  : "err-status"
              }`}
            />
          </span>
        </header>
        <ul className="notifictions">
          {notifications.length !== 0 ? (notifications.map(notification => {
              return (
                <li 
                key={notification.id}
                style={notification.isRead ? {} : { backgroundColor: "#e8e8e8" }}
                >
                  {notificationContent(notification)}
                </li>
              );
            })
          ) : (
            <p className="noNotificationsMessage" align="center">
              {t("NoNotifications")}
            </p>
          )}
        </ul>
        {notifications.length !== 0 ? (
          <footer>
            <button
              type="button"
              className={`read-all-btn ${
                notifications.filter(x => x.isRead === false).length > 0
                  ? ""
                  : "button-disabled"
              }`}
              onClick={() => handleMarkAllAsRead()}
            >
              {t("MarkAllAsRead")}{" "}
              <i
                className={`fa fa-envelope-open ${
                  readAllSpin ? "spinAnimation" : ""
                }`}
              />
            </button>
            <button
              className="delete-all-btn"
              onClick={() => handleDeleteAll()}
            >
              {t("DeleteAll")}{" "}
              <i
                className={`fa fa-trash-alt ${
                  deleteAllSpin ? "spinAnimation" : ""
                }`}
              />
            </button>
          </footer>
        ) : (
          <div />
        )}
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

      <button onClick={togleSideBarHandler} style={{display: (isNotificationIconInSideBar && !shouldShowGlobal) ? "none" : "block"}}
        title="Komunikaty"
        className={`comunicates-btn ${btnResultClass} ${btnClass} ${btnBorderClass}`}
      >
        <i className={`fa ${btnIcon}`} />
        <div />
        {notifications.filter(x => x.isRead === false).length > 0 ? (
          <div className="comunicates-number">
            {notifications.filter(x => x.isRead === false).length}
          </div>
        ) : (
          <div />
        )}
      </button>
    </React.Fragment>
  );
};

export default translate("SideProgressBar")(sideProgressBar);
