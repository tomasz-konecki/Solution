import React from 'react'
import './employeeTable.scss';
import Spinner from '../../../common/spinner/small-spinner';

class EmployeeTable extends React.Component{
    state = {
        isLoadingData: true
    }
    componentDidMount(){
      this.props.loadAssignmentsACreator();
    }
    componentWillReceiveProps(nextProps){
      if(this.props.loadAssignmentsErrors !== nextProps.loadAssignmentsErrors)
        this.setState({isLoadingData: false});
    }
    
    render(){
        const { isLoadingData } = this.state;
        const { tableTitle, loadAssignmentsStatus, 
            loadAssignmentsErrors, loadedAssignments, loadAssignmentsClear } = this.props;
        
        return (
            <div className="employee-table-container">
                <h2>{tableTitle} {isLoadingData && <Spinner />} </h2>

                {loadAssignmentsStatus && 
                    <table>
                        <thead>
                            <tr>
                                <th>Dodany przez</th>
                                <th>Projekt</th>
                                <th>Rola</th>
                                <th>Data rozpoczęcia</th>
                                <th>Data zakończenia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadedAssignments.map(assign => {
                                return (
                                    <tr key={assign.assignmentId}>
                                        <td>{assign.createdBy}</td>
                                        <td>{assign.projectName}</td>
                                        <td>{assign.role}</td>
                                        <td>{assign.startDate.slice(0, 10)}</td>
                                        <td>{assign.endDate.slice(0, 10)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                }
                {loadAssignmentsStatus && loadedAssignments.length === 0 && 
                    <div className="empty-assign">
                        Puste przypisania
                        <i className="fa fa-code-branch"></i>
                    </div>
                }

                {loadAssignmentsStatus === false && 
                    <p className="asign-error">{loadAssignmentsErrors[0]}</p>
                }
                
            </div>
        );
    }
}

export default EmployeeTable;