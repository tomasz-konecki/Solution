import React from "react";
import Modal from "react-responsive-modal";
import StatusPrompt from "../../common/statusPrompt/statusPrompt";
import SpinnerButton from "../../form/spinner-btn/spinner-btn";
import Spinner from "../../common/spinner/spinner";
import RedirectSpinner from "../../common/spinner/redirect-spinner";
import { Link } from 'react-router-dom';
import PromptsCommander from '../../promptsCommander/promptsCommander';
import DatePicker from "react-datepicker";

const genReport = ({
  shouldOpenModal,
  closeModal,
  addList,
  pagesList,
  deleteTeamFromResultList,
  onChangeReportPages,
  didPagesHasIncorrectValues,
  choosenFolder,
  generateReport,
  isReportGenerating,
  generateReportStatus,
  generateReportErrors,
  startPathname,
  currentPath,
  isStarted,
  addToFavorites,
  handleAvailableUntilToggle,
  handleAvailableUntil,
  availableUntilDate,
  availableUntilStartDate
}) => {
  const isUrlDifferentFromFoldersUrl = (currentPath.search("onedrive") === -1 && currentPath.search("gdrive")) === -1;
  const shouldLetGenerate = (addList.length > 0 && !isUrlDifferentFromFoldersUrl) ? true : false;
  
  return (
    <Modal
      key={1}
      open={shouldOpenModal}
      classNames={{ modal: "Modal Modal-report-modal" }}
      contentLabel="Generate report modal"
      onClose={closeModal}
    >
      <h3>Wybierz numery stron dla poszczególnych raportów</h3>
      <ul className="reports-items-list">
        {addList.map((i, index) => {
          return (
            <li
              className={pagesList !== undefined ? pagesList[index].error ? "inc-list-item" : "" : ""}
              key={index}
            >
              <label>{i.name} <b><i className="fa fa-users"></i>{i.numberOfMemberInDB}</b></label>
              <i
                onClick={!isStarted ? () => deleteTeamFromResultList(index) : null}
                className="fa fa-minus"
              />
              <input
                value={pagesList[index].value}
                type="text"
                id={index}
                onChange={onChangeReportPages}
              />
            </li>
          );
        })}
      </ul>
     
   
        <div className="choosen-folder-content">
              {choosenFolder && 
                <div className="icon-container">
                  <i className="fa fa-folder" />
                  <span onClick={() => window.open(choosenFolder.webUrl)}>
                    Otwórz w 
                    <i className={`fab ${currentPath.search(startPathname+"/onedrive") !== -1 ?
                      "fa-windows" : "fa-google-drive"}`}></i>
                  </span>
                </div>
              }
              {choosenFolder && 
                <article className="folder-details">
                  {choosenFolder.id && (
                    <p>
                      <span>Identyfikator: </span>
                      <b>{choosenFolder.id}</b>
                    </p>
                  )}
                  {choosenFolder.name && (
                    <p>
                      <span>Nazwa: </span>
                      <b>{choosenFolder.name}</b>
                    </p>
                  )}
                  {choosenFolder.createDateTime && (
                    <p>
                      <span>Data utworzenia: </span>
                      <b>{choosenFolder.createDateTime}</b>
                    </p>
                  )}
                  {choosenFolder.parentPath && (
                    <p>
                      <span>Ścieżka: </span>
                      <b>{choosenFolder.parentPath}</b>
                    </p>
                  )}
                </article>
              }
            
              {isUrlDifferentFromFoldersUrl && 
              <article className="gen-report-not-able-to-gen-prompt">
                Aby wygenerować raport musisz wybrać folder docelowy. Folder docelowy znajdziesz na jednym z dysków
                umieszczonych w GoogleDrive lub OneDrive.
                <Link onClick={closeModal} to={startPathname + "/choose"}>Kliknij tutaj</Link>, aby przejść do zakładki szybciej.
              </article>
              }
          <SpinnerButton
            validationResult={shouldLetGenerate}
            submitResult={{
              status: generateReportStatus,
              content: generateReportStatus
                ? "Pomyślnie wygenerowano raport"
                : generateReportErrors[0]
            }}
            isLoading={isReportGenerating || isStarted}
            onClickHandler={(!isReportGenerating && !generateReportStatus && !isStarted) ? 
              generateReport : null
              }
            btnTitle="Generuj raport"
          />
        {shouldLetGenerate &&
          <div className="availableUntil">
            <input type="checkbox" id="availableUntilCheckbox" onChange={handleAvailableUntilToggle}/>
            <label htmlFor="availableUntilCheckbox">Tylko pracownicy dostępni w dniu:</label>
            <DatePicker 
              startDate={availableUntilStartDate}
              minDate={availableUntilStartDate}
              selected={availableUntilDate}
              onChange={handleAvailableUntil}
              locale="pl"
              dateFormat="DD/MM/YYYY"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              />
          </div>}
        {shouldLetGenerate &&
        <React.Fragment>
          <input type="checkbox" id="saveAsFavoriteCheckbox" onChange={addToFavorites}/>
          <label htmlFor="saveAsFavoriteCheckbox">Dodaj ten raport do ulubionych</label>
        </React.Fragment>
        }
        </div>
        {isStarted && 
          <PromptsCommander barType="small-progress" />
        }
    </Modal>
  );
};

export default genReport;
