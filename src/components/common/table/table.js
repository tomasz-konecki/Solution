import React, { Component } from 'react'
import './table.scss';
import moment from 'moment';
import Hoc from '../../../services/auxilary';
import Modal from 'react-responsive-modal';
import Form from 'components/form/form';
import { connect } from 'react-redux';
import { addFeedbackACreator, getFeedbacksACreator, addFeedback, getFeedbacks } from '../../../actions/projectsActions';
import Spinner from 'components/common/spinner/spinner';
import OperationStatusPrompt from '../../form/operationStatusPrompt/operationStatusPrompt';
import { withRouter } from 'react-router-dom';

class Table extends Component{
    state = {
        trs: [], 
        currentTrs: [],
        currentOpenedRowId: null,
        opinionModal: false,
        modalType: false,
        feedbackItems: [
            {title: "Opinia", type: "text", placeholder: "dodaj opinie o pracowniku...", 
            mode: "textarea", value: "", error: "", inputType: null, minLength: 3, maxLength: 1500, canBeNull: false}
        ],
        isLoading: false,
        helpData: []
    }
    componentDidMount(){
        const trs = this.populateTrs(this.props.items);
        this.setState({trs: trs, currentTrs: trs});
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.items !== this.props.items){
            const trs = this.populateTrs(nextProps.items);
            this.setState({trs: trs, currentTrs: trs, isLoading: false});
        }
        else if(nextProps.addFeedbackErrors !== this.props.addFeedbackErrors || 
            nextProps.loadFeedbackErrors !== this.props.loadFeedbackError){
            this.setState({isLoading: false});
        }
    }
    closeCurrentOpenedRow = () => {
        const currentTrs = [...this.state.currentTrs];
        for(let i = 0; i < currentTrs.length; i++)
            if(currentTrs[i].key === "uniq"){
                currentTrs.splice(i, 1);
                break;
            }
        
        this.setState({currentTrs: currentTrs, currentOpenedRowId: null});
    }
    pushUserDetailsIntoTableDOM = id => {
        if(this.state.currentOpenedRowId !== null && 
            id === this.state.currentOpenedRowId)
            this.closeCurrentOpenedRow();

        else{
            const teamRows = [];
            for(let i = 0; i <= id; i++){
                teamRows.push(this.state.trs[i]);
            }
            const { items, history } = this.props;
            teamRows.push(
                <tr key="uniq" className="detail-table-header">
                    <td>
                        <ul className="detail-team-list">
                            <h5><span onClick={() => history.push(`/main/employees/${items[id].employeeId}`)}>
                                {items[id].email} <i className="fa fa-info-circle"></i></span>
                                <b>
                                    <i id="str-date">Data rozpoczęcia: {items[id].startDate.slice(0, 10)}</i>
                                    <i id="ed-date">Data zakończenia: {items[id].endDate.slice(0, 10)}</i>
                                </b>
                            </h5>
                            <li>Dodany do projektu przez: <b>{items[id].createdBy}</b> w <i className="moment-date">
                                {items[id].createdAt.slice(0, 10)}
                              ({moment().diff(items[id].createdAt.slice(0, 10), 'days')} dni temu)</i></li>
                            
                            <p>Lista obowiązków: </p>
                            <li className="responsibilities-list">
                                {items[id].responsibilities.map(i => {
                                    return <i key={i}>{i}</i>
                                })}

                            </li>    
                            
                        </ul>
                        <button onClick={() => this.setState({opinionModal: true, modalType: true})}
                        className="option-btn green-btn">Dodaj opinie</button>
                        <button className="option-btn green-btn" onClick={this.getFeedbacks}>Zobacz opinie</button>
                    </td>
                </tr>
            );
            for(let i = id+1; i < this.state.trs.length; i++)
                teamRows.push(this.state.trs[i]);
            this.setState({currentTrs: teamRows, currentOpenedRowId: id});
        }
    }
    populateTrs = items => {
        const trs = [];
        for(let i = 0 ; i < items.length; i++){
            const trItem = (
                <tr onClick={() => this.pushUserDetailsIntoTableDOM(i)} key={i}>
                    <td>{items[i].firstName + " " + items[i].lastName}</td>
                    <td>{items[i].role}</td>
                    <td>{items[i].seniority}</td>
                    <td>{items[i].title}</td>
                    <td>{items[i].startDate.slice(0, 10)}</td>
                    <td>{items[i].endDate.slice(0, 10)}</td>
                </tr>
            );
            trs.push(trItem);
        }
        return trs;
    }

    addFeedbackHandler = () => {
        this.setState({isLoading: true});
        const { addFeedback, projectId, items } = this.props;
        const { currentOpenedRowId, feedbackItems } = this.state;
        addFeedback(projectId, items[currentOpenedRowId].employeeId, 
            feedbackItems[0].value);
    }
    getFeedbacks = () => {
        this.setState({opinionModal: true, modalType: false, isLoading: true});
        this.props.getFeedbacks(this.props.items[this.state.currentOpenedRowId].employeeId);
    }
    changeModal = () => {
       const { modalType, currentOpenedRowId } = this.state;
       const { getFeedbacks, items } = this.props;

      this.clearData();

       if(modalType){
           this.setState({isLoading: true, modalType: false});
           getFeedbacks(items[currentOpenedRowId].employeeId);
       }
       else
        this.setState({modalType: true});
    }
    clearData = () => {
        const { addFeedbackStatus, loadFeedbackStatus, addFeedbackClear, getFeedbacksClear } = this.props;
        if(addFeedbackStatus !== null && addFeedbackStatus !== undefined) addFeedbackClear(null, []);
        
        if(loadFeedbackStatus !== null && loadFeedbackStatus !== undefined) getFeedbacksClear([], null, []);
    }
    closeModal = () => {
        this.clearData();
        this.setState({opinionModal: !this.state.opinionModal})
    }
    componentWillUnmount() { this.clearData(); }
    
    render(){
        const { addFeedbackStatus, addFeedbackErrors, loadedFeedbacks, loadFeedbackStatus, 
            loadFeedbackErrors, items, thds, title, togleAddEmployeeModal, emptyMsg } = this.props;
        const {modalType} = this.state;
        return (
            <div className="table-container">
            {items && 
                items.length > 0 ? 
                <Hoc>
                    <h3>{title}</h3>
                    <table>
                        <thead>
                            <tr>
                                {thds.map(i => {
                                    return <th key={i}>{i}</th>
                                })}
                            </tr>                                       
                        </thead>
                        <tbody>
                            {this.state.currentTrs.map(i => {
                                return i;
                            })}
                        </tbody>
                    </table>
                    <button onClick={togleAddEmployeeModal} className="add-programmer-btn">
                        Dodaj 
                    </button>   
                </Hoc> : 
                 <div className="empty-project-squad">
                    <div>
                        <span>{emptyMsg}</span>
                        <i onClick={togleAddEmployeeModal} className="fa fa-user-plus"></i>
                    </div>
                </div>
                }
                
                {this.state.currentOpenedRowId !== null && 
                
                <Modal
                    key={1}
                    open={this.state.opinionModal}
                    classNames={{ modal: "Modal Modal-add-owner" }}
                    contentLabel="Employee opinion modal"
                    onClose={this.closeModal}>
                    
                    <div className="opinion-container">
                        <header>
                            <h3 className="section-heading">{modalType ? 
                            "Dodaj opinie o pracowniku" : "Lista opini o pracowniku"}</h3>
                        </header>
                        
                        {modalType ? 
                            <div className="add-opinion-container">
                                <Form
                                transactionEnd={this.props.addFeedbackStatus}
                                btnTitle="Dodaj opinie"
                                shouldSubmit={true}
                                onSubmit={this.addFeedbackHandler}
                                isLoading={this.state.isLoading}
                                formItems={this.state.feedbackItems} 
                                >
                                </Form>

                            </div> :

                            this.state.isLoading ? <Spinner /> : 
                            loadFeedbackStatus && 
                            loadedFeedbacks.length > 0 ? 
                            <div className="opinion-list-container">
                               <ul>
                                   {loadedFeedbacks.map(j => {
                                       return (
                                           <li key={j.id}>
                                                <p>Autor: {j.author} => {j.client}</p>
                                                <p>{j.description}</p>
                                            </li>
                                       );
                                   })}
                               </ul>

                            </div>
                            : <p className="empty-opinions">Brak opini o tym pracowniku</p>
                        }
                        <button onClick={this.changeModal} className="show-opinions-btn">
                            {modalType ? "Pokaż opinie" : "Dodaj opinie"}
                        </button>
                    </div>
                </Modal>                          
                }
               
                {
                    addFeedbackStatus !== null && addFeedbackStatus !== undefined &&  
                    <OperationStatusPrompt
                    operationPromptContent={
                        addFeedbackStatus
                        ? "Pomyślnie dodano opinie"
                        : addFeedbackErrors &&
                        addFeedbackErrors[0]
                    }
                    operationPrompt={addFeedbackStatus}
                    />
                }
                
        </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        addFeedbackStatus: state.projectsReducer.addFeedbackStatus,
        addFeedbackErrors: state.projectsReducer.addFeedbackErrors,
        
        loadedFeedbacks: state.projectsReducer.loadedFeedbacks,
        loadFeedbackStatus: state.projectsReducer.loadFeedbackStatus,
        loadFeedbackErrors: state.projectsReducer.loadFeedbackErrors
    };
  }
  
const mapDispatchToProps = dispatch => {
    return {
        addFeedback: (projectId, employeeId, description) => dispatch(addFeedbackACreator(projectId, employeeId, description)),
        getFeedbacks: (employeeId) => dispatch(getFeedbacksACreator(employeeId)),
        addFeedbackClear: (status, errors) => dispatch(addFeedback(status, errors)),
        getFeedbacksClear: (loadedFeedbacks, loadFeedbackStatus, loadFeedbackErrors) => dispatch(getFeedbacks(loadedFeedbacks, loadFeedbackStatus, loadFeedbackErrors))
    };
  }
       
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Table));
  