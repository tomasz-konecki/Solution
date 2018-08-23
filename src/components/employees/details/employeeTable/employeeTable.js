import React from 'react'
import './employeeTable.scss';
import Spinner from '../../../common/spinner/small-spinner';
import { withRouter } from 'react-router-dom';
import EmptyContent from '../../../common/empty-content/empty-content';
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
        else if(nextProps.match !== this.props.match)
        {
            this.setState({isLoadingData: true});
            this.props.loadAssignmentsACreator();   
        }
    }
    render(){
        const { isLoadingData } = this.state;
        const { tableTitle, loadAssignmentsStatus, 
            loadAssignmentsErrors, loadedAssignments, loadAssignmentsClear,
            history } = this.props;
            
        return (
            <div className="table-container emp-table">
                <h2>{tableTitle} {isLoadingData && <Spinner />} </h2>

                {loadAssignmentsStatus && loadedAssignments.length > 0 && 
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
                                    <tr onClick={() => history.push(`/main/projects/${assign.projectId}`)} key={assign.assignmentId}>
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
                    <EmptyContent sizeClass="assigns-size"
                    shouldShowTopIcon={false}
                    content="Puste przypisania"
                    mainIcon="fa fa-code-branch"
                    />
                }

                {loadAssignmentsStatus === false && 
                    <p className="asign-error">{loadAssignmentsErrors[0]}</p>
                }
           
            </div>
        );
    }
}

export default withRouter(EmployeeTable);