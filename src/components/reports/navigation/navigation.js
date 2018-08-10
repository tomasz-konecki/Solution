import React from "react";
import Button from "../../common/button/button";

const pathnames = ["/main/reports", "/main/reports/choose", "/main/reports/onedrive", 
"/main/reports/gdrive"];

const headerTitles = {[pathnames[0]]: "Wybierz drużyny do wygenerowania raportu" ,
[pathnames[1]]:"Wybór dysku do wygenerowania", 
[pathnames[2]]: "Przegląd folderów One Drive", 
[pathnames[3]]: "Przegląd folderów Google Drive"}

const findIndexFromPathnamesWhichIsEqual = pathname => {
  if(pathname.search(pathnames[2]) !== -1)
    return 2;


  for(let i = 0; i < pathnames.length; i++){
    if(pathnames[i] === pathname)
      return i;
  }
  return -1;
}

const navigation = ({addListLength, baseListLength, valueToSearch, searchInTeamList,
  openReportsModals, changeIntoFoldersView, numberOfFolders, 
  changeIntoTeamsView, choosenFolder, pathname }) => {

    const whichCountShouldShow = (pathname === pathnames[0] || pathname === pathnames[1]) ? 
      baseListLength : numberOfFolders;

    const shouldLetGenerateReport = addListLength > 0 ? true : false;

    const isStartView = pathname === pathnames[0] ? true : false;

    const pathnameIndex = findIndexFromPathnamesWhichIsEqual(pathname);
    return (
    <header>
        <h1>
          {headerTitles[pathnames[pathnameIndex]]}
        </h1>
        <nav>
          <div>
            <b>
                <i className="fa fa-users" />
                {addListLength}
            </b>  
            
            <b>
              <i className="fa fa-search" />
              {whichCountShouldShow}
            </b>
          </div>

          <div className="searcher-container">
            {pathname === pathnames[0] &&
              <input
              value={valueToSearch}
              onChange={searchInTeamList}
              type="text"
              placeholder="wpisz nazwę drużyny..."
              />
            }
          </div>

          <div className="btns-container">
            <Button
              disable={!shouldLetGenerateReport}
              title="Generowanie"
              onClick={openReportsModals}
              mainClass="generate-raport-btn gen-changed-position btn-brown"
            >
              <i className="fa fa-id-badge" />
            </Button>

            <Button
              disable={!shouldLetGenerateReport}
              title={isStartView ? "Foldery" : "Teamy"}
              onClick={isStartView ? changeIntoFoldersView : 
              changeIntoTeamsView}
              mainClass="generate-raport-btn btn-green"
            >
              <i
                className={`fa ${!isStartView
                  ? "fa-sitemap"
                  : "fa-folder-open"}`}
              />
            </Button>
          </div>
        </nav>
      </header>
    );
  }
  

export default navigation;
