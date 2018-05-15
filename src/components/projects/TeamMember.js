import React, { Component } from 'react';
import Icon from './../common/Icon';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import pl from 'javascript-time-ago/locale/pl';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import CapacitySlider from './../employees/CapacitySlider';
import { push } from 'react-router-redux';

class TeamMember extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    switch(this.props.lang){
      case 'pl': {
        TimeAgo.locale(pl);
        this.timeAgo = new TimeAgo('pl-PL');
        break;
      }
      case 'en': {
        TimeAgo.locale(en);
        this.timeAgo = new TimeAgo('en-US');
        break;
      }
    }
  }

  capacityToPrimitiveFraction(decimalFraction) {
    switch(decimalFraction){
      case 0.2: return '1/5';
      case 0.25: return '1/4';
      case 0.5: return '1/2';
      case 0.75: return '3/4';
      case 1: return 'FT';
    }
  }

  timeStampToDate = (ts) => {
    return (new Date(ts)).toLocaleDateString();
  }

  goToEmployeeMoreDetails = (id) => {
    return (event) => {
      this.props.dispatch(push(`/main/employees/${id}`));
    };
  }

  isActive(assignment) {
    if(assignment.isActive !== undefined) return assignment.isActive;
    else return false;
  }

  pullCompactDOM = () => {
    const { assignment, t, projectFlavor } = this.props;

    return <tr className="team-member-compact" onClick={this.props.onClick}>
      <td className="team-member-cell">
        {
          this.isActive(assignment) ? <Icon icon="address-card"/> : <Icon icon="arrow-down"/>
        }
      </td>
      <td className="team-member-cell">
        {
          projectFlavor === true ?
          <a target="_blank" href={`/main/projects/${assignment.projectId}`}>{assignment.projectName}</a>
          : <a target="_blank" href={`/main/employees/${assignment.employeeId}`}>{assignment.firstName + ' ' + assignment.lastName}</a>
        }
      </td>
      <td className="team-member-cell team-member-text-bold">
        {this.capacityToPrimitiveFraction(assignment.assignedCapacity)}
      </td>
      <td className="team-member-cell">
        {assignment.role}
      </td>
      <td className="team-member-cell">
        {assignment.seniority}
      </td>
      <td className="team-member-cell">
        {assignment.title}
      </td>
      <td className="team-member-cell">
        {(new Date(assignment.endDate)).toLocaleDateString()}
      </td>
      <td className="team-member-cell" onClick={this.props.delete(assignment)}>
        <Icon icon="times"/>
      </td>
    </tr>;
  }

  pullFullDetailDOM = () => {
    const { assignment, t } = this.props;
    return (
      <tr className="team-member-block">
        <td colSpan={3} className="team-member-right">
          <span className="team-member-backway">
            <span className="team-member-text-bold">
            {t('ResponsibleFor')}:
            </span>
            <span className="team-member-headway">
              {
                assignment.responsibilities.map((responsibility, index) => {
                  return <div key={index}>- {responsibility}</div>;
                })
              }
            </span>
          </span>
        </td>
        <td colSpan={4} className="team-member-left">
          <div>{t('AddedBy')}: {assignment.createdBy} { this.timeAgo.format(new Date(assignment.createdAt)) }</div>
          <div>{t('Begun')}: { this.timeAgo.format(new Date(assignment.startDate)) } {this.timeStampToDate(assignment.startDate)}</div>
          <div>{t('Ends')}: {this.timeStampToDate(assignment.endDate)}</div>
        </td>
      </tr>
    );
  }

  render() {
    return this.props.compact === true ? this.pullCompactDOM() : this.pullFullDetailDOM();
  }
}

function mapStateToProps(state) {
  return {
    lang: state.languageReducer.language
  };
}

export default connect(mapStateToProps)(translate('TeamMember')(TeamMember));
