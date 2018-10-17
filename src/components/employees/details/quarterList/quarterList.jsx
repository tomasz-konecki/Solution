import React from "react";
import "./quarterList.scss";
import Button from "../../../common/button/button";
import ConfirmModal from "../../../common/confimModal/confirmModal";
import Spinner from "../../../common/spinner/spinner";
import SmallSpinner from "../../../common/spinner/small-spinner";
import OperationStatusPrompt from "../../../form/operationStatusPrompt/operationStatusPrompt";
import Modal from "react-responsive-modal";
import EmptyContent from "../../../common/empty-content/empty-content";
import { connect } from "react-redux";
import moment from 'moment';
import ServerError from "../../../common/serverError/serverError";
import Form from "../../../form/form";
import { translate } from "react-translate";
import { withRouter } from 'react-router';
import QuarterListItem from '../../../quarters/others/quarterListItem/quarterListItem.jsx';
import { deleteQuarterTalkACreator, reactivateQuarterTalkACreator, deleteQuarterTalk } from '../../../../actions/quarterTalks.js';
import List from '../../../common/list/list';
class QuarterList extends React.PureComponent {
  state = {
    currentWatchedDetailIndex: -1
  };

  functionsToUseForQuarters = [
    {name: "filter", count: true, filterBy: "isDeleted", 
        posibleValues: [{value: true, description: this.props.t("Deleted")}, {value: false, description: this.props.t("NotDeleted")}]}
  ];

  putEmployeeToLastWatchedAndRedirect = url => {
    const { history, employeeId, changeCurrentWatchedUser } = this.props;
    changeCurrentWatchedUser(employeeId);
    history.push(url);
  }

  operationsHandler = (quarter, operationName) => {
    if(operationName === "expendDetails"){
      this.handleExpandDetails(quarter);
    }
  }

  handleExpandDetails = quarter => {
    const { quarterTalks } = this.props;
    const currentWatchedDetailIndex = quarterTalks.findIndex(i => i.id === quarter.id);
    
    if(this.state.currentWatchedDetailIndex !== currentWatchedDetailIndex)
      this.setState({currentWatchedDetailIndex});
    else
      this.setState({currentWatchedDetailIndex: -1});    

  }
  
  render() {
    const {  t, employeeId, quarterTalks } = this.props;
    const { currentWatchedDetailIndex } = this.state;
   
    return (
      <div className="quaters-container">
        {quarterTalks && quarterTalks.length > 0 ? 
          <List listClass="quarter-list" functionsToUse={this.functionsToUseForQuarters}
          shouldAnimateList clickItemFunction={this.operationsHandler} items={quarterTalks} component={QuarterListItem} 
            componentProps={{
              answers: quarterTalks[currentWatchedDetailIndex] ? quarterTalks[currentWatchedDetailIndex].quarterTalkQuestionItems : [],
              currentWatchedItemId: currentWatchedDetailIndex,
              isDetailItemFromEmployeeDetails: true,
              subHeader: t("QuarterItemSubHeader"),
              deleteTranslation: t("Delete"),
              doneQuarter: t("DoneQuarter"),
              incomingQuarter: t("IncomingQuarter"),
              reactivate: t("Reactivate"),
              forQuarter: t("ForQuarter"),
              conduct: t("Conduct"),
              quarter: t("Quarter"),
              connector: t("In"),
              inYear: t("InYear"),  
              QuarterDeletedPrompt: t("QuarterDeletedPrompt")
          }}
          listTitle={`${t("QuaterTalks")}`}
          allKeysOfItems={["id", "isTaken", "year", "quarter" ,"quarterTalkQuestionItems", "questionerId", "plannedTalkDate"]}
        /> : 
          <EmptyContent
              action={() => this.putEmployeeToLastWatchedAndRedirect(`/main/quarters/employees/addquarter/${employeeId}?=${employeeId}`)}
              sizeClass="quaters-size"
              shouldShowTopIcon={status !== t("NotActive")}
              content={t("Empty")}
              operationIcon="fa fa-plus"
              mainIcon="fa fa-comments"
          />
        }

        <div className="q-btn-holder">
            <Button
              onClick={() => this.putEmployeeToLastWatchedAndRedirect(`/main/quarters/employees/addquarter/${employeeId}?=${employeeId}`)}
              title={t("Add")}
              mainClass="option-btn normal-btn rel-btn"
            />
            <Button
              onClick={() => this.putEmployeeToLastWatchedAndRedirect(`/main/quarters/employees/${employeeId}?=${employeeId}`)}
              title={t("CallCalendar")}
              mainClass="option-btn normal-btn rel-btn"
            />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      deleteQuarterStatus: state.quarterTalks.deleteQuarterStatus, 
      deleteQuarterErrors: state.quarterTalks.deleteQuarterErrors,

      reactiveQuarterStatus: state.quarterTalks.reactiveQuarterStatus,
      reactiveQuarterErrors: state.quarterTalks.reactiveQuarterErrors,
  }
}

const mapDispatchToProps = dispatch => {
  return {
      deleteQuarterTalkACreator: (quarterToDeleteId, quartersForEmployee) => dispatch(deleteQuarterTalkACreator(quarterToDeleteId, quartersForEmployee)),
      reactivateQuarterTalkACreator: (quarterId, quartersForEmployee) => dispatch(reactivateQuarterTalkACreator(quarterId, quartersForEmployee)),
      deleteQuarterTalk: () => dispatch(deleteQuarterTalk(null, []))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("Quaters")(withRouter(QuarterList)));
