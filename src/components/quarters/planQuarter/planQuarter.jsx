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
import { pushMomentValuesDynamicly } from '../../../services/methods.js';
import Hour from '../others/hour/hour';
import _ from 'lodash';
import { translate } from 'react-translate';

const functionsToUseForDates = [
    {name: "search", searchBy: "date", count: true }, 
    {name: "sort", sortBy: "date"}
];

const invalidOneDriveTokenError = "Nieprawidłowy token autoryzanyjny do usługi Outlook Calendar.";
const invalidTokenErrorTranslated = "Invalid authentication token for Outlook Calendar service.";

class PlanQuarter extends React.PureComponent{
    state = {
        isGettingReservedDates: true,
        isPlanningQuarter: false,
        hoursToUse: [],
        planQuarterFormItems: [
        { title: this.props.t("PlannedDate"), mode: 'date-picker', error: "", locale: this.props.t("Language"), 
            callBackFunc: () => this.generateHoursToUse(), value: moment().locale(this.props.t("Language")).add(1, 'days'), canBeNull: false, checkIfDateIsfromPast: true },
        {
            title: this.props.t("PlannedHour"), value: "", error: "", canBeNull: false,
            type: "time", mode: "text", inputType: "number"
        },
        {
          title: this.props.t("Quarter"), mode: "select", value: "1",
          placeholder: this.props.t("ChooseOrSelectQuarter"),
          selectValues: ["1", "2", "3", "4"]
        },
        {
            title: this.props.t("Year"), mode: "type-and-select", value: "", error: "", canBeNull: false,
            inputType: "strongNumber",
            placeholder: this.props.t("YearHolder"),
            dataToMap: pushMomentValuesDynamicly(5, moment().format('YYYY-MM-DD'), 1, 'years', "YYYY")
        }
        
      ]

    }
    generateHoursToUse = () => {
        const { reservedDates } = this.props;
        const { planQuarterFormItems } = this.state;
        if(planQuarterFormItems[0].error){
            this.setState({hoursToUse: []});
        }
        else{
            const currentSelectedDate = planQuarterFormItems[0].value.format("YYYY-MM-DD");;

            const datesWhichAreEqualToSelected = reservedDates.filter(date => (date.date === currentSelectedDate));
            
            let hoursToUse = pushMomentValuesDynamicly(16, "2000-12-19 06:00", 1, 'hours', "HH:mm");
            const resultArray = [];
            if(datesWhichAreEqualToSelected.length > 0){
                for(let key in datesWhichAreEqualToSelected){
                    const startsAt = moment(datesWhichAreEqualToSelected[key].dateAndTime);
                    const endsAt = moment(datesWhichAreEqualToSelected[key].date + " " + datesWhichAreEqualToSelected[key].willLastTo);
                    hoursToUse.forEach(function(element, index){
                        const time = moment(datesWhichAreEqualToSelected[key].date + " " + element.name);
                        const isTimeAfterStartsAt = time.isSameOrAfter(startsAt);
                        const isTimeBeforeEndsAt = time.isSameOrBefore(endsAt);
                        
                        const isElementAlreadyAdded = resultArray.findIndex(i => i.name === element.name);
                        if((!isTimeAfterStartsAt || !isTimeBeforeEndsAt) && isElementAlreadyAdded === -1){
                            resultArray.push(element);
                        }
                    })
                }
                this.setState({hoursToUse: _.orderBy(resultArray, "name")});
            }
            else{
                this.setState({hoursToUse});
            }
        }
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
        const { location, currentWatchedUser, clearPlanQuarter } = this.props;
        if(prevProps.location.search !== location.search){
            const planQuarterFormItems = [...this.state.planQuarterFormItems];
            planQuarterFormItems[1].value = "";
            planQuarterFormItems[3].value = "";
            this.setState({isGettingReservedDates: true, hoursToUse: [], planQuarterFormItems});
            clearPlanQuarter();
            this.getReservedDates(currentWatchedUser);
        }
    }

    getReservedDates = employeeId => {
        const { getReservedDatesACreator, oneDriveToken, authOneDriveACreator, changeLinkBeforeRedirect, location, t } = this.props;
        getReservedDatesACreator(employeeId, oneDriveToken, t("Language"))
        .then(() => this.setState({isGettingReservedDates: false}, () => this.generateHoursToUse()))
        .catch(error => {
            if(error[0] === invalidOneDriveTokenError || error[0] === invalidTokenErrorTranslated){
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

    render(){
        const { planQuarterStatus, planQuarterErrors, reservedDates, getDatesErrors, getDatesStatus, 
            clearReservedDate, authStatus, authErrors, authOneDriveClear, match, t } = this.props;
        const { isGettingReservedDates, isPlanningQuarter, planQuarterFormItems, hoursToUse } = this.state;
        
        return (
            <React.Fragment>
            <LoadHandlingWrapper closePrompt={this.closeErrorPrompt} errors={getDatesErrors} 
            operationStatus={getDatesStatus} isLoading={isGettingReservedDates}>
                <div className="plan-quarter-container">
                    <div className="dates">
                        <List functionsToUse={functionsToUseForDates} 
                        componentProps={{
                            minutes: t("Minutes"),
                            to: t("To"),
                            from: t("From")
                        }}
                        shouldAnimateList listClass="calendar-list" listTitle={t("OccupiedDates")} component={CalendarItem} items={reservedDates} />
                    </div>
                    <div className="plan-quarter-form">
                        <h2>
                            {t("QuarterTalksDetails")}
                        </h2>
                        <Form
                            btnTitle={t("Plan")}
                            shouldSubmit
                            inputContainerClass="column-container"
                            onSubmit={this.planQuarterHandler}
                            isLoading={isPlanningQuarter}
                            formItems={planQuarterFormItems}
                            enableButtonAfterTransactionEnd
                            submitResult={{
                                status: planQuarterStatus,
                                content: planQuarterStatus ? t("SuccPlannedQuarter") :
                                    planQuarterErrors[0]
                            }}
                        />
                    </div>
                    <div className="hours-to-use-container">
                        <List
                        shouldAnimateList listClass="question-list" listTitle={t("SugestedHours")}
                        component={Hour} items={hoursToUse} />
                      
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
        getReservedDatesACreator: (employeeId, oneDriveToken, locale) => dispatch(getReservedDatesACreator(employeeId, oneDriveToken, locale)),
        clearReservedDate: () => dispatch(getReservedDates([], null, [])),
        clearPlanQuarter: () => dispatch(planQuarter(null, [])),
        authOneDriveACreator: () => dispatch(authOneDriveACreator(true)),
        authOneDriveClear: () => dispatch(authOneDrive(null, [], ""))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(translate("Quaters")(PlanQuarter));