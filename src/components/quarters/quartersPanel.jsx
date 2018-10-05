import React from 'react'
import './quartersPanel.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch, Redirect } from 'react-router-dom';
import Button from '../common/button/button.js';
import EmployeeQuarters from './employeeQuarters/employeeQuarters';
import AddQuarter from './addQuarter/addQuarter';
import Modal from 'react-responsive-modal';
import { createLastWatchedPersonsArray, changeLinkBeforeRedirect, changeCurrentWatchedUser } from '../../actions/persistHelpActions.js';
import { sendAuthCodePromise } from '../../actions/oneDriveActions.js';
import { getEmployeeId } from '../../services/methods.js';
import PlanQuarter from './planQuarter/planQuarter';
import AuthWithOutlook from './authWithOutlookComponent/authWithOutlookComponent';
const linkTypes = {
    "plan": "/employees/plan/",
    "addquarter": "/employees/addquarter/",
    "employee": "/employees/"
};

class Quarters extends React.PureComponent{
    state = {
        openFindUserModal: false
    }

    handleBtnClick = (urlToPush, isUrlWithParam) => {
        const { push } = this.props.history;
        const { currentWatchedUser } = this.props;
        if(isUrlWithParam){
            push(urlToPush + "/" + currentWatchedUser + "?=" + currentWatchedUser);
        }else{
            this.setState({openFindUserModal: true});
        }
    }

    changeActualWatchedUser = person => {
        const { history, match, changeCurrentWatchedUser } = this.props;
        const url = history.location;
        
        const isUrlWithParam = url.search !== "";
        for(let key in linkTypes){
            if(url.pathname.search(key) !== -1){
                changeCurrentWatchedUser(person);
                history.push(`${match.url}${linkTypes[key]}${person}?=${person}`);
                break;
            }
        }
           
    }
     
  
    render(){
        const { match, history, lastWatchedPersons, planQuarterACreator, 
            linkBeforeRedirectToOutlookAuth, changeLinkBeforeRedirect, sendAuthCodePromise,
            authCodeStatus, authCodeErrors, currentWatchedUser } = this.props;
        const { openFindUserModal, shouldLoadDataAfterLinkChange } = this.state;
        return (
            <div className="quarters-panel">
                <header><i className="fa fa-comments"></i>Panel rozmów kwartalnych</header>
                <div className="recent-watched">
                    {lastWatchedPersons.map(person => {
                        return (
                            <div onClick={() => this.changeActualWatchedUser(person)} className="last-watched-person" key={person}>
                                <span><i className="fa fa-user"></i></span>
                                <div>
                                    {person}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <nav>
                    <Button onClick={() => this.handleBtnClick(`${match.url}/employees`, true)} title="Rozmowy kwartalne" mainClass="generate-raport-btn btn-green"><i className="fa fa-users"/></Button>
                    <Button onClick={() => history.push(`${match.url}/employees`)} title="Użytkownicy" mainClass="generate-raport-btn btn-green"><i className="fa fa-users"/></Button>
                    <Button onClick={() => this.handleBtnClick(`${match.url}/employees/addquarter`, true)} title="Dodaj rozmowę" mainClass="generate-raport-btn btn-green"><i className="fa fa-users"/></Button>
                    <Button onClick={() => this.handleBtnClick(`${match.url}/employees/plan`, true)} title="Zaplanuj rozmowę" mainClass="generate-raport-btn btn-green"><i className="fa fa-users"/></Button>
                </nav>
                <div className="quarters-content">
                    <Switch>
                        <Route path={`${match.url}/employees/calendar/auth`} render={() => (
                            <AuthWithOutlook linkBeforeRedirectToOutlookAuth={linkBeforeRedirectToOutlookAuth} push={history.push}
                            authCodeStatus={authCodeStatus} authCodeErrors={authCodeErrors} match={match}
                            sendAuthCodePromise={sendAuthCodePromise} />
                        )}/>
                        <Route exact path={`${match.url}/employees/plan/:id`} render={() => (
                            <PlanQuarter currentWatchedUser={currentWatchedUser} location={history.location} planQuarterACreator={planQuarterACreator} match={match} 
                             redirectToLastWatchedPerson={this.handleBtnClick} changeLinkBeforeRedirect={changeLinkBeforeRedirect}/>
                        )}/>
                        <Route exact path={match.url + "/employees/addquarter/:id"} component={AddQuarter} />
                        <Route exact path={`${match.url}/employees/:id`} render={() => (
                            <EmployeeQuarters lastWatchedPersons={lastWatchedPersons} location={history.location} />
                        )}/>
                      
                        <Route exact path={`${match.url}/employees`} render={() => (
                            <div>Użytkownicy</div>
                        )}/>

                    </Switch>   
                </div>
                <Modal
                open={openFindUserModal}
                classNames={{ modal: `Modal Modal-add-project`}}
                contentLabel="Add project modal"
                onClose={() => this.setState({ openFindUserModal: false })}
                >
                <header>
                    <h3>Znajdź użytkownika do przeglądania</h3>
                </header>
                
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        lastWatchedPersons: state.persistHelpReducer.lastWatchedPersons,
        linkBeforeRedirectToOutlookAuth: state.persistHelpReducer.linkBeforeRedirectToOutlookAuth,

        authCodeStatus: state.authReducer.authCodeStatus,
        authCodeErrors: state.authReducer.authCodeErrors,

        currentWatchedUser: state.persistHelpReducer.currentWatchedUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createLastWatchedPersonsArray: (lastWatchedPersons) => dispatch(createLastWatchedPersonsArray(lastWatchedPersons)),
        changeLinkBeforeRedirect: (linkBeforeRedirectToOutlookAuth) => dispatch(changeLinkBeforeRedirect(linkBeforeRedirectToOutlookAuth)),
        sendAuthCodePromise: (url, shouldGoForOutlook) => dispatch(sendAuthCodePromise(url, shouldGoForOutlook)),
        changeCurrentWatchedUser: (currentWatchedUser) => dispatch(changeCurrentWatchedUser(currentWatchedUser))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Quarters));