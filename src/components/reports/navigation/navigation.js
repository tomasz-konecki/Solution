import React from "react";
import Button from "../../common/button/button";
import NotFound404 from "../../notFound404/NotFound404";
import { translate } from 'react-translate';
import './navigation.scss';
const pathnames = [
  "/main/reports",
  "/main/reports/choose",
  "/main/reports/onedrive",
  "/main/reports/gdrive"
];

const findIndexFromPathnamesWhichIsEqual = pathname => {
  if (pathname.search(pathnames[2]) !== -1) return 2;

  for (let i = 0; i < pathnames.length; i++) {
    if (pathnames[i] === pathname) return i;
  }
  return -1;
};

const navigation = ({ addListLength, baseListLength, valueToSearch, searchInTeamList, 
  openReportsModals, changeIntoFoldersView, numberOfFolders, 
  changeIntoTeamsView, choosenFolder, pathname, baseList, t
}) => {
  
  const headerTitles = {
    [pathnames[0]]: t("FirstPage"),
    [pathnames[1]]: t("SecondPage"),
    [pathnames[2]]: t("OneDrivePage"),
    [pathnames[3]]: t("GDrivePage")
  };

  const headerNumbers = {
    [pathnames[0]]: t("First"),
    [pathnames[1]]: t("Secondly"),
    [pathnames[2]]: t("LastStepName"),
    [pathnames[3]]: t("LastStepName")
  }

  const whichCountShouldShow =
    pathname === pathnames[0] || pathname === pathnames[1]
      ? baseListLength
      : numberOfFolders;

  const shouldLetGenerateReport = addListLength > 0 ? true : false;

  const isStartView = pathname === pathnames[0] ? true : false;

  const pathnameIndex = findIndexFromPathnamesWhichIsEqual(pathname);

  let content;

  if (pathnames.includes(pathname)) {
    content = (
      <header>
        <h1><i className="fa fa-id-badge"/>{headerTitles[pathnames[pathnameIndex]]} <span>{headerNumbers[pathnames[pathnameIndex]]} {t("StepName")}</span></h1>

        <nav>
          <div className="count-icons-container">
            <span>
              <i className="fa fa-users" />
              <strong>
                {addListLength}
              </strong>
              <b className="add-desc">{t("AddItems")}</b>
            </span>

            <span>
              <i className="fa fa-search" />
              <strong>
                {whichCountShouldShow}
              </strong>
              <b className="found-desc">{t("FoundItems")}</b>
            </span>
          </div>

          {pathname === pathnames[0] && 
            <div className="searcher-container">
              <input
                maxLength={baseList.length === 0 ? valueToSearch.length : null}
                value={valueToSearch}
                onChange={searchInTeamList}
                type="text"
                placeholder={t("SearchTeamPlaceholder")}
              />
              <i className="fa fa-search" />
            </div>
          }
          <div className="btns-container">
            <Button
              disable={!shouldLetGenerateReport}
              title={t("Generate")}
              onClick={openReportsModals}
              mainClass="generate-raport-btn gen-changed-position btn-brown"
            >
              <i className="fa fa-id-badge" />
            </Button>

            <Button
              disable={!shouldLetGenerateReport}
              title={isStartView ? t("Folders") : t("Teams")}
              onClick={
                isStartView ? changeIntoFoldersView : changeIntoTeamsView
              }
              mainClass="generate-raport-btn btn-green"
            >
              <i
                className={`fa ${
                  !isStartView ? "fa-sitemap" : "fa-folder-open"
                }`}
              />
            </Button>
          </div>

        </nav>

      </header>
    );
  } else {
    content = <NotFound404 />;
  }

  return <React.Fragment>{content}</React.Fragment>;
};

export default translate("ReportsNavigation")(navigation);
