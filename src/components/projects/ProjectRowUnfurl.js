import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProjectSkill from './ProjectSkill';
import ProjectOwner from './ProjectOwner';
import SkillsSelect from './../skills/SkillsSelect';
import defaultShouldAsyncValidate from './../../../dist/app.bundle';
import AddProjectOwner from './modals/AddProjectOwner';
import * as _ from 'lodash';
import * as asyncActions from "../../actions/asyncActions";
import { SET_ACTION_CONFIRMATION_RESULT, SET_ACTION_CONFIRMATION } from '../../constants';

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
    this.originalSkills = this.props.toUnfurl.skills;
    this.handleEditButton = this.handleEditButton.bind(this);
    this.handleSaveButton = this.handleSaveButton.bind(this);
    this.handleSkillEdit = this.handleSkillEdit.bind(this);
    this.haveSkillsChanged = this.haveSkillsChanged.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleOpenAddOwner = this.handleOpenAddOwner.bind(this);
    this.handleCloseAddOwner = this.handleCloseAddOwner.bind(this);
    this.handleSkillSelection = this.handleSkillSelection.bind(this);
    this.handleOwnerSelectionFinale = this.handleOwnerSelectionFinale.bind(this);

    this.settingsCache = [];
    this.lastKnownConfirmationKey = "";
    this.hasBeenInvalidated = false;
  }

  deleteOwner(ownerName, projectId) {
    return (e) => {
      this.props.handles.ownerDelete(ownerName, projectId, e);
    };
  }

  mapSkills(skills, editable = false) {
    return skills.map((skillObject, index) => {
      return <ProjectSkill skillEdited={this.handleSkillEdit} editable={editable} key={index} skillObject={skillObject}/>;
    });
  }

  mapOwners(owners, projectId) {
    return owners.map((ownerName, index) => {
      return <ProjectOwner clickAction={this.deleteOwner(ownerName, projectId)} key={index} ownerName={ownerName}/>;
    });
  }

  haveSkillsChanged() {
    return this.state.changesMade;
  }

  deepCopy(object) {
    return JSON.parse(JSON.stringify(object));
  }

  handleSkillEdit(updatedSkillObject, deletion = false) {
    let { toUnfurl } = this.state;
    toUnfurl.skills.forEach((skill, index) => {
      if(skill.skillId === updatedSkillObject.skillId){
        if(deletion)
          toUnfurl.skills.splice(index, 1);
        else
          toUnfurl.skills[index].skillLevel = updatedSkillObject.skillLevel;
        this.setState({
          toUnfurl,
          changesMade: true
        });
      }
    });
  }

  handleEditButton() {
    this.setState({
      editable: !this.state.editable
    }, () => {
      if(this.state.editable === false && this.state.changesMade){
        let { toUnfurl } = this.state;
        toUnfurl.skills = this.deepCopy(this.settingsCache);
        this.setState({
          toUnfurl,
          changesMade: false
        });
      } else {
        this.settingsCache = this.deepCopy(this.state.toUnfurl.skills);
      }
    });
  }

  handleSaveButton() {
    if(this.props.handles.putSkills !== undefined) {
      this.props.handles.putSkills(this.state.toUnfurl.id, this.props.toUnfurl.skills);
      this.setState({
        changesMade: false,
        editable: false
      });
    }
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleOpenAddOwner() {
    this.setState({ showAddOwner: true });
  }

  handleCloseAddOwner() {
    this.setState({ showAddOwner: false });
  }

  handleSkillSelection(newSkill) {
    let duplicate = false;
    this.state.toUnfurl.skills.map((skill, index) => {
      if(skill.skillId === newSkill.skillId) duplicate = true;
    });

    if(duplicate) return false;

    let copy = this.state.toUnfurl;
    copy.skills.push(newSkill);
    this.setState({
      toUnfurl: copy,
      changesMade: true
    });

    return true;
  }

  handleOwnerSelectionFinale() {
    this.props.handles.refresh();
    setTimeout(() => {
      this.handleCloseAddOwner();
      this.props.update();
    }, 500);
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

  render() {
    const { handles } = this.props;
    const { toUnfurl } = this.state;
    let optionalEditStyling = {};
    if(this.state.editable) optionalEditStyling = {
      background: "#333"
    };
    return (
      <div>
        <Modal
          open={this.state.showModal}
          classNames={{ modal: "Modal Modal-skills" }}
          contentLabel="Skills modal"
          onClose={this.handleCloseModal}
        >
          <SkillsSelect alreadySelected={toUnfurl.skills} skillSelected={this.handleSkillSelection} />
        </Modal>
        <Modal
          open={this.state.showAddOwner}
          classNames={{ modal: "Modal Modal-add-owner" }}
          contentLabel="Add owner modal"
          onClose={this.handleCloseAddOwner}
        >
          <AddProjectOwner project={toUnfurl} completed={this.handleOwnerSelectionFinale}/>
        </Modal>
        <div className="row">
          <span className="col-sm-9">
            Lista właścicieli:
            {this.mapOwners(toUnfurl.owners, toUnfurl.id)}
            <div className="project-owner">
              <span onClick={this.handleOpenAddOwner} className="project-owner-add"/>
            </div>
          </span>
          <span className="col-sm-3">ID Projektu: <b>{toUnfurl.id}</b></span>
        </div>
        <hr/>
        <div className="row">
          <span className="col-sm-12">Opis: <b>{toUnfurl.description}</b></span>
        </div>
        <hr/>
        <div className="row">
          <div className="col-sm-6">
            { this.mapSkills(toUnfurl.skills, this.state.editable) }
            { toUnfurl.skills.length === 0 ? "Obecnie brak przypisanych umiejętności" : null }
          </div>
          <div className="col-sm-6">
            <button style={optionalEditStyling} onClick={this.handleEditButton} className="dcmt-button">Edytuj umiejętności</button>
            {
              this.state.editable ?
              <button onClick={this.handleOpenModal} className="dcmt-button button-success">Dodaj</button>
              :
              null
            }
            {
              this.haveSkillsChanged() ?
              <button onClick={this.handleSaveButton} className="dcmt-button">Zapisz</button>
              :
              null
            }
          </div>
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

function mapDispatchToProps(dispatch) {
  return {
    async: bindActionCreators(asyncActions, dispatch)
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectRowUnfurl);
