import React, { Component } from 'react';
import ProjectSkill from './ProjectSkill';
import ProjectOwner from './ProjectOwner';
import * as _ from 'lodash';
import Modal from 'react-responsive-modal';
import SkillsSelect from './../skills/SkillsSelect';

class ProjectRowUnfurl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      toUnfurl: this.props.toUnfurl,
      changesMade: false,
      showModal: false
    };
    this.originalSkills = this.props.toUnfurl.skills;
    this.handleEditButton = this.handleEditButton.bind(this);
    this.handleSaveButton = this.handleSaveButton.bind(this);
    this.handleSkillEdit = this.handleSkillEdit.bind(this);
    this.haveSkillsChanged = this.haveSkillsChanged.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleSkillSelection = this.handleSkillSelection.bind(this);
  }

  mapSkills(skills, editable = false) {
    return skills.map((skillObject, index) => {
      return <ProjectSkill skillEdited={this.handleSkillEdit} editable={editable} key={index} skillObject={skillObject}/>;
    });
  }

  mapOwners(owners, ownerDelete, projectId) {
    return owners.map((ownerName, index) => {
      return <ProjectOwner clickAction={(e) => ownerDelete(ownerName, projectId, e)} key={index} ownerName={ownerName}/>;
    });
  }

  haveSkillsChanged() {
    return this.state.changesMade;
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
        <div className="row">
          <span className="col-sm-9">Lista właścicieli: {this.mapOwners(toUnfurl.owners, handles.ownerDelete, toUnfurl.id)}</span>
          <span className="col-sm-3">ID Projektu: <b>{toUnfurl.id}</b></span>
        </div>
        <hr/>
        <div className="row">
          <span className="col-sm-12">Opis: <b>{toUnfurl.description}</b></span>
        </div>
        <hr/>
        <div className="row">
          <div className="col-sm-6">
            {this.mapSkills(toUnfurl.skills, this.state.editable)}
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

export default ProjectRowUnfurl;
