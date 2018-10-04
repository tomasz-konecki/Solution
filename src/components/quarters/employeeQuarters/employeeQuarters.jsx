import React from 'react'
import './employeeQuarters.scss';
import { connect } from 'react-redux';
import { getQuartersForEmployeeACreator, getQuartersForEmployee } from '../../../actions/quarterTalks.js';
import LoadHandlingWrapper from '../../../hocs/handleLoadingContent';
import List from '../../common/list/list';
import Button from '../../common/button/button.js';
import QuarterListItem from '../others/quarterListItem/quarterListItem';
import QuarterDetailsItem from '../others/quarterDetailsItem/quarterDetailsItem';
import { getEmployeeId } from '../../../services/methods.js';

const functionsToUseForQuestions = [
    {name: "search", searchBy: "question" }, 
    {name: "sort", sortBy: "question"}
]

class EmployeeQuarters extends React.PureComponent{
    state = {
        isLoadingQuarters: true,
        currentWatchedQuarterDetail: -1
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

    showQuarterDetails = quarter => {
        const { quartersForEmployee } = this.props;
        const currentWatchedItemId = quartersForEmployee.findIndex(item => item.id === quarter.id);
        this.setState({currentWatchedQuarterDetail: currentWatchedItemId});
    }
    
    render(){
        const { isLoadingQuarters, currentWatchedQuarterDetail } = this.state;
        const { clearQuartersEmployeeQuartersData, quartersForEmployee, quartersForEmployeeStatus, quartersForEmployeeErrors, shouldLoadDataAfterLinkChange } = this.props;
        return (
            <LoadHandlingWrapper errors={quartersForEmployeeErrors} closePrompt={clearQuartersEmployeeQuartersData} 
                operationStatus={quartersForEmployeeStatus} isLoading={isLoadingQuarters}>
                <main className="employee-quarters">
                    <div className="quarters-list-container">
                        <List shouldAnimateList clickItemFunction={this.showQuarterDetails} items={quartersForEmployee} component={QuarterListItem} listTitle={`Rozmowy kwartalne ${getEmployeeId()}`}
                            allKeysOfItems={["id", "isTaken", "year", "quarter" ,"quarterTalkQuestionItems", "questionerId", "plannedTalkDate"]}/>

                    </div>
                    <div className="quarter-detail">
                        {currentWatchedQuarterDetail !== -1 &&
                            quartersForEmployee[currentWatchedQuarterDetail].quarterTalkQuestionItems ? 
                            <List functionsToUse={functionsToUseForQuestions} listTitle="Przebieg rozmowy" listClass="question-list" 
                            component={QuarterDetailsItem} items={quartersForEmployee[currentWatchedQuarterDetail].quarterTalkQuestionItems} /> : 
                            
                            <div className="Ta rozmowa kwartalna nie ma uzupełnionych odpowiedzi"></div>
                        }
                        
                    </div>
                </main>

            </LoadHandlingWrapper>                
        );
    }
}
    
const mapStateToProps = state => {
    return {
        quartersForEmployee: state.quarterTalks.quartersForEmployee, 
        quartersForEmployeeStatus: state.quarterTalks.quartersForEmployeeStatus, 
        quartersForEmployeeErrors: state.quarterTalks.quartersForEmployeeErrors
    }
}

const mapDispatchToProps = dispatch => {
    return {
        clearQuartersEmployeeQuartersData: () => dispatch(getQuartersForEmployee([], null, [])),
        getQuartersForEmployeeACreator: (employeeId) => dispatch(getQuartersForEmployeeACreator(employeeId))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(EmployeeQuarters);