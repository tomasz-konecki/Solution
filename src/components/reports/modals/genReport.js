import React from "react";
import Modal from "react-responsive-modal";
import StatusPrompt from "../../common/statusPrompt/statusPrompt";
import Button from "../../common/button/button";
import SpinnerButton from "../../form/spinner-btn/spinner-btn";

const genReport = props => {
  return (
    <Modal
      key={1}
      open={props.shouldOpenModal}
      classNames={{ modal: "Modal Modal-report-modal" }}
      contentLabel="Generate report modal"
      onClose={props.closeModal}
    >
      <h3>Wybierz numery stron dla poszczególnych raportów</h3>
      <ul className="reports-items-list">
        {props.addList.map((i, index) => {
          return (
            <li
              className={
                props.pagesList[index].error ? "inc-list-item" : null
              }
              key={index}
            >
              <b>{i.name}</b>
              <i
                onClick={() => props.deleteTeamFromResultList(index)}
                className="fa fa-minus"
              />
              <input
                value={props.pagesList[index].value}
                type="text"
                id={index}
                onChange={props.onChangeReportPages}
              />
            </li>
          );
        })}
      </ul>
      {!props.genReportStatus && (
        <div className="checkbox-container">
          <label>Generować link do pobrania?</label>
          <input
            name="isGoing"
            type="checkbox"
            checked={props.generateLink}
            onChange={props.handleCheckboxChange}
          />
        </div>
      )}
      {!props.gDriveRedirectLink ? (
        <SpinnerButton
          validationResult={props.didPagesHasIncorrectValues}
          onClickHandler={props.generateReport}
          isLoading={props.isGenReport}
          shouldSubmit={false}
          btnTitle="Generuj"
          submitResult={{
            status: props.genReportStatus,
            content: props.genReportStatus
              ? "Raport został wygenerowany"
              : props.genReportErrors[0]
          }}
        />
      ) : (
        <Button
          onClick={() => {
            window.open(props.gDriveRedirectLink);
          }}
          mainClass="log-in-btn"
          title="Przejdź do logowania"
        />
      )}

      {props.genReportStatus && (
        <Button
          onClick={props.downloadReport}
          mainClass="download-report-btn"
          title="Pobierz raport"
        />
      )}

      {props.gDriveLoginResult !== null && (
        <StatusPrompt
          error={props.gDriveLoginErrors[0]}
          result={props.gDriveLoginResult}
        />
      )}
    </Modal>
  );
};

export default genReport;
