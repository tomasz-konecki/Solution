import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProjectSkill from './ProjectSkill';
import ProjectOwner from './ProjectOwner';
import SkillsSelect from './../skills/SkillsSelect';
import AddProjectOwner from './modals/AddProjectOwner';
import * as _ from 'lodash';
import * as asyncActions from "../../actions/asyncActions";
import { SET_ACTION_CONFIRMATION_RESULT, SET_ACTION_CONFIRMATION } from '../../constants';
import { translate } from 'react-translate';
import SkillRow from './../skills/SkillRow';
import { push } from 'react-router-redux';

class ProjectRowUnfurl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      toUnfurl: this.props.toUnfurl,
      changesMade: false,
      showModal: false,
      showAddOwner: false
    };

    this.hasBeenInvalidated = false;
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.toConfirm.key !== undefined && this.props.toConfirm.key !== ""){
      this.lastKnownConfirmationKey = this.props.toConfirm.key.toString();
    }
    if (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === SET_ACTION_CONFIRMATION_RESULT &&
      nextProps.resultBlock.response.status === 200 &&
      this.lastKnownConfirmationKey === 'deleteProjectOwner'
    ) {
      if(!this.hasBeenInvalidated){
        this.hasBeenInvalidated = true;
        this.handleOwnerSelectionFinale();
      }
    }
  }

  mapSkills(skills, editable = false) {
    return skills.map((skillObject, index) => {
      return <SkillRow
        key={index}
        skill={skillObject}
        editable={editable}
        showYoe={false}
      />;
    });
  }

  mapOwners(owners, projectId) {
    return owners.map((owner, index) => {
      return <ProjectOwner key={index} owner={owner}/>;
    });
  }

  goDetails = (id) => {
    return (event) => {
      this.props.dispatch(push(`/main/projects/${id}`));
    };
  }

  render() {
    const { handles, t } = this.props;
    const { toUnfurl } = this.state;

    return (
      <div>
        <div className="row">
          <span className="col-sm-11">
            {t("OwnersList")}:
            {this.mapOwners(toUnfurl.owners, toUnfurl.id)}
          </span>
          <span className="col-sm-1 text-right">
            <button onClick={this.goDetails(toUnfurl.id)} className="dcmt-button">{t("More")}</button>
          </span>
        </div>
        <hr/>
        <div className="row">
          <span className="col-sm-7">
            { this.mapSkills(toUnfurl.skills, this.state.editable) }
            { toUnfurl.skills.length === 0 ? t("CurrentlyNoSkillsAssigned") : null }
          </span>
          <span className="col-sm-5">
            {t("Description")}: <span className="text-just">{toUnfurl.description}</span>
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.asyncReducer.loading,
    confirmed: state.asyncReducer.confirmed,
    toConfirm: state.asyncReducer.toConfirm,
    isWorking: state.asyncReducer.isWorking,
    resultBlock: state.asyncReducer.resultBlock,
    type: state.asyncReducer.type
  };
}

ProjectRowUnfurl.propTypes = {
  toUnfurl: PropTypes.shape({
    skills: PropTypes.arrayOf(PropTypes.object).isRequired
  }),
  handles: PropTypes.shape({
    putSkills: PropTypes.func.isRequired,
    ownerDelete: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired
  }),
  update: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(translate("ProjectRowUnfurl")(ProjectRowUnfurl));
