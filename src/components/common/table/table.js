import React, { Component } from 'react'
import './table.scss';
import moment from 'moment';
import Hoc from '../../../services/auxilary';
class Table extends Component{
    state = {
        trs: [], 
        currentTrs: [],
        currentOpenedRowId: null
    }
    componentDidMount(){
        const trs = this.populateTrs(this.props.items);
        this.setState({trs: trs, currentTrs: trs});
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.items !== this.props.items){
            const trs = this.populateTrs(nextProps.items);
            this.setState({trs: trs, currentTrs: trs});
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
                            <li>
                                {this.props.items[id].responsibilities.map(i => {
                                    return <i key={i}>{i}</i>
                                })}

                            </li>    
                            
                        </ul>
                        <button onClick={this.props.showOpinions} 
                        className="option-btn green-btn">Sprawdź opinie</button>
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
    render(){
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
            
                                                  
        </div>
        );
    }
}

export default Table;