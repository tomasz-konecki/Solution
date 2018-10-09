import React from 'react'
import './employeeQuarters.scss';
import { connect } from 'react-redux';
import { getQuartersForEmployeeACreator, getQuartersForEmployee, deleteQuarterTalkACreator, deleteQuarterTalk, reactivateQuarterTalkACreator  } from '../../../actions/quarterTalks.js';
import LoadHandlingWrapper from '../../../hocs/handleLoadingContent';
import List from '../../common/list/list';
import Button from '../../common/button/button.js';
import QuarterListItem from '../others/quarterListItem/quarterListItem';
import QuarterDetailsItem from '../others/quarterDetailsItem/quarterDetailsItem';
import { getEmployeeId } from '../../../services/methods.js';
import ConfirmModal from '../../common/confimModal/confirmModal.js';
import OperationStatusPrompt from '../../form/operationStatusPrompt/operationStatusPrompt.js';
import Spinner from '../../common/spinner/spinner.js';
const functionsToUseForQuestions = [
    {name: "search", searchBy: "question", count: true }, 
    {name: "sort", sortBy: "question"}
]

const functionsToUseForQuarters = [
    {name: "filter", count: true, filterBy: "isDeleted", posibleValues: [{value: false, description: "Nieusunięte"}, {value: true, description: "Usunięte"}]}
]
class EmployeeQuarters extends React.PureComponent{
    state = {
        isLoadingQuarters: true,
        currentWatchedQuarterDetail: 0,
        quarterToDeleteId: -1, isDeletingQuarter: false, isReactivatingQuarter: false
    }

    componentDidMount(){
        this.getQuartersForEmployeeHandler(getEmployeeId());
    }
    
    componentDidUpdate(prevProps){
        if(prevProps.location.search !== this.props.location.search){
            this.setState({isLoadingQuarters: true});
            this.getQuartersForEmployeeHandler();
        }
    }

    getQuartersForEmployeeHandler = () => {
        this.props.getQuartersForEmployeeACreator(getEmployeeId())
        .then(() => this.setState({isLoadingQuarters: false}))
        .catch(() => this.setState({isLoadingQuarters: false}));
    }

    onClickOperationHandler = (quarter, operationName) => {
        const { reactivateQuarterTalkACreator, quartersForEmployee } = this.props;
        switch(operationName){
            case "delete":
                this.setState({quarterToDeleteId: quarter.id})
                break;
            case "reactivate":
                this.setState({isReactivatingQuarter: true});
                reactivateQuarterTalkACreator(quarter.id, quartersForEmployee).then(() => {
                    this.setState({isReactivatingQuarter: false});
                }).catch(() => this.setState({isReactivatingQuarter: false}));
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

    render(){
        const { isLoadingQuarters, currentWatchedQuarterDetail, quarterToDeleteId, isDeletingQuarter, isReactivatingQuarter } = this.state;
        const { deleteQuarterTalk, deleteQuarterStatus, deleteQuarterErrors, getQuartersForEmployee, quartersForEmployee, 
            quartersForEmployeeStatus, quartersForEmployeeErrors, shouldLoadDataAfterLinkChange } = this.props;
        return (
            <LoadHandlingWrapper errors={quartersForEmployeeErrors} closePrompt={() => getQuartersForEmployee([], null, [])} 
                operationStatus={quartersForEmployeeStatus} isLoading={isLoadingQuarters}>
                <main className="employee-quarters">
                    <div className="quarters-list-container">
                        <List isDoingRequest={isReactivatingQuarter} listClass="quarter-list" functionsToUse={functionsToUseForQuarters}
                        shouldAnimateList clickItemFunction={this.onClickOperationHandler} items={quartersForEmployee} component={QuarterListItem} listTitle={`Rozmowy kwartalne ${getEmployeeId()}`}
                            allKeysOfItems={["id", "isTaken", "year", "quarter" ,"quarterTalkQuestionItems", "questionerId", "plannedTalkDate"]}/>

                    </div>
                    <div className="quarter-detail">
                        {quartersForEmployee[currentWatchedQuarterDetail] && 
                            quartersForEmployee[currentWatchedQuarterDetail].quarterTalkQuestionItems ? 
                            <List functionsToUse={functionsToUseForQuestions} listTitle="Przebieg rozmowy" listClass="question-list" 
                            component={QuarterDetailsItem} items={quartersForEmployee[currentWatchedQuarterDetail].quarterTalkQuestionItems} /> : 
                            
                            <div className="Ta rozmowa kwartalna nie ma uzupełnionych odpowiedzi"></div>
                        }
                        
                    </div>
                </main>
                
                <ConfirmModal 
                operation={this.handleQuarterTalkDelete} operationName="Usuń" header="Czy jesteś pewny, że chcesz usunąć tą rozmowę kwartalną?"
                onClose={this.closeConfirmDeleteModal} open={quarterToDeleteId !== -1}>
                    {isDeletingQuarter && <Spinner />}
                </ConfirmModal>
                
                {deleteQuarterStatus !== null && 
                    <OperationStatusPrompt closePrompt={deleteQuarterTalk}
                        operationPromptContent={
                            deleteQuarterStatus
                            ? `Pomyślnie usunięto rozmowę kwartalną`
                            : deleteQuarterErrors && deleteQuarterErrors[0]
                        }
                        operationPrompt={deleteQuarterStatus}
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
        deleteQuarterTalk: () => dispatch(deleteQuarterTalk(null, []))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(EmployeeQuarters);