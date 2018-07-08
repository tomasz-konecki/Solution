import React, { Component } from 'react'
import './table.scss';
import moment from 'moment';
import Hoc from '../../../services/auxilary';
import Modal from 'react-responsive-modal';
import Form from 'components/form/form';
import { connect } from 'react-redux';
import { addFeedbackACreator, getFeedbacksACreator } from '../../../actions/projectsActions';
import Spinner from 'components/common/spinner/spinner';
import Axios from 'axios';
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
        isLoadingFeeds: false, 
        helpData: []
    }
    componentDidMount(){
        const trs = this.populateTrs(this.props.items);
        this.setState({trs: trs, currentTrs: trs});
        Axios.get("https://jsonplaceholder.typicode.com/posts").then(response => {
            this.setState({helpData: response.data});
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.items !== this.props.items){
            const trs = this.populateTrs(nextProps.items);
            this.setState({trs: trs, currentTrs: trs});
        }
        else if(nextProps.addFeedbackErrors !== this.props.addFeedbackErrors)
            this.setState({isLoading: false});
        else if(nextProps.loadFeedbackErrors !== this.props.loadFeedbackError)
            this.setState({isLoadingFeeds: false});
        
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
            teamRows.push(
                <tr key="uniq" className="detail-table-header">
                    <td>
                        <ul className="detail-team-list">
                            <h5>{this.props.items[id].email} 
                                <b>
                                    <i id="str-date">Data rozpoczęcia: {this.props.items[id].startDate.slice(0, 10)}</i>
                                    <i id="ed-date">Data zakończenia: {this.props.items[id].endDate.slice(0, 10)}</i>
                                </b>
                            </h5>
                            <li>Dodany do projektu przez: <b>{this.props.items[id].createdBy}</b> w <i className="moment-date">
                                {this.props.items[id].createdAt.slice(0, 10)}
                              ({moment().diff(this.props.items[id].createdAt.slice(0, 10), 'days')} dni temu)</i></li>
                            
                            <p>Lista obowiązków: </p>
                            <li className="responsibilities-list">
                                {this.props.items[id].responsibilities.map(i => {
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

    addFeedback = () => {
        this.setState({isLoading: true});
        this.props.addFeedback(this.props.projectId, this.props.items[this.state.currentOpenedRowId].employeeId, 
            this.state.feedbackItems[0].value);
    }
    getFeedbacks = () => {
        this.setState({opinionModal: true, modalType: false, isLoadingFeeds: true});
        this.props.getFeedbacks(this.props.items[this.state.currentOpenedRowId].employeeId);
    }
    changeModal = () => {
       if(this.state.modalType && this.props.loadedFeedbacks.length === 0){
        this.setState({isLoadingFeeds: true, modalType: false});
        this.props.getFeedbacks(this.props.items[this.state.currentOpenedRowId].employeeId);
       }
       else
        this.setState({modalType: true});
    }
    /*
    Tego uzyje jak chlopaki zrobia na backendzie
     {this.state.isLoadingFeeds ? 
        <Spinner /> : 
        this.props.loadFeedbackStatus ? 
            <ul>
                {this.props.loadedFeedbacks.map(j => {
                    <li>
                        ddsa
                    </li>
                })}
            </ul>

            : 
        <p className="empty-list-err">{this.props.loadFeedbackErrors[0]}</p>
    }*/
    render(){
        const errorValue = this.props.addFeedbackErrors && this.props.addFeedbackErrors.length > 0 ? 
            this.props.addFeedbackErrors[0] : "";
        return (
            <div className="table-container">
            {this.props.items && 
                this.props.items.length > 0 ? 
                <Hoc>
                    <h3>{this.props.title}</h3>
                    <table>
                        <thead>
                            <tr>
                                {this.props.thds.map(i => {
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
                    <button onClick={this.props.togleAddEmployeeModal} className="add-programmer-btn">
                        Dodaj 
                    </button>   
                </Hoc> : 
                 <div className="empty-project-squad">
                    <div>
                        <span>{this.props.emptyMsg}</span>
                        <i onClick={this.props.togleAddEmployeeModal} className="fa fa-user-plus"></i>
                    </div>
                </div>
                }
                
                {this.state.currentOpenedRowId !== null && 
                
                <Modal
                    key={1}
                    open={this.state.opinionModal}
                    classNames={{ modal: "Modal Modal-add-owner" }}
                    contentLabel="Employee opinion modal"
                    onClose={() => this.setState({opinionModal: !this.state.opinionModal})}>
                    
                    <div className="opinion-container">
                        <header>
                            <h3 className="section-heading">{this.state.modalType ? 
                            "Dodaj opinie o pracowniku" : "Lista opini o pracowniku"}</h3>
                        </header>
                        
                        {this.state.modalType ? 
                            <div className="add-opinion-container">
                                <Form
                                transactionEnd={this.props.addFeedbackStatus}
                                btnTitle="Dodaj opinie"
                                shouldSubmit={true}
                                submitResult={
                                    {content: errorValue, 
                                    status: this.props.addFeedbackStatus}
                                }
                                onSubmit={this.addFeedback}
                                error={errorValue}
                                isLoading={this.state.isLoading}
                                formItems={this.state.feedbackItems} 
                                >
                                </Form>

                            </div> :
                            <div className="opinion-list-container">
                               <ul>
                                   {this.state.helpData.map(j => {
                                       return (
                                           <li key={j.id}>
                                                <p>Data dodania: 19-12-1994 16:45</p>
                                                <p>{j.body}</p>
                                            </li>
                                       );
                                   })}
                               </ul>

                            </div>
                        }
                        <button onClick={this.changeModal} className="show-opinions-btn">
                            {this.state.modalType ? "Pokaż opinie" : "Dodaj opinie"}
                        </button>
                    </div>
                </Modal>                          
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
        getFeedbacks: (employeeId) => dispatch(getFeedbacksACreator(employeeId))
    };
  }
       
export default connect(mapStateToProps, mapDispatchToProps)(Table);
  