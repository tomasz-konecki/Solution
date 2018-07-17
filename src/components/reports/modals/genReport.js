import React from "react";
import Modal from "react-responsive-modal";
import StatusPrompt from "../../common/statusPrompt/statusPrompt";
import Button from "../../common/button/button";
import SpinnerButton from "../../form/spinner-btn/spinner-btn";
import Spinner from '../../common/spinner/spinner';
import RedirectSpinner from '../../common/spinner/redirect-spinner';
const genReport = ( {shouldOpenModal, closeModal, addList, pagesList, 
  deleteTeamFromResultList, onChangeReportPages, didPagesHasIncorrectValues}) => {
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
              className={
                pagesList[index].error ? "inc-list-item" : null
              }
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
    </Modal>
  );
};

export default genReport;
