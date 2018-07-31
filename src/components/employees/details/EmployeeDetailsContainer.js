import React from 'react'
import './EmployeeDetailsContainer.scss';
import { connect } from 'react-redux';
import EmployeeContent from './employeeContent/employeeContent';
import EmployeeTable from './employeeTable/employeeTable';
import { getEmployeePromise } from '../../../actions/employeesActions';
import Spinner from '../../common/spinner/spinner';
import OperationStatusPrompt from '../../form/operationStatusPrompt/operationStatusPrompt';

class EmployeeDetailsContainer extends React.Component{
    state = {
        isLoadingFirstTimeProject: true
    }
    componentDidMount() {
        const { getEmployeePromise, match} = this.props;
        getEmployeePromise(match.params.id);
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.employeeErrors !== this.props.employeeErrors){
            this.setState({isLoadingFirstTimeProject: false});
        }
    }
    render(){
        const { isLoadingFirstTimeProject } = this.state;
        const { employeeStatus, employeeErrors, employee } = this.props;
        return (
            <div className="employee-details-container">
                {isLoadingFirstTimeProject ? <Spinner /> : 
                    employeeStatus && 
                    <React.Fragment>
                        <h1>Szczegóły pracownika</h1>
                
                        <EmployeeContent employee={employee} />
                        
                        <EmployeeTable tableTitle="Aktywne projekty" />
                    </React.Fragment>
                }

                {employeeStatus === false &&  
                <OperationStatusPrompt
                    operationPromptContent={employeeErrors[0]}
                    operationPrompt={false}
                />
                }
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        employeeStatus: state.employeesReducer.employeeStatus,
        employeeErrors: state.employeesReducer.employeeErrors,
        employee: state.employeesReducer.employee
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        getEmployeePromise: (employeeId) => dispatch(getEmployeePromise(employeeId))
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(EmployeeDetailsContainer);
  