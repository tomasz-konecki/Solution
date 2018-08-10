import React from "react";
import Modal from "react-responsive-modal";
import StatusPrompt from "../../common/statusPrompt/statusPrompt";
import SpinnerButton from "../../form/spinner-btn/spinner-btn";
import Spinner from "../../common/spinner/spinner";
import RedirectSpinner from "../../common/spinner/redirect-spinner";
import { Link } from 'react-router-dom';

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
  startPathname

}) => {
  const shouldLetGenerate = (addList.length > 0 && choosenFolder !== null) ? true : false;
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
              className={pagesList[index].error ? "inc-list-item" : null}
              key={index}
            >
              <b>{i.name}</b>
              <i
                onClick={() => deleteTeamFromResultList(index)}
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
            <React.Fragment>
              <div className="icon-container">
                <i className="fa fa-folder" />
                <span onClick={() => window.open(choosenFolder.webUrl)}>
                  Otwórz w <i className="fab fa-google-drive" />
                </span>
              </div>
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
            </React.Fragment>
          }
          {!shouldLetGenerate && 
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
            isLoading={isReportGenerating}
            onClickHandler={(!isReportGenerating && !generateReportStatus) ? 
              generateReport : null
              }
            btnTitle="Generuj raport"
          />
        </div>

    </Modal>
  );
};

export default genReport;
