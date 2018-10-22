import React from 'react'
import './employeeQuarters.scss';
import { connect } from 'react-redux';
import { getQuartersForEmployeeACreator, getQuartersForEmployee, 
    deleteQuarterTalkACreator, deleteQuarterTalk, reactivateQuarterTalkACreator  } from '../../../actions/quarterTalks.js';
import LoadHandlingWrapper from '../../../hocs/handleLoadingContent';
import List from '../../common/list/list';
import Button from '../../common/button/button.js';
import QuarterListItem from '../others/quarterListItem/quarterListItem';
import QuarterDetailsItem from '../others/quarterDetailsItem/quarterDetailsItem';
import ConfirmModal from '../../common/confimModal/confirmModal.js';
import OperationStatusPrompt from '../../form/operationStatusPrompt/operationStatusPrompt.js';
import Spinner from '../../common/spinner/spinner.js';
import { translate } from 'react-translate';
import { API_ENDPOINT } from '../../../api/index.js';
import EmptyContent from '../../common/empty-content/empty-content.js';
import { getEmployeeId } from '../../../services/methods.js';


class EmployeeQuarters extends React.PureComponent{
    state = {
        isLoadingQuarters: true,
        currentWatchedQuarterDetail: -1,
        quarterToDeleteId: -1, isChangingSomethingInQuarterList: false,
        isDeletingQuarter: false
    }

    functionsToUseForQuestions = [
        {name: "search", searchBy: "question", count: true }, 
        {name: "sort", sortBy: "question"}
    ];
    
    functionsToUseForQuarters = [
        {name: "filter", count: true, filterBy: "isDeleted", 
            posibleValues: [{value: true, description: this.props.t("Deleted")}, {value: false, description: this.props.t("NotDeleted")}]}
    ]

    componentDidMount(){
        this.getQuartersForEmployeeHandler(getEmployeeId());
    }
    
    componentDidUpdate(prevProps){
        const { currentWatchedUser, history, quartersForEmployee } = this.props;
        const { state } = history.location;
        if(currentWatchedUser !== prevProps.currentWatchedUser){
            this.setState({isLoadingQuarters: true});
            this.getQuartersForEmployeeHandler(currentWatchedUser);
        }
    }

    getQuartersForEmployeeHandler = employeeId => {
        const { history, getQuartersForEmployeeACreator, 
            changeCurrentWatchedUser, currentWatchedUser } = this.props;
        const { state } = history.location;
        getQuartersForEmployeeACreator(employeeId)
        .then(items => {
            let quarterIdToSet = 0;
            if(state){
                if(state.quarterTalkId){
                    quarterIdToSet = items.findIndex(item => item.id === state.quarterTalkId);
                }
            }
            if(employeeId !== currentWatchedUser){
                changeCurrentWatchedUser(employeeId);
                createLastWatchedPersonsArrayACreator(employeeId);
            }
            this.setState({isLoadingQuarters: false, currentWatchedQuarterDetail: quarterIdToSet});
        })
        .catch(() => {
            if(!getEmployeeId()){
                changeCurrentWatchedUser("");
            }
            this.setState({isLoadingQuarters: false});
        });
    }

    onClickOperationHandler = (quarter, operationName) => {
        const { reactivateQuarterTalkACreator, quartersForEmployee, generateQuarterDocACreator } = this.props;
        switch(operationName){
            case "delete":
                this.setState({quarterToDeleteId: quarter.id})
                break;
            case "reactivate":
                this.setState({isChangingSomethingInQuarterList: true});
                reactivateQuarterTalkACreator(quarter.id, quartersForEmployee).then(() => {
                    this.setState({isChangingSomethingInQuarterList: false});
                }).catch(() => this.setState({isChangingSomethingInQuarterList: false}));
                break;
            case "generateDoc":
                window.open(`${API_ENDPOINT}/QuarterTalks/GenerateDocx/${quarter.id}`)
                break;
            default: 
                const currentWatchedItemId = quartersForEmployee.findIndex(item => item.id === quarter.id);
                this.setState({currentWatchedQuarterDetail: currentWatchedItemId});
                break;
        }
    }

    handleQuarterTalkDelete = () => {
        const { deleteQuarterTalkACreator, quartersForEmployee } = this.props;
        const { quarterToDeleteId } = this.state;
        this.setState({isDeletingQuarter: true});
        deleteQuarterTalkACreator(quarterToDeleteId, quartersForEmployee).then(() => {
            this.setState({quarterToDeleteId: -1, isDeletingQuarter: false});
        }).catch(() => this.setState({isDeletingQuarter: false}));
    }

    closeConfirmDeleteModal = () => {
        this.setState({quarterToDeleteId: -1}, () => this.props.deleteQuarterTalk());
    }

    fillAnswersForQuarter = () => {
        const { quartersForEmployee } = this.props;
        const { currentWatchedQuarterDetail } = this.state;
        this.props.redirectToPopulatingQuarter(quartersForEmployee[currentWatchedQuarterDetail].id);
    }

    render(){
        const { isLoadingQuarters, currentWatchedQuarterDetail, quarterToDeleteId, isDeletingQuarter, isChangingSomethingInQuarterList } = this.state;
        const { t, deleteQuarterTalk, deleteQuarterStatus, deleteQuarterErrors, getQuartersForEmployee, quartersForEmployee, 
            quartersForEmployeeStatus, quartersForEmployeeErrors, shouldLoadDataAfterLinkChange, 
            generateDocStatus, generateDocErrors, generateQuarterDoc, currentWatchedUser } = this.props;
        return (
            <LoadHandlingWrapper errors={quartersForEmployeeErrors} closePrompt={() => getQuartersForEmployee([], null, [])} 
                operationStatus={quartersForEmployeeStatus} isLoading={isLoadingQuarters}>
                <main className="employee-quarters">
                    <div className="quarters-list-container">
                        <List isDoingRequest={isChangingSomethingInQuarterList} 
                        listClass="quarter-list" functionsToUse={this.functionsToUseForQuarters} componentProps={{
                            currentWatchedItemId: currentWatchedQuarterDetail,
                            subHeader: t("QuarterItemSubHeader"),
                            doneQuarter: t("DoneQuarter"),
                            incomingQuarter: t("IncomingQuarter"),
                            deleteTranslation: t("Delete"),
                            reactivate: t("Reactivate"),
                            conduct: t("Conduct"),
                            forQuarter: t("ForQuarter"),
                            connector: t("In"),
                            inYear: t("InYear"),  
                            quarter: t("Quarter"),
                            QuarterDeletedPrompt: t("QuarterDeletedPrompt")
                        }}
                        shouldAnimateList clickItemFunction={this.onClickOperationHandler} items={quartersForEmployee} component={QuarterListItem} 
                        listTitle={`${t("QuaterTalks")} ${currentWatchedUser}`}
                            allKeysOfItems={["id", "isTaken", "year", "quarter" ,"quarterTalkQuestionItems", "questionerId", "plannedTalkDate"]}/>
                    </div>
                    <div className="quarter-detail">
                        
                        {quartersForEmployeeStatus && quartersForEmployee[currentWatchedQuarterDetail] && quartersForEmployee[currentWatchedQuarterDetail].isTaken && 
                            <List functionsToUse={this.functionsToUseForQuestions} listTitle={t("SpeechState")} listClass="question-list" 
                            component={QuarterDetailsItem} items={quartersForEmployee[currentWatchedQuarterDetail].quarterTalkQuestionItems} />
                        }
                        
                        {quartersForEmployeeStatus && quartersForEmployee[currentWatchedQuarterDetail] && !quartersForEmployee[currentWatchedQuarterDetail].isTaken && 
                            <EmptyContent action={this.fillAnswersForQuarter} sizeClass="quaters-size"
                                shouldShowTopIcon={t("startQuarterTranslation")}
                                content={t("NoAnswers")}
                                operationIcon="fa fa-plus"
                                mainIcon="fa fa-comments"
                            />
                        }
                    </div>
                </main>
                
                <ConfirmModal 
                operation={this.handleQuarterTalkDelete} denyName={t("Deny")}
                operationName={t("Delete")} header={t("MakeSureYouWantDeleteQuarter")}
                onClose={this.closeConfirmDeleteModal} open={quarterToDeleteId !== -1}>
                    {isDeletingQuarter && <Spinner fontSize="3px" positionClass="abs-spinner"/>}
                </ConfirmModal>
                
                {deleteQuarterStatus !== null && 
                    <OperationStatusPrompt closePrompt={deleteQuarterTalk}
                        operationPromptContent={
                            deleteQuarterStatus
                            ? t("SuccDeletedQuarter")
                            : deleteQuarterErrors && deleteQuarterErrors[0]
                        }
                        operationPrompt={deleteQuarterStatus}
                    /> 
                }
                
                {generateDocStatus === false && 
                    <OperationStatusPrompt closePrompt={generateQuarterDoc}
                        operationPromptContent={generateDocErrors[0]}
                        operationPrompt={false}
                    /> 
                }
                     
            </LoadHandlingWrapper>                
        );
    }
}
    
const mapStateToProps = state => {
    return {
        quartersForEmployee: state.quarterTalks.quartersForEmployee, 
        quartersForEmployeeStatus: state.quarterTalks.quartersForEmployeeStatus, 
        quartersForEmployeeErrors: state.quarterTalks.quartersForEmployeeErrors,

        deleteQuarterStatus: state.quarterTalks.deleteQuarterStatus, 
        deleteQuarterErrors: state.quarterTalks.deleteQuarterErrors,

        reactiveQuarterStatus: state.quarterTalks.reactiveQuarterStatus,
        reactiveQuarterErrors: state.quarterTalks.reactiveQuarterErrors
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getQuartersForEmployee: (quarter, status, errors) => dispatch(getQuartersForEmployee(quarter, status, errors)),
        getQuartersForEmployeeACreator: (employeeId) => dispatch(getQuartersForEmployeeACreator(employeeId)),
        deleteQuarterTalkACreator: (quarterToDeleteId, quartersForEmployee) => dispatch(deleteQuarterTalkACreator(quarterToDeleteId, quartersForEmployee)),
        reactivateQuarterTalkACreator: (quarterId, quartersForEmployee) => dispatch(reactivateQuarterTalkACreator(quarterId, quartersForEmployee)),
        deleteQuarterTalk: () => dispatch(deleteQuarterTalk(null, [])),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(translate("Quaters")(EmployeeQuarters));