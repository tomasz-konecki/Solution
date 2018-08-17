import React from 'react'
import './promptsCommander.scss';
import { connect } from 'react-redux';
import { changeShowGlobal, setProgressValue } from '../../actions/progressBarActions';
import { generateReport } from '../../actions/reportsActions';
import SideBarProgressContent from './sideBarProgressContent';
import SmallProgressBar from './smallProgressBar/smallProgressBar';
const items = [
    {name: "Powiadomienie 1", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: true},
    {name: "Powiadomienie 2", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: true},
    {name: "Powiadomienie 3", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: true},
    {name: "Powiadomienie 4", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: false},
    {name: "Powiadomienie 5", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: false},
    {name: "Powiadomienie 6", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: true},
    {name: "Powiadomienie 7", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: true},
    {name: "Powiadomienie 8", content: "dasd asds asdsa sad sasa as asdsa sasa asdsadasdadsadsdsa dsad asa sadasd as sa...", date: "19-12-1994 16:45", 
    isShowed: true}
]
class PromptsCommander extends React.Component{
    componentDidMount(){
        if(!this.props.barType)
            window.addEventListener('beforeunload', this.handleExitFromPageWhenGeneratingReport);
    }
    handleExitFromPageWhenGeneratingReport = e => {
        if(this.props.isStarted){
            const confirmationMessage = '';
            e.returnValue = confirmationMessage;
            return confirmationMessage;   
        }
    }
    componentDidUpdate(){
        if(this.props.generateReportStatus && this.props.percentage === 100)
            this.props.setProgressValue(0, "");
    }
    togleSideBarHandler = () => { 
        const { changeShowGlobal, shouldShowGlobal, generateReportClearData, generateReportStatus } = this.props;
        changeShowGlobal(!shouldShowGlobal);
        if(generateReportStatus !== null && shouldShowGlobal)
            generateReportClearData(null, []);
    }
    createClassesForLoader = currentPercentage => {
        if(currentPercentage < 50)
            return "btn-br-top";
        else if(currentPercentage < 75)
            return "btn-br-right";
        else if(currentPercentage < 100)
            return "btn-br-bot";
        else if(currentPercentage === 100)
            return "btn-br-left";
        else return "";
    }
    componentWillUnmount() {
        if(!this.props.barType)
            window.removeEventListener('beforeunload', this.handleExitFromPageWhenGeneratingReport);
    }
    render(){
        const { shouldShowGlobal, changeShowGlobal, isStarted, percentage, message,
            operationName, connectingSinalRStatus, connectionSignalRErrors, 
            generateReportStatus, generateReportErrors, barType } = this.props;
        return (
            <React.Fragment>
                {barType === undefined ? 
                    <SideBarProgressContent 
                    items={items} message={message}
                    shouldShowGlobal={shouldShowGlobal}
                    createClassesForLoader={this.createClassesForLoader} percentage={percentage}
                    generateReportStatus={generateReportStatus}
                    isStarted={isStarted} operationName={operationName}
                    generateReportErrors={generateReportErrors}
                    togleSideBarHandler={this.togleSideBarHandler} /> : 

                    <SmallProgressBar message={message} percentage={percentage} />
                }
                
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        shouldShowGlobal: state.progressBarReducer.shouldShowGlobal,
        isStarted: state.progressBarReducer.isStarted,
        operationName: state.progressBarReducer.operationName,
      
        connectingSinalRStatus: state.progressBarReducer.connectingSinalRStatus,
        connectionSignalRErrors: state.progressBarReducer.connectionSignalRErrors,
        
        percentage: state.progressBarReducer.percentage,
        message: state.progressBarReducer.message,

        generateReportStatus: state.reportsReducer.generateReportStatus,
        generateReportErrors: state.reportsReducer.generateReportErrors
    };
  };
  const mapDispatchToProps = dispatch => {
    return {
        changeShowGlobal: (shouldShowGlobal) => dispatch(changeShowGlobal(shouldShowGlobal)),
        setProgressValue: (percentage, message) => dispatch(setProgressValue(percentage, message)),
        generateReportClearData: (status, errors) => dispatch(generateReport(status, errors))
        
    };
  };
  export default connect(mapStateToProps, mapDispatchToProps)(PromptsCommander);
  
