import React from 'react'
import './employeeTable.scss';

class EmployeeTable extends React.Component{
    state = {
        heads: [],
        bodies: []
    }

   
    render(){
        const { heads } = this.state;
        const { tableTitle } = this.props;
        return (
            <div className="employee-table-container">
                <h2>{tableTitle}</h2>
                <table>
                    <thead>
                        <tr>
                            {heads.map(head => {
                                return <th></th>
                            })}
                        </tr>
                    </thead>


                    <tbody>
                           
                    </tbody>
                </table>
            </div>
        );
    }
}

export default EmployeeTable;