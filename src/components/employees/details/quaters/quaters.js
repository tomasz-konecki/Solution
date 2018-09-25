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
import LoadHandlingWrapper from '../../../../hocs/handleLoadingContent.jsx';
import { getReservedDatesACreator, getReservedDates, planQuarter, planQuarterACreator, createPosibleTimeSpaces } from '../../../../actions/quarterTalks';
import { validateInput } from '../../../../services/validation';
const createQuestionsForm = questions => {
  const copiedQuestions = [...questions];
  const formItems = [];
  const objectToAdd = {
    title: "", mode: "textarea", value: "", error: "", canBeNull: true, maxLength: 300,
  }
  for(let i = 0; i < copiedQuestions.length; i++){
    const copiedObject = {...objectToAdd};
    copiedObject.title = copiedQuestions[i].question;
    copiedObject['id'] = copiedQuestions[i].id;
    formItems.push(copiedObject);
    
  }
  return formItems;
}

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
    currentOpenedItemId: null,
    openPlanQuaterModal: false,
    getFreeDatesLoading: false,
    wasChangedData: 0,

    planQuarterFormItems: [
      { title: "Data odbycia", mode: 'date-picker', error: "", callBackFunc: () => this.getQuartersByDate(),
        value: moment().locale("pl"), canBeNull: false, checkIfDateIsfromPast: true },
      {
        title: "Kwartał", mode: "type-and-select", value: "", error: "", canBeNull: false,
        type: "text",
        inputType: "number",
        placeholder: "wybierz lub wpisz kwartał...",
        dataToMap: [
            {name: "1", id: 1},
            {name: "2", id: 2},
            {name: "3", id: 3},
            {name: "4", id: 4}
        ]
      },
    ],
    timeToPlanQuarter: {value: "", error: ""},
    isPlanningQuarter: false,
    showChooseHourInput: false,
    isAddingDateToDatesListIndex: -1,
    lastAddedTime: ""
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
    const { t, history, status, employeeId } = this.props;
    if(status === "Aktywny"){
      return (
        <React.Fragment>
          <Button
            onClick={() => history.push(`/main/employees/addquarter/${employeeId}`)}
            title={t("Add")}
            mainClass="option-btn normal-btn rel-btn"
          />
          <Button
            onClick={this.openPlanQuarterModal}
            title="Zaplanuj rozmowę"
            mainClass="option-btn normal-btn rel-btn"
          />
        </React.Fragment>
      );
    }
    return null;
  }

  openPlanQuarterModal = () => {
    this.setState({openPlanQuaterModal: true, getFreeDatesLoading: true});
    const { getReservedDatesACreator, employeeId } = this.props;
    getReservedDatesACreator(employeeId).then(() => {
      this.setState({getFreeDatesLoading: false})
    }).catch(() => this.setState({getFreeDatesLoading: false}));
  }

  closePlanQuarterModal = () => {
    this.setState({openPlanQuaterModal: false, timeToPlanQuarter: {value: "", error: ""}}, () => {
      this.closeAddingHour();
      this.props.changeReservedDates([], null, []);
      this.props.planQuarterClear();
    });
  }

  planQuarter = () => {
    this.setState({isPlanningQuarter: true});
    const { planQuarterACreator, employeeId } = this.props;
    const { planQuarterFormItems, lastAddedTime } = this.state;
    planQuarterACreator(employeeId, planQuarterFormItems, lastAddedTime).then(() => {
      this.setState({isPlanningQuarter: false});
    }).catch(() => this.setState({isPlanningQuarter: false}))
  }

  getQuartersByDate = () => {
   this.setState({wasChangedData: this.state.wasChangedData+1}, () => {
    this.closeAddingHour();
   });
  }

  filterQuarters = () => {
    const { reservedDates: items } = this.props;
    const planQuarterFormItems = [...this.state.planQuarterFormItems];
    
    if(items.length > 0){
      const selectedDate = planQuarterFormItems[0].value.format().slice(0, 10);
    
      return items.filter(item => {
        return item.date === selectedDate;
      })
    }

    return items;
  }

  showChooseHourInput = () => {
    this.closeAddingHour();
    this.setState({showChooseHourInput: true});
  }

  onChangePlanQuarterTime = (e, indexOfCurrentAddingDate, filteredQuarters) => {
    const validationResult = validateInput(e.target.value, false, null, null, null, "godzina rozmowy", null,
      {startValue: filteredQuarters[indexOfCurrentAddingDate], endValue: filteredQuarters[indexOfCurrentAddingDate+1]});
 
    const actualPlanQuarterTime = {...this.state.timeToPlanQuarter};

    actualPlanQuarterTime.value = e.target.value;
    actualPlanQuarterTime.error = validationResult;
    this.setState({timeToPlanQuarter: actualPlanQuarterTime});
  }
  onChangPlanWhenIsEmpty = e => {
    const validationResult = validateInput(e.target.value, false, null, null, null, "godzina rozmowy", 
      {startValue: "06:00", endValue: "20:00"}, null);

    const actualPlanQuarterTime = {...this.state.timeToPlanQuarter};
    actualPlanQuarterTime.value = e.target.value;
    actualPlanQuarterTime.error = validationResult;
    this.setState({timeToPlanQuarter: actualPlanQuarterTime});
  }

  closeAddingHour = () => {
    this.setState({isAddingDateToDatesListIndex: -1, timeToPlanQuarter: {value: "", error: ""}, 
    showChooseHourInput: false, isPlanningQuarter: false});
  }

  addHourToPlannedQuarter = index => {
    const { timeToPlanQuarter, planQuarterFormItems } = this.state;
    const { changeReservedDates } = this.props;

    const selectedDate = planQuarterFormItems[0].value.format("YYYY-MM-DD");
    const dateWithTime = selectedDate + timeToPlanQuarter.value;

    const momentedTimeAndDate = moment(dateWithTime, "YYYY-MM-DD HH:mm");
    const substractedTime = momentedTimeAndDate.subtract(1, 'days').format('HH:mm');
    
    const momentedTimeWithAdditionalHours = momentedTimeAndDate.add(1, 'hours').subtract(1, 'days').format('HH:mm');

    const objectToAdd = {date: selectedDate, time: substractedTime, willLastTo: momentedTimeWithAdditionalHours};
  
    const copiedReservedDates = [...this.props.reservedDates];

    copiedReservedDates.splice(index+1, 0, objectToAdd);
    copiedReservedDates.splice(0, 1);
    copiedReservedDates.splice(copiedReservedDates.length-1, 1);
    
    this.setState({lastAddedTime: substractedTime}, () => {
      changeReservedDates(createPosibleTimeSpaces(copiedReservedDates), true, []);
      this.closeAddingHour();
    });
  }
  
  render() {
    const { reservedDates, getDatesStatus, getDatesErrors, changeReservedDates,planQuarterStatus, planQuarterErrors,
      paginationLimit, deleteQuaterStatus, deleteQuaterErrors, quarterTalks, status, t, employeeId } = this.props;
    const {openPlanQuaterModal, getFreeDatesLoading, planQuarterFormItems, isPlanningQuarter, showedReservedDates,
      listToShowIndex, currentPage, watchedRecords, showDeleteModal, deletingQuater, activatingQuater, shouldShowDeleted, quarters,
      showChooseHourInput, timeToPlanQuarter, isAddingDateToDatesListIndex, lastAddedTime
      } = this.state;
    const shouldShowOperationButtons = this.putOperationButtonsInDom();

    const filteredQuarters = this.filterQuarters();

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
          <ActivateCheckbox
            shouldShowDeleted={shouldShowDeleted}
            showDeleted={this.showDeleted}
          />
          {this.putOperationButtonsInDom()}
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

        <Modal
          open={openPlanQuaterModal}
          classNames={{ modal: "Modal plan-quarter-modal" }}
          contentLabel="Plan quarter modal"
          onClose={this.closePlanQuarterModal}
        >
          <header>
            <h3 className="section-heading">
              Zaplanuj rozmowę kwartalną
            </h3>
          </header>
          <LoadHandlingWrapper errors={getDatesErrors} closePrompt={changeReservedDates} operationStatus={getDatesStatus} isLoading={getFreeDatesLoading}>
              <Form
                btnTitle="Zaplanuj"
                shouldSubmit={true}
                onSubmit={this.planQuarter}
                isLoading={isPlanningQuarter}
                formItems={planQuarterFormItems}
                enableButtonAfterTransactionEnd={true}
                shouldBeDisabledByOtherReason={timeToPlanQuarter.error ? true : false}
                  submitResult={{
                    status: planQuarterStatus,
                    content: planQuarterStatus ? "Pomyślnie zaplanowano rozmowe kwartalną" :
                      planQuarterErrors[0]
                    }}
                >
                  {timeToPlanQuarter.error && 
                      <ServerError errorClass="small-form-error" message={timeToPlanQuarter.error}/>
                  }
                </Form>
                <nav>
                    <Button title="Zajęte dni" mainClass="option-btn normal-btn"/>
                </nav>
                <div className="calendar">
                  <h2>Liczba rozmów w dniu <span>{planQuarterFormItems[0].value.format('dddd')}</span> wynosi: {filteredQuarters.length === 0 ? filteredQuarters.length : 
                    filteredQuarters.length-2}
                  </h2>
                  
                  <div className="hours">
                    {filteredQuarters.map((date, index) => {
                      return (
                        <div key={index} className={`${date.hours > 0 && isAddingDateToDatesListIndex !== index ? "highlighter" : ""} ${date.isHelpOnly ? "start-or-end-time" : ""}`}>
                          {date.time} <div><i className="fa fa-clock"></i><span>{date.willLastTo}</span></div>
                          <span onClick={() => this.setState({isAddingDateToDatesListIndex: index})}/>

                          {isAddingDateToDatesListIndex === index ? 
                          <section className="time-input-container">
                            <input value={timeToPlanQuarter.value} type="time" 
                            onChange={e => this.onChangePlanQuarterTime(e, index, filteredQuarters)}/> 
                            <i onClick={this.closeAddingHour} className="fa fa-times"></i>
                            <i onClick={() => this.addHourToPlannedQuarter(index)} className="fa fa-check"></i>
                          </section> : 
                          (date.hours && date.hours > 0) ? <i onClick={() => this.setState({isAddingDateToDatesListIndex: index})} className="fa fa-plus"/> : null
                          }

                        </div>
                      );
                    })}

                    {lastAddedTime && 
                      <div className="last-added-time-prompt">
                        <p>Dodałeś godzinę: <b>{lastAddedTime}</b> w której odbędzie się rozmowa. Wypełnij formularz do końca i wcisnij przycisk "Zaplanuj"</p>
                        <p>
                          <i>lub</i>
                          <span> Usuń dodane</span>
                        </p>
                      </div>
                    }
                    
                    {filteredQuarters.length === 0 && 
                    <React.Fragment>
                      <div className="start-or-end-time">
                          06:00 <div><i className="fa fa-clock"></i></div>
                      </div>
                      {showChooseHourInput ? 

                      <section className="time-input-container">
                        <input value={timeToPlanQuarter.value} type="time" 
                          onChange={e => this.onChangPlanWhenIsEmpty(e)}/> 
                        <i onClick={this.closeAddingHour} className="fa fa-times"></i>
                        <i className="fa fa-check"></i>
                      </section>

                      : 
                        <button onClick={() => this.setState({showChooseHourInput: true})} 
                          className="add-hour-btn">Dodaj godzinę</button>
                      }
                      <div className="start-or-end-time">
                          20:00 <div><i className="fa fa-clock"></i></div>
                      </div>
                    </React.Fragment>
                    }
                  </div>
                </div>

          </LoadHandlingWrapper>

        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    reservedDates: state.quarterTalks.reservedDates, 
    getDatesStatus: state.quarterTalks.getDatesStatus, 
    getDatesErrors: state.quarterTalks.getDatesErrors,

    planQuarterStatus: state.quarterTalks.planQuarterStatus,
    planQuarterErrors: state.quarterTalks.planQuarterErrors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getReservedDatesACreator: (employeeId) => dispatch(getReservedDatesACreator(employeeId)),
    changeReservedDates: (reservedDates, status, errors) => dispatch(getReservedDates(reservedDates, status, errors)),

    planQuarterACreator: (employeeId, formItems, time) => dispatch(planQuarterACreator(employeeId, formItems, time)),
    planQuarterClear: () => dispatch(planQuarter(null, [])),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("Quaters")(withRouter(Quaters)));
