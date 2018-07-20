import React from "react";
import Modal from "react-responsive-modal";
import StatusPrompt from "../../common/statusPrompt/statusPrompt";
import SpinnerButton from "../../form/spinner-btn/spinner-btn";
import Spinner from '../../common/spinner/spinner';
import RedirectSpinner from '../../common/spinner/redirect-spinner';
const genReport = ( {shouldOpenModal, closeModal, addList, pagesList, 
  deleteTeamFromResultList, onChangeReportPages, didPagesHasIncorrectValues,
  choosenFolder, generateReport, isReportGenerating, generateReportStatus, generateReportErrors }) => {
console.log(generateReportStatus);
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

      {choosenFolder && (
        <div className="choosen-folder-content">
          <div className="icon-container">
            <i className="fa fa-folder" />
            <span onClick={() => window.open(choosenFolder.webUrl)}>
              Otwórz w <i className="fab fa-google-drive" />
            </span>
          </div>
          <article className="folder-details">
            <p>
              <span>Identyfikator: </span>
              <b>{choosenFolder.id}</b>
            </p>
            <p>
              <span>Nazwa: </span>
              <b>{choosenFolder.name}</b>
            </p>
            <p>
              <span>Data utworzenia: </span>
              <b>{choosenFolder.createDateTime}</b>
            </p>
            <p>
              <span>Ścieżka: </span>
              <b>{choosenFolder.parentPath}</b>
            </p>
          </article>


          <SpinnerButton 
          submitResult={
            {
              content: generateReportStatus ? "Pomyślnie wygenerowano raport" : 
              generateReportErrors[0],
              status: generateReportStatus
            }
          }
          isLoading={isReportGenerating}
          onClickHandler={generateReport}
          btnTitle="Generuj raport" />


        </div>
      )}
    </Modal>
  );
};

export default genReport;
