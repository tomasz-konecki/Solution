import React from "react";
import "./quaters.scss";
import Button from "../../../common/button/button";
import ConfirmModal from "../../../common/confimModal/confirmModal";
import Spinner from "../../../common/spinner/spinner";
import SmallSpinner from "../../../common/spinner/small-spinner";
import OperationStatusPrompt from "../../../form/operationStatusPrompt/operationStatusPrompt";
import Modal from "react-responsive-modal";
import EmptyContent from "../../../common/empty-content/empty-content";
import ActivateCheckbox from "../others/activateCheckbox";
import { connect } from "react-redux";
import moment from 'moment';
import ServerError from "../../../common/serverError/serverError";
import Form from "../../../form/form";
import { translate } from "react-translate";
import { withRouter } from 'react-router';

class Quaters extends React.PureComponent {
  state = {
    quarters: null,
    listToShowIndex: null,
    currentPage: 1,
    watchedRecords: 0,
    showDeleteModal: false,
    deletingQuater: false,
    activatingQuater: false,
    shouldShowDeleted: false,
    currentOpenedItemId: null
  };
  selectQuartersByState = (state, quartersList) => {
    const newQuarters = [];
    for (let i = 0; i < quartersList.length; i++) {
      if (quartersList[i].isDeleted === state)
        newQuarters.push(quartersList[i]);
    }
    return newQuarters;
  };

  componentDidMount() {
    const { quarterTalks } = this.props;
    if (quarterTalks) {
      const quarters = this.selectQuartersByState(
        this.state.shouldShowDeleted,
        quarterTalks
      );
      this.setState({ quarters: quarters });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.deleteQuaterStatus) {
      const quarters = this.selectQuartersByState(
        this.state.shouldShowDeleted,
        [...nextProps.quarterTalks]
      );
      const shouldShowActiveQuarters = quarters.length === 0;
      this.setState({
        deletingQuater: false,
        showDeleteModal: false,
        listToShowIndex: null,
        quarters: quarters,
        shouldShowDeleted: shouldShowActiveQuarters,
        currentOpenedItemId: null
      });
    } else if (nextProps.reactivateQuaterStatus) {
      const quarters = this.selectQuartersByState(
        this.state.shouldShowDeleted,
        [...nextProps.quarterTalks]
      );
      const shouldShowDeletedQuarters = quarters.length === 0;

      this.setState({
        quarters: quarters,
        activatingQuater: false,
        shouldShowDeleted: shouldShowDeletedQuarters,
        listToShowIndex: null,
        currentOpenedItemId: null
      });
    } else if (nextProps.deleteQuaterErrors !== this.props.deleteQuaterErrors)
      this.setState({ deletingQuater: false });
    else if (
      nextProps.reactivateQuaterErrors !== this.props.reactivateQuaterErrors
    )
      this.setState({ activatingQuater: false });
  }
  showDetails = (index, itemId) => {
    const { listToShowIndex, currentOpenedItemId } = this.state;
    const newIndex = listToShowIndex === index ? null : index;
    const newItemId = currentOpenedItemId === itemId ? null : itemId;
    this.setState({
      listToShowIndex: newIndex,
      currentOpenedItemId: newItemId
    });
  };
  deleteQuaters = () => {
    this.setState({ deletingQuater: true });
    const { deleteQuaterACreator, employeeId } = this.props;
    deleteQuaterACreator(this.state.currentOpenedItemId, employeeId);
  };

  activateQuaters = quarterId => {
    this.setState({ activatingQuater: true });
    this.props.reactivateQuaterACreator(
      quarterId,
      this.props.employeeId,
      this.props.t("QuarterTalkActivated")
    );
  };
  showDeleted = () => {
    const { shouldShowDeleted } = this.state;
    const quarters = this.selectQuartersByState(
      !shouldShowDeleted,
      this.props.quarterTalks
    );
    this.setState({
      shouldShowDeleted: !shouldShowDeleted,
      quarters: quarters,
      currentPage: 1,
      watchedRecords: 0,
      currentOpenedItemId: null,
      listToShowIndex: null
    });
  };

  putOperationButtonsInDom = () => {
    const { t, status, employeeId } = this.props;
    if(status === "Aktywny"){
      return (
        <React.Fragment>
          <Button
            onClick={() => this.putEmployeeToLastWatchedAndRedirect(`/main/quarters/employees/addquarter/${employeeId}?=${employeeId}`)}
            title={t("Add")}
            mainClass="option-btn normal-btn rel-btn"
          />
          <Button
            onClick={() => this.putEmployeeToLastWatchedAndRedirect(`/main/quarters/employees/${employeeId}?=${employeeId}`)}
            title="Kalendarz rozmów"
            mainClass="option-btn normal-btn rel-btn"
          />
        </React.Fragment>
      );
    }
    return null;
  }

  putEmployeeToLastWatchedAndRedirect = (url) => {
    const { history, createLastWatchedPersonsArray, lastWatchedPersons, employeeId, changeCurrentWatchedUser } = this.props;
 
    const isEmployeeIdAlreadyExist = lastWatchedPersons.length === 0 ? -1 : lastWatchedPersons.findIndex(i => {
      return i === employeeId
    });
    if(isEmployeeIdAlreadyExist === -1){
      const copiedLastWatchedPersons = [...lastWatchedPersons];
      createLastWatchedPersonsArray(copiedLastWatchedPersons);
      changeCurrentWatchedUser(employeeId);
      copiedLastWatchedPersons.push(employeeId);
      
    }
  
    history.push(url);
  }
  
  render() {
    const { paginationLimit, deleteQuaterStatus, deleteQuaterErrors, quarterTalks, status, t, employeeId } = this.props;
    const { listToShowIndex, currentPage, watchedRecords, showDeleteModal, deletingQuater, activatingQuater, shouldShowDeleted, quarters } = this.state;
    const shouldShowOperationButtons = this.putOperationButtonsInDom();

    return (
      <div className="quaters-container">
        
        {quarters && quarters.length > 0 ? (
          <React.Fragment>
            <h2>
              {t("QuaterTalks")} <span>({quarters.length})</span>{" "}
              {activatingQuater && <SmallSpinner />}
            </h2>
            <ul>
              {quarters.map((item, index) => {
                return (
                  index >= paginationLimit * (currentPage - 1) &&
                  index < paginationLimit * currentPage && (
                    <li
                      className={
                        item.isDeleted === true
                          ? "is-deleted-quater"
                          : "is-activate-quater"
                      }
                      onClick={() => this.showDetails(index, item.id)}
                      key={index}
                    >
                      {index === listToShowIndex && (
                        <div className="clicked-row" />
                      )}
                      <span>
                        <b>({item.quarter})</b> {item.year}
                      </span>
                      <span>{item.employeeId}</span>
                      {index === listToShowIndex && (
                        <div className="aditional-informations">
                          <ul>
                            {item.quarterTalkQuestionItems.map(questionItem => {
                              return (
                                <li key={questionItem.id}>
                                  <p>{questionItem.question}</p>
                                  <article>{questionItem.answer}</article>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </li>
                  )
                );
              })}
            </ul>

            <div className="pagination-options">
              {listToShowIndex !== null &&
                !shouldShowDeleted &&
                status === t("Active") && (
                  <i
                    onClick={() => this.setState({ showDeleteModal: true })}
                    className="fa fa-trash"
                  />
                )}

              {listToShowIndex !== null &&
                shouldShowDeleted &&
                status === t("Active") && (
                  <i
                    onClick={() =>
                      this.activateQuaters(quarters[listToShowIndex].id)
                    }
                    className="fa fa-check"
                  />
                )}

              {watchedRecords !== 0 &&
                quarters.length > watchedRecords && (
                  <i
                    onClick={() =>
                      this.setState({
                        currentPage: currentPage - 1,
                        watchedRecords: watchedRecords - paginationLimit
                      })
                    }
                    className="fa fa-arrow-left"
                  />
                )}

              {currentPage < Math.ceil(quarters.length / paginationLimit) && (
                <i
                  onClick={() =>
                    this.setState({
                      currentPage: currentPage + 1,
                      watchedRecords: watchedRecords + paginationLimit
                    })
                  }
                  className="fa fa-arrow-right"
                />
              )}
            </div>
          </React.Fragment>
        ) : (
          <EmptyContent
            sizeClass="quaters-size"
            shouldShowTopIcon={status !== t("NotActive")}
            content={`${t("Missing")} ${
              shouldShowDeleted ? t("Deleted") : t("Active")
            } ${t("QuaterTalks")}`}
            operationIcon="fa fa-plus"
            mainIcon="fa fa-comments"
          />
        )}
        <div className="q-btn-holder">
          {this.putOperationButtonsInDom()}
          <ActivateCheckbox
            shouldShowDeleted={shouldShowDeleted}
            showDeleted={this.showDeleted}
          />
        </div>
        

        <ConfirmModal
          operationName={t("Delete")}
          operation={this.deleteQuaters}
          open={showDeleteModal}
          header={t("DeleteQuarterTalkConfirmation")}
          onClose={() => this.setState({ showDeleteModal: false })}
        >
          {deletingQuater && <Spinner />}
        </ConfirmModal>

        {deleteQuaterStatus !== null &&
          deleteQuaterStatus !== undefined && (
            <OperationStatusPrompt
              operationPromptContent={
                deleteQuaterStatus
                  ? t("OperationSuccess")
                  : deleteQuaterErrors[0]
              }
              operationPrompt={deleteQuaterStatus}
            />
          )}
      </div>
    );
  }
}


export default translate("Quaters")(withRouter(Quaters));
