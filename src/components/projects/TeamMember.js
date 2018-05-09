import React, { Component } from 'react';
import Icon from './../common/Icon';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import pl from 'javascript-time-ago/locale/pl';
import { connect } from 'react-redux';
import { translate } from 'react-translate';

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

  render() {
    const { assignment, t } = this.props;
    return (
      <div className="team-member-block row">
        <div className="team-member-left col-sm-6">
          <Icon icon="address-card"/>
          <h4>{assignment.firstName + ' ' + assignment.lastName}</h4>
          <div className="team-job-title">___</div>
          <hr/>
          <div className="row">
            <span className="col-sm-6">{t('AssignedCapacity')}:</span>
            <span className="col-sm-6 team-member-text-bold">
              {this.capacityToPrimitiveFraction(assignment.assignedCapacity)}
            </span>
          </div>
          <div className="row">
            <span className="col-sm-6">{t('ProjectRole')}:</span>
            <span className="col-sm-6 team-member-text-bold">___</span>
          </div>
          <div className="row">
            <span className="col-sm-6">{t('Seniority')}:</span>
            <span className="col-sm-6 team-member-text-bold">
              {assignment.seniority}
            </span>
          </div>
          <hr/>
          {t('AddedBy')}: ___ { this.timeAgo.format(new Date(assignment.startDate)) }
        </div>
        <div className="team-member-right col-sm-6">
          <div className="team-member-backway">
            <div className="team-member-text-bold">
            {t('ResponsibleFor')}:
            </div>
            <div className="team-member-headway">
              <div>- ___</div>
            </div>
          </div>
          <div className="team-member-headway team-member-workdates team-member-text-right">
            <div>{t('Begun')}: { this.timeAgo.format(new Date(assignment.startDate)) } {this.timeStampToDate(assignment.startDate)}
            </div>
            <div>{t('Ends')}: {this.timeStampToDate(assignment.endDate)}</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    lang: state.languageReducer.language
  };
}

export default connect(mapStateToProps)(translate('TeamMember')(TeamMember));
