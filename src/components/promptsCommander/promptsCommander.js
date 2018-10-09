import React from 'react'
import './promptsCommander.scss';
import { connect } from 'react-redux';
import { changeShowGlobal, setProgressValue } from '../../actions/progressBarActions';
import { generateReport } from '../../actions/reportsActions';
import SideBarProgressContent from './sideBarProgressContent';
import SmallProgressBar from './smallProgressBar/smallProgressBar';
import { deleteNotification, deleteNotificationACreator, 
    markNotificationAsRead, markNotificationAsReadACreator,
    deleteAllNotifications, deleteAllNotificationsACreator,
    markAllNotificationsAsRead, markAllNotificationsAsReadACreator
} from './../../actions/notificationActions';
import { axios } from 'axios';
import { authReducer } from './../../reducers/authReducer';

class PromptsCommander extends React.Component{
    state = {
        currentDeletedElements: [],
        currentReadElements: [],
        deleteAllSpin: false,
        readAllSpin: false
    }
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
    handleDelete = (notificationId) => {
        this.setState({currentDeletedElements: [...this.state.currentDeletedElements, notificationId]});
        const notifications = [notificationId];
        this.props.deleteNotificationACreator(notifications);
    };
    handleMarkAsRead = (notificationId) => {
        this.setState({currentReadElements: [...this.state.currentReadElements, notificationId]});
        this.props.markNotificationAsReadACreator(notificationId);
    };
    handleDeleteAll = () => {
        this.setState({deleteAllSpin: true});
        this.props.deleteAllNotificationsACreator();
    };
    handleMarkAllAsRead = () => {
        this.setState({readAllSpin: true});
        this.props.markAllNotificationsAsReadACreator().then(() => {
            this.setState({readAllSpin: false});
        }).catch(() => this.setState({readAllSpin: false }));
    };

    render(){
        const { shouldShowGlobal, changeShowGlobal, isStarted, percentage, message,
            operationName, connectingSinalRStatus, connectionSignalRErrors, 
            generateReportStatus, generateReportErrors, barType, gDriveLoginStatus,
            oneDriveLoginStatus, notifications, language, numberOfNotifications } = this.props;
        const { currentDeletedElements, currentReadElements, deleteAllSpin, readAllSpin } = this.state;
        return (
            <React.Fragment>
                {barType === undefined ? 
                    <SideBarProgressContent 
                    currentDeletedElements={currentDeletedElements}
                    currentReadElements={currentReadElements}
                    deleteAllSpin={deleteAllSpin}
                    readAllSpin={readAllSpin}
                    notifications={notifications}
                    numberOfNotifications={numberOfNotifications}
                    oneDriveLoginStatus={oneDriveLoginStatus}
                    gDriveLoginStatus={gDriveLoginStatus}
                    message={message}
                    shouldShowGlobal={shouldShowGlobal}
                    createClassesForLoader={this.createClassesForLoader} percentage={percentage}
                    generateReportStatus={generateReportStatus}
                    isStarted={isStarted} operationName={operationName}
                    generateReportErrors={generateReportErrors}
                    togleSideBarHandler={this.togleSideBarHandler}
                    language={language}
                    handleDelete={this.handleDelete}
                    handleMarkAsRead={this.handleMarkAsRead}
                    handleDeleteAll={this.handleDeleteAll}
                    handleMarkAllAsRead={this.handleMarkAllAsRead}
                     /> : 

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
        generateReportErrors: state.reportsReducer.generateReportErrors,

        oneDriveLoginStatus: state.authReducer.oneDriveToken,
        gDriveLoginStatus: state.persistHelpReducer.loginStatus,

        notifications: state.notificationReducer.notifications,
        getNotificationStatus: state.notificationReducer.getNotificationStatus,
        getNotificationErrors: state.notificationReducer.getNotificationErrors,

        language: state.languageReducer.language,
        numberOfNotifications: state.authReducer.notifications
        
    };
  };
  const mapDispatchToProps = dispatch => {
    return {
        changeShowGlobal: (shouldShowGlobal) => dispatch(changeShowGlobal(shouldShowGlobal)),
        setProgressValue: (percentage, message) => dispatch(setProgressValue(percentage, message)),
        generateReportClearData: (status, errors) => dispatch(generateReport(status, errors)),

        deleteNotificationACreator: name => dispatch(deleteNotificationACreator(name)),
        deleteNotification: (status, errors) => dispatch(deleteNotification(status, errors)),

        markNotificationAsReadACreator: name => dispatch(markNotificationAsReadACreator(name)),
        markNotificationAsRead: (status, errors) => dispatch(markNotificationAsRead(status, errors)),

        deleteAllNotificationsACreator: name => dispatch(deleteAllNotificationsACreator(name)),
        deleteAllNotifications: (status, errors) => dispatch(deleteAllNotifications(status, errors)),

        markAllNotificationsAsReadACreator: name => dispatch(markAllNotificationsAsReadACreator(name)),
        markAllNotificationsAsRead: (status, errors) => dispatch(markAllNotificationsAsRead(status, errors))
    };
  };
  export default connect(mapStateToProps, mapDispatchToProps)(PromptsCommander);
  
