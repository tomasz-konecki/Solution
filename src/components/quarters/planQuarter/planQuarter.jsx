import React from 'react'
import './planQuarter.scss';
import Form from '../../form/form.js';
import { planQuarterACreator, planQuarter, getReservedDatesACreator, getReservedDates } from '../../../actions/quarterTalks.js';
import LoadHandlingWrapper from '../../../hocs/handleLoadingContent';
import { connect } from 'react-redux';
import moment from 'moment';
import List from '../../common/list/list';
import CalendarItem from '../others/calendarItem/calendarItem';
import { authOneDriveACreator, authOneDrive } from '../../../actions/oneDriveActions.js';
import OperationStatusPrompt from '../../form/operationStatusPrompt/operationStatusPrompt.js';
import AuthWithOutlook from '../authWithOutlookComponent/authWithOutlookComponent';

const functionsToUseForDates = [
    {name: "search", searchBy: "date" }, 
    {name: "sort", sortBy: "date"}
];

const pushYears = limit => {
    const startMomentDate = moment("1994-12-19");
    const years = [];
    for(let i = 0; i < limit; i++){
        const formatedDate = startMomentDate.add(1, 'years').format("YYYY");
        years.push({name: formatedDate, id: i});
    }
    console.log(years);
    return years;
}

const invalidOneDriveTokenError = "Nieprawidłowy token autoryzanyjny do usługi Outlook Calendar.";

class PlanQuarter extends React.PureComponent{
    state = {
        isGettingReservedDates: true,
        isPlanningQuarter: false,
        currentWatchedReservedDate: null,

        planQuarterFormItems: [
        { title: "Planowana data", mode: 'date-picker', error: "", callBackFunc: () => console.log("Zmieniono date"),
          value: moment().locale("pl").add(1, 'days'), canBeNull: false, checkIfDateIsfromPast: true },
        {
            title: "Godzina rozmowy", value: "", error: "", canBeNull: false,
            type: "time", mode: "text", inputType: "number",
            placeholder: "wybierz lub wpisz godzinę rozmowy..."
        },
        {
          title: "Kwartał", mode: "select", value: "",
          placeholder: "wybierz lub wpisz kwartał...",
          selectValues: ["1", "2", "3", "4"]
        },
        {
            title: "Rok", mode: "type-and-select", value: "", error: "", canBeNull: false,
            inputType: "number",
            placeholder: "wybierz rok lub wpisz własny...",
            dataToMap: pushYears(20)
        }
        
      ]

    }
    
    componentDidMount(){
        const { getEmployeeId, redirectToLastWatchedPerson, oneDriveToken, match, currentWatchedUser} = this.props;
        if(currentWatchedUser !== ""){
            this.getReservedDates(currentWatchedUser);
        }
        else{
            redirectToLastWatchedPerson(`${match.url}/employees/plan`, true);
            this.getReservedDates(currentWatchedUser);
        }
    }

    componentDidUpdate(prevProps){
        const { location, currentWatchedUser } = this.props;
        if(prevProps.location.search !== location.search){
            this.setState({isGettingReservedDates: true});
            this.getReservedDates(currentWatchedUser);
        }
    }

    getReservedDates = employeeId => {
        const { getReservedDatesACreator, oneDriveToken, authOneDriveACreator, changeLinkBeforeRedirect, location } = this.props;
        getReservedDatesACreator(employeeId, oneDriveToken)
        .then(() => this.setState({isGettingReservedDates: false}))
        .catch(error => {
            if(error[0] === invalidOneDriveTokenError){
                authOneDriveACreator()
                .then(link => {
                    this.setState({isGettingReservedDates: false});
                    changeLinkBeforeRedirect(location);
                    window.location.href = link;
                })
                .catch(() => this.setState({isGettingReservedDates: false}));
            }
            else{
                this.setState({isGettingReservedDates: false})
            }
        });
    }
    
    closeErrorPrompt = () => {
        this.props.clearReservedDate();
    }

    planQuarterHandler = () => {
        this.setState({isPlanningQuarter: true});
        const { planQuarterFormItems } = this.state;
        const { planQuarterACreator, oneDriveToken, currentWatchedUser } = this.props;
        planQuarterACreator(currentWatchedUser, planQuarterFormItems, oneDriveToken).then(() => {
            this.setState({isPlanningQuarter: false});
        }).catch(() => {
            this.setState({isPlanningQuarter: false});
        })
    }

    componentWillUnmount(){
        this.props.clearPlanQuarter();
    }

    selectDateFromList = item => {
        this.setState({})
    }

    render(){
        const { planQuarterStatus, planQuarterErrors, reservedDates, getDatesErrors, getDatesStatus, 
            clearReservedDate, authStatus, authErrors, authOneDriveClear, match } = this.props;
        const { isGettingReservedDates, isPlanningQuarter, planQuarterFormItems, currentWatchedReservedDate } = this.state;
        
        return (
            <React.Fragment>
            <LoadHandlingWrapper closePrompt={this.closeErrorPrompt} errors={getDatesErrors} 
            operationStatus={getDatesStatus} isLoading={isGettingReservedDates}>
                <div className="plan-quarter-container">
                    <div className="dates">
                        <List functionsToUse={this.selectDateFromList} shouldAnimateList functionsToUse={functionsToUseForDates} listClass="calendar-list" listTitle="Zajęte daty" component={CalendarItem} items={reservedDates} />
                    </div>
                    <div className="plan-quarter-form">
                        {currentWatchedReservedDate && 
                        <div className="hours-wich-are-able-use">
                            {currentWatchedReservedDate.date}
                        </div>
                        }
                        
                        <Form
                            btnTitle="Zaplanuj"
                            shouldSubmit
                            onSubmit={this.planQuarterHandler}
                            isLoading={isPlanningQuarter}
                            formItems={planQuarterFormItems}
                            enableButtonAfterTransactionEnd
                            submitResult={{
                                status: planQuarterStatus,
                                content: planQuarterStatus ? "Pomyślnie zaplanowano rozmowę kwartalną" :
                                    planQuarterErrors[0]
                            }}
                        />
                    </div>
                </div>   
            </LoadHandlingWrapper>    
            {authStatus === false && 
                <OperationStatusPrompt 
                closePrompt={authOneDriveClear}
                operationPromptContent={authErrors[0]}
                operationPrompt={authStatus}
                />
            }            
            
            </React.Fragment>
           
        );
    }
}

const mapStateToProps = state => {
    return {
        reservedDates: state.quarterTalks.reservedDates,
        getDatesStatus: state.quarterTalks.getDatesStatus,
        getDatesErrors: state.quarterTalks.getDatesErrors,

        planQuarterStatus: state.quarterTalks.planQuarterStatus,
        planQuarterErrors: state.quarterTalks.planQuarterErrors,

        oneDriveToken: state.authReducer.oneDriveToken,

        authStatus: state.oneDriveReducer.authStatus,
        authErrors: state.oneDriveReducer.authErrors

    }
}

const mapDispatchToProps = dispatch => {
    return {
        planQuarterACreator: (employeeId, formItems, token) => dispatch(planQuarterACreator(employeeId, formItems, token)),
        getReservedDatesACreator: (employeeId, oneDriveToken) => dispatch(getReservedDatesACreator(employeeId, oneDriveToken)),
        clearReservedDate: () => dispatch(getReservedDates([], null, [])),
        clearPlanQuarter: () => dispatch(planQuarter(null, [])),
        authOneDriveACreator: () => dispatch(authOneDriveACreator(true)),
        authOneDriveClear: () => dispatch(authOneDrive(null, [], ""))

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PlanQuarter);