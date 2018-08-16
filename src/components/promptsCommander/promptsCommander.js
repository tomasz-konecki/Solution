import React from 'react'
import './promptsCommander.scss';
import { connect } from 'react-redux';
import { changeShowGlobal, setProgressValue } from '../../actions/progressBarActions';
import { generateReport } from '../../actions/reportsActions';
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
    render(){
        const { shouldShowGlobal, changeShowGlobal, isStarted, percentage, message,
            operationName, connectingSinalRStatus, connectionSignalRErrors, 
            generateReportStatus, generateReportErrors} = this.props;
        const menuClass = shouldShowGlobal ? "menu-expanded" : "menu-collapsed";
        const btnClass = shouldShowGlobal ? "btn-expanded" : "btn-collapsed";

        const btnBorderClass = isStarted ?
            this.createClassesForLoader(percentage) : null;
        
        const btnResultClass = generateReportStatus ? "btn-finalized" : generateReportStatus === false ? "btn-op-failed" : null;

        const btnIcon = generateReportStatus ? "fa-check" : generateReportStatus === false ? "fa-times" : "fa-bell";
        return (
            <React.Fragment>
                <div className={`comunicates-window ${menuClass}`}>
                    <header>
                        <span>Powiadomienia</span>
                    </header>
                    <ul className="notifictions">
                        {items.map(i => {
                            return (
                                <li key={i.name}>
                                    <i className={`fa ${i.isShowed ? "fa-check" : "fa-times"}`}></i>
                                    <div className="not-content">
                                        <b>{i.name}</b> {i.content}
                                        <p>{i.date} <b>1000 dni temu</b></p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    
                    <footer>
                        <button className="showed-btn">
                            Odczytane <i className="fa fa-check"></i>
                        </button>
                        <button className="not-showed-btn">
                            Nieodczytane <i className="fa fa-times"></i>
                        </button>
                    </footer>
                    <div className="operations-messages">
                        {isStarted && shouldShowGlobal && 
                            <article>
                                {operationName}  {(percentage)}%<b> {message}</b>
                            </article>
                        }
                        {generateReportStatus !== null && 
                            <p className={generateReportStatus ? "status-ok" : "status-off"}>{generateReportStatus ? 
                                "Pomyślnie wygenerowano raport" :
                                generateReportErrors[0]}</p>
                        }
                    </div>
                </div> 
               
                <button title="Komunikaty" 
                    onClick={this.togleSideBarHandler} 
                    className={`comunicates-btn ${btnResultClass} ${btnClass} ${btnBorderClass}`}>
                    <i className={`fa ${btnIcon}`}></i>
                    <div/>
                </button>
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
  
