import React, { Component } from "react";
import "./reportPresets.scss";
import Icon from "../../common/Icon";

class reportPresets extends Component {
    state = {
        expanded: false
    }
    onExpandClick = () => {
        this.setState({ expanded: !this.state.expanded });
    }
    onChooseClick = (reportId) => {

    }
    render() {
        const {
            chooseRecentReport,
            getRecentReports,
            reports,
            reportsStatus,
            reportsErrors
        } = this.props;
        const collapsedIcon = <Icon icon="caret-right" />
        const expandedIcon = <Icon icon="caret-down" />
        return (
            <React.Fragment>
                {reportsStatus && reports.length > 0 &&
                    <div className="recent-reports">
                        <div className="expandButton" onClick={this.onExpandClick}>
                            {this.state.expanded ? expandedIcon : collapsedIcon}
                            {React.Children.only(this.props.children)}
                        </div>
                        {this.state.expanded && <div className="expandable">
                            <table className="recentReport">
                                {reports.map(report =>
                                    <React.Fragment key={report.id}>
                                        <thead>
                                            <tr key={report.id}>
                                                <th>Team</th>
                                                <th>Strona</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                report.teamSheets.map((teamSheet, i) =>
                                                    <tr key={`${report.id}/${teamSheet.id}`}>
                                                        <td className="innerCell">{teamSheet.team}</td>
                                                        <td className="innerCell centerCell">{teamSheet.sheet}</td>
                                                        {i == 0 && <td rowSpan={report.teamSheets.length} className="generateCell">
                                                            <h2 onClick={() => chooseRecentReport(report.teamSheets)}>Wybierz te teamy</h2>
                                                        </td>}
                                                    </tr>)
                                            }

                                        </tbody>
                                    </React.Fragment>
                                )}
                            </table>
                        </div>}
                    </div >
                }
            </React.Fragment>
        );
    }
}

export default reportPresets;