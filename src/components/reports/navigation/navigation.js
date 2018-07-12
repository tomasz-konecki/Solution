import React from "react";
import Button from "../../common/button/button";
const navigation = ({
  addListLength,
  baseListLength,
  valueToSearch,
  searchInTeamList,
  openReportsModals,
  changeIntoFoldersView,
  showGDriveFolders,
  numberOfFolders
}) => (
  <header>
    <h1>
      {showGDriveFolders
        ? "Przeglądów folderów One Drive"
        : "Generowanie raportów"}
    </h1>
    <nav>
      <div>
        <b>
            <i className="fa fa-users" />
            {addListLength}
        </b>  
        
        <b>
          <i className="fa fa-search" />
          {showGDriveFolders ? numberOfFolders : baseListLength}
        </b>
      </div>

      <div className="searcher-container">
        {showGDriveFolders || 
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
          disable={addListLength > 0 ? false : true}
          title="Generuj raport"
          onClick={openReportsModals}
          mainClass="generate-raport-btn gen-changed-position btn-brown"
        >
          <i className="fa fa-id-badge" />
        </Button>

        <Button
          disable={false}
          title={showGDriveFolders ? "Teamy" : "Foldery"}
          onClick={changeIntoFoldersView}
          mainClass="generate-raport-btn btn-green"
        >
          <i
            className={`fa ${showGDriveFolders
              ? "fa-sitemap"
              : "fa-folder-open"}`}
          />
        </Button>
      </div>
    </nav>
  </header>
);
export default navigation;
