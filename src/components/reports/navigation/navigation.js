import React from "react";
import Button from "../../common/button/button";

const headerTitles = {"none": "Wybierz drużyny do wygenerowania raportu" ,"drive-select":"Wybór dysku do wygenerowania", 
"onedrive": "Przegląd folderów One Drive", "gdrive": "Przegląd folderów Google Drive"}
  
const navigation = ({addListLength, baseListLength, valueToSearch, searchInTeamList,
  openReportsModals, changeIntoFoldersView, choosenDriveType, numberOfFolders, 
  changeIntoTeamsView }) => {

    const whichCountShouldShow = (choosenDriveType === "none" || choosenDriveType === "drive-select") ? 
      baseListLength : numberOfFolders;

    const shouldLetGenerateReport = addListLength > 0 ? true : false;

    const isStartView = choosenDriveType === "none" ? true : false;

    return (
    <header>
        <h1>
          {headerTitles[choosenDriveType]}
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
            {choosenDriveType === "none" &&
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
