import React, { Component } from "react";
import "./recentReports.scss";
import Icon from "../../common/Icon";

class recentReports extends Component {
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
            recentReports,
            recentReportsStatus,
            recentReportsErrors
        } = this.props;
        const collapsedIcon = <Icon icon="caret-right" />
        const expandedIcon = <Icon icon="caret-down" />
        const cloudTypes = ["Google Drive", "OneDrive"]
        return (
            recentReportsStatus && recentReports.length > 0 &&
            <div className="recent-reports">
                <div className="expandButton" onClick={this.onExpandClick}>
                    {this.state.expanded ? expandedIcon : collapsedIcon}
                    <h1>Ostatnie raporty</h1>
                </div>
                {this.state.expanded && <div className="expandable">
                    <table className="recentReport">
                        {recentReports.map(report =>
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
                                            <tr key={`${report}/${teamSheet.id}`}>
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
        );
    }
}

export default recentReports;