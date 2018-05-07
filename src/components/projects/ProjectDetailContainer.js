import React, { Component } from 'react';
import LoaderCircular from './../common/LoaderCircular';
import Icon from './../common/Icon';
import DCMTWebApi from '../../api';
import { withRouter } from 'react-router';
import SkillRow from './../skills/SkillRow';
import Modal from 'react-responsive-modal';
import SkillsSelect from './../skills/SkillsSelect';
import DetailCascade from './../employees/DetailCascade';
import ProjectOwner from './ProjectOwner';
import { setActionConfirmation } from './../../actions/asyncActions';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import EditProjectDetails from './modals/EditProjectDetails';
import { bindActionCreators } from 'redux';
import * as projectsActions from "../../actions/projectsActions";

class ProjectDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      confirmed: false,
      invalidated: false,
      projectLoadedSuccessfully: false,
      projectActive: false,
      edit: false,
      skills: [],
      showModal: false,
      capacityLevel: 1,
      seniorityLevel: 1,
      project: {},
      showEditProjectModal: false
    };



    window.conductTest = () => {
      DCMTWebApi.getProject(130)
      .then((response) => {
        console.log('PROJECT', response.data.dtoObject);
      })
      .catch((error) => {

      });
    };
  }

  componentDidMount() {
    this.getProject(this.props.match.params.id);
  }

  getProject = (id) => {
    DCMTWebApi.getProject(id)
      .then((response) => {
        console.log('PROJECT', response.data.dtoObject);
        this.setState({
          project: response.data.dtoObject,
          loading: false,
          projectLoadedSuccessfully: true,
          projectActive: response.data.dtoObject.isActive
        });
      })
      .catch((error) => {

      });
  }

  deleteProjectOwner = (owner, project) => {
    return (e) => {
      const { t, dispatch } = this.props;
      dispatch(
        setActionConfirmation(true, {
          key: "deleteProjectOwner",
          string: t("DeleteOwnerFuture", { ownerFullName: owner.fullName, projectName: project.name }),
          ownerId: owner.id,
          projectId: project.name,
          successMessage: t("OwnerHasBeenDeleted")
        })
      );
    };
  }

  saveSettings = () => {
    DCMTWebApi.putProjectSkills(this.props.match.params.id, this.state.skills)
      .then((response) => {
        console.log('PROJECT', response.data.dtoObject);
        this.setState({
          project: response.data.dtoObject,
          loading: false,
          projectLoadedSuccessfully: true,
          projectActive: response.data.dtoObject.isActive
        });
      })
      .catch((error) => {

      });
  }

  handleSkillSelection = (newSkill) => {
    let duplicate = false;
    this.state.skills.map((skill, index) => {
      if(skill.skillId === newSkill.skillId) duplicate = true;
    });

    if(duplicate) return false;

    let copy = this.state.skills;
    copy.push(newSkill);
    this.setState({
      skills: copy,
      changesMade: true
    });

    return true;
  }

  handleSkillEdit = (updatedSkillObject, deletion = false) => {
    let { skills } = this.state;
    this.state.skills.forEach((skill, index) => {
      if(skill.skillName === undefined){
        skill = {
          skillName: skill.name,
          skillId: skill.id
        };
      }
      if(skill.skillId === updatedSkillObject.skillId){
        if(deletion) {
          skills.splice(index, 1);
        }
        else {
          skills[index] = updatedSkillObject;
        }

        this.setState({
          skills,
          changesMade: true
        });
      }
    });
  }

  handleRangeChange = (skillObject) => {
    return (event) => {
      let { skills } = this.state;
      skills.forEach((skill, index) => {
        // backend fixes!
        if(skill.skillName === undefined){
          skill = {
            skillName: skill.name,
            skillId: skill.id
          };
        }
        if(skillObject.skillName === undefined){
          skillObject = {
            skillName: skillObject.name,
            skillId: skillObject.id
          };
        }
        if(skill.skillId === skillObject.skillId){
          skills[index].yearsOfExperience = event.target.value - 0;
          this.setState({
            skills,
            changesMade: true
          });
        }
      });
    };
  }

  getYearsOfExperience = (index) => {
    if(this.state.skills[index].yearsOfExperience !== undefined)
      return this.state.skills[index].yearsOfExperience;
    else return 0;
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleEditProjectCloseModal = () => {
    this.setState({ showEditProjectModal: false });
  }

  add = () => {
    this.setState({ showModal: true });
  }

  save = () => {
    this.saveSettings();
  }

  confirm = () => {
    this.saveSettings();
  }

  changeSettings = () => {
    this.setState({
      showEditProjectModal: true
    });
  }

  cancel = () => {
    this.setState({
      edit: false
    });
  }

  edit = () => {
    this.setState({
      confirmed: false,
      edit: true
    });
  }

  mapSkills = (skills, editable = false) => {
    return skills.map((skillObject, index) => {
      return (
        <SkillRow
          key={index}
          skill={skillObject}
          handleSkillEdit={this.handleSkillEdit}
          editable={this.state.edit}
        />
      );
    });
  }

  mapOwners(owners, project) {
    return owners.map((owner, index) => {
      return <ProjectOwner clickAction={this.deleteProjectOwner(owner, project)} key={index} owner={owner}/>;
    });
  }

  pullProjectEditModalDOM = () => {
    return <Modal
      open={this.state.showEditProjectModal}
      classNames={{ modal: "Modal Modal-projects" }}
      contentLabel="Edit projects details"
      onClose={this.handleEditProjectCloseModal}
    >
      <EditProjectDetails
        closeModal={this.handleEditProjectCloseModal}
        project={this.state.project}
        responseBlock={this.state.responseBlock}
        loading={this.state.loading}
        projectActions={this.props.projectActions}
        limit={this.state.limit}
        currentPage={this.state.currentPage}
      />
    </Modal>;
  }

  pullModalDOM = () => {
    return <Modal
        open={this.state.showModal}
        classNames={{ modal: "Modal Modal-skills" }}
        contentLabel="Skills modal"
        onClose={this.handleCloseModal}
      >
      <SkillsSelect alreadySelected={this.state.skills} skillSelected={this.handleSkillSelection} />
    </Modal>;
  }

  pullEmployeeIdBlockDOM = () => {
    const { project } = this.state;
    return <div className="col-sm-4 project-id-block">
      <Icon icon="briefcase" iconSize="2x"/>
      <h1>{project.name}</h1>
      {
        this.state.projectActive ?
          <h3 className="project-active">Aktywny</h3>
        : <h3 className="project-inactive">Nieaktywny</h3>
      }
      <hr className="sharp"/>
      <button onClick={this.changeSettings} className="project-headway dcmt-button">Edytuj projekt</button>
      <hr/>
      <div className="project-headway">
        <div className="project-headway project-bold">Podstawowe informacje</div>
        <DetailCascade lKey={'Klient'} rVal={project.client} lColSize={4} rColSize={8} />
        <DetailCascade lKey={'Usunięty'} rVal={project.isDeleted ? "Tak" : "Nie"} lColSize={4} rColSize={8} />
        <DetailCascade lKey={'Aktywny'} rVal={project.isActive ? "Tak" : "Nie"} lColSize={4} rColSize={8} />
        <DetailCascade lKey={'Data rozpoczęcia'} rVal={project.startDate} lColSize={4} rColSize={8} />
        <DetailCascade lKey={'Przewidywana data zakończenia'} rVal={project.estimatedEndDate} lColSize={4} rColSize={8} />
      </div>
      <hr/>
      <div className="project-headway project-text-justified">
        <div className="project-headway project-bold">Osoba odpowiedzialna</div>
        <DetailCascade lKey={'Imię'} rVal={project.responsiblePerson.firstName} lColSize={4} rColSize={8} />
        <DetailCascade lKey={'Nazwisko'} rVal={project.responsiblePerson.lastName} lColSize={4} rColSize={8} />
        <DetailCascade lKey={'Nr. telefonu'} rVal={project.responsiblePerson.phoneNumber} lColSize={4} rColSize={8} />
        <DetailCascade lKey={'Email'} rVal={project.responsiblePerson.email} lColSize={4} rColSize={8} />
        <DetailCascade lKey={'Klient'} rVal={project.responsiblePerson.client} lColSize={4} rColSize={8} />
      </div>
      <hr/>
      <div className="project-headway project-text-justified">
        <div className="project-headway project-bold">Opis</div>
        <div>
          {project.description}
        </div>
      </div>
    </div>;
  }

  pullEditToolbarDOM = () => {
    return <div>
      {
        this.state.employeeActive ?
        <button onClick={this.cancel} className="dcmt-button">
          Cancel
        </button>
        : null
      }
      <button onClick={this.add} className="dcmt-button button-success">
        Add
      </button>
      <button onClick={this.save} className="dcmt-button button-success">
        Save
      </button>
    </div>;
  }

  pullDOM = () => {
    const { project } = this.state;
    return <div className="row">
      { this.state.projectLoadedSuccessfully ? this.pullEmployeeIdBlockDOM() : null }
      <div className="col-sm-7 project-headway">
        {this.mapOwners(this.state.project.owners, this.state.project)}
        <hr className="sharp"/>
        {this.mapSkills(this.state.skills)}
      </div>
      <div className="col-sm-1 project-headway full-width-button">
        {
          this.state.edit === false ?
          <button onClick={this.edit} className="dcmt-button">
            Edit
          </button>
          :
          this.pullEditToolbarDOM()
        }
      </div>
    </div>;
  };

  render() {
    return (
      <div className="content-container project-detail-container">
        { this.pullModalDOM() }
        { this.pullProjectEditModalDOM() }
        { this.state.loading ? <LoaderCircular/> : this.pullDOM() }
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectsActions, dispatch)
  };
}

export default connect(mapDispatchToProps)(withRouter(translate("ProjectsList")(ProjectDetailContainer)));
