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
import TeamMember from './TeamMember';
import AddProjectOwner from './modals/AddProjectOwner';
import { SET_ACTION_CONFIRMATION_RESULT } from '../../constants';

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
      showEditProjectModal: false,
      pps_rb: {},
      showAddOwner: false,
      projectActions: bindActionCreators(projectsActions, this.props.dispatch)
    };
  }

  componentDidMount() {
    this.getProject(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    let acceptableKeys = [
      'deleteProjectOwner',
      'closeProject',
      'reactivateProject',
      'deleteProject'
    ];
    if(nextProps.type === SET_ACTION_CONFIRMATION_RESULT){
      if(acceptableKeys.indexOf(this.props.toConfirm.key) >= 0){
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  }

  getProject = (id) => {
    DCMTWebApi.getProject(id)
      .then((response) => {
        console.log('PROJECT', response.data.dtoObject);
        this.setState({
          project: response.data.dtoObject,
          loading: false,
          projectLoadedSuccessfully: true,
          projectActive: response.data.dtoObject.isActive,
          skills: response.data.dtoObject.skills,
          team: (response.data.dtoObject.team !== undefined ?
            response.data.dtoObject.team : [])
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
          projectId: project.id,
          successMessage: t("OwnerHasBeenDeleted")
        })
      );
    };
  }

  saveSettings = () => {
    this.setState({
      loading: true
    });
    DCMTWebApi.putProjectSkills(this.props.match.params.id, this.state.skills)
      .then((response) => {
        this.setState({
          loading: false,
          pps_rb: {
            response
          },
          edit: false
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          pps_rb: error
        });
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

  handleEditProjectCloseModal = (success = false) => {
    this.setState({ showEditProjectModal: false }, () => {
      if(success) window.location.reload();
    });
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

  handleOpenAddOwner = () => {
    this.setState({ showAddOwner: true });
  }

  handleCloseAddOwner = (success = false) => {
    this.setState({ showAddOwner: false }, () => {
      if(success) setTimeout(() => {
        window.location.reload();
      });
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
          showYoe={false}
        />
      );
    });
  }

  mapTeam = (team) => {
    return team.map((teamAssignment, index) => {
      return (
        <TeamMember key={index} assignment={teamAssignment}/>
      );
    });
  }

  mapOwners = (owners, project) => {
    return [
      ... owners.map((owner, index) => {
        return <ProjectOwner clickAction={this.deleteProjectOwner(owner, project)} key={index} owner={owner}/>;
      }),
      <div key={-1} className="project-owner">
        <span onClick={this.handleOpenAddOwner} className="project-owner-add">
          <span/>
        </span>
      </div>
    ];
  }

  handleOwnerSelectionFinale = (success) => {
    this.handleCloseAddOwner(success);
  }

  reactivateProject = () => {
    const { t, dispatch } = this.props;
    dispatch(
      setActionConfirmation(true, {
        key: "reactivateProject",
        string: `${t("ReactivateProjectInfinitive")} ${this.state.project.name}`,
        id: this.state.project.id,
        successMessage: t("ProjectReactivated")
      })
    );
  }

  deleteProject = () => {
    const { t, dispatch } = this.props;
    dispatch(
      setActionConfirmation(true, {
        key: "deleteProject",
        string: `${t("DeleteProjectInfinitive")} ${this.state.project.name}`,
        id: this.state.project.id,
        successMessage: t("ProjectDeleted")
      })
    );
  }

  closeProject = () => {
    const { t, dispatch } = this.props;
    dispatch(
      setActionConfirmation(true, {
        key: "closeProject",
        string: `${t("CloseProjectInfinitive")} ${this.state.project.name}`,
        id: this.state.project.id,
        successMessage: t("ProjectClosed")
      })
    );
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
        updateProjectsOnSuccess={false}
      />
    </Modal>;
  }

  pullAddOwnerModalDOM = () => {
    return <Modal
      open={this.state.showAddOwner}
      classNames={{ modal: "Modal Modal-add-owner" }}
      contentLabel="Add owner modal"
      onClose={this.handleCloseAddOwner}
    >
      <AddProjectOwner project={this.state.project} completed={this.handleOwnerSelectionFinale}/>
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
    const { t } = this.props;
    const { project } = this.state;
    return <div className="col-sm-4 project-id-block button-group">
      <Icon icon="briefcase" iconSize="2x"/>
      <h1>{project.name}</h1>
      {
        this.state.projectActive ?
          <h3 className="project-active">{t("Active")}</h3>
        : <h3 className="project-inactive">{t("Inactive")}</h3>
      }
      <hr className="sharp"/>
      <button onClick={this.changeSettings} className="project-headway dcmt-button button-success">{t("EditProject")}</button>
      {
        this.state.project.isActive ?
        <button onClick={this.closeProject} title={t("Close")} className="project-headway dcmt-button button-lowkey">{t("Close")}</button>
        : <button onClick={this.reactivateProject} title={t("Reactivate")} className="project-headway dcmt-button button-success">{t("Reactivate")}</button>
      }
      {
        this.state.project.isDeleted ?
        null
        : <button onClick={this.deleteProject} title={t("Delete")} className="project-headway dcmt-button button-lowkey">{t("Delete")}</button>
      }
      <hr/>
      <div className="project-headway">
        <div className="project-headway project-bold">{t("Overview")}</div>
        <DetailCascade lKey={t("Client")} rVal={project.client} lColSize={4} rColSize={8} />
        <DetailCascade lKey={t("Deleted")} rVal={project.isDeleted ? t("Yes") : t("No")} lColSize={4} rColSize={8} />
        <DetailCascade lKey={t("Active")} rVal={project.isActive ? t("Yes") : t("No")} lColSize={4} rColSize={8} />
        <DetailCascade lKey={t("StartDate")} rVal={project.startDate} lColSize={4} rColSize={8} />
        <DetailCascade lKey={t("EstimatedEndDate")} rVal={project.estimatedEndDate} lColSize={4} rColSize={8} />
      </div>
      <hr/>
      <div className="project-headway project-text-justified">
        <div className="project-headway project-bold">{t("ResponsiblePerson")}</div>
        <DetailCascade lKey={t("Name")} rVal={project.responsiblePerson.firstName} lColSize={4} rColSize={8} />
        <DetailCascade lKey={t("Surname")} rVal={project.responsiblePerson.lastName} lColSize={4} rColSize={8} />
        <DetailCascade lKey={t("PhoneNumber")} rVal={project.responsiblePerson.phoneNumber} lColSize={4} rColSize={8} />
        <DetailCascade lKey={t("Email")} rVal={project.responsiblePerson.email} lColSize={4} rColSize={8} />
        <DetailCascade lKey={t("Client")} rVal={project.responsiblePerson.client} lColSize={4} rColSize={8} />
      </div>
      <hr/>
      <div className="project-headway">
        <div className="project-headway project-bold">{t("Owners")}</div>
        {this.mapOwners(this.state.project.owners, this.state.project)}
      </div>
      <div className="project-headway project-text-justified">
        <div className="project-headway project-bold">{t("Description")}</div>
        <div>
          {project.description}
        </div>
      </div>
    </div>;
  }

  pullEditToolbarDOM = () => {
    const { t } = this.props;
    return <div>
      {
        this.state.employeeActive ?
        <button onClick={this.cancel} className="dcmt-button">
          {t("Cancel")}
        </button>
        : null
      }
      <button onClick={this.add} className="dcmt-button button-success">
        {t("Add")}
      </button>
      <button onClick={this.save} className="dcmt-button button-success">
        {t("Save")}
      </button>
    </div>;
  }

  pullDOM = () => {
    const { project } = this.state;
    const { t } = this.props;
    return <div className="row">
      { this.state.projectLoadedSuccessfully ? this.pullEmployeeIdBlockDOM() : null }
      <div className="col-sm-7 project-headway">
        {this.mapTeam(this.state.team)}
        <hr/>
        {this.mapSkills(this.state.skills)}
      </div>
      <div className="col-sm-1 project-headway full-width-button">
        {
          this.state.edit === false ?
          <button onClick={this.edit} className="dcmt-button">
            {t("Edit")}
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
        { this.pullAddOwnerModalDOM() }
        { this.state.loading ? <LoaderCircular/> : this.pullDOM() }
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

export default connect(mapStateToProps)(withRouter(translate("ProjectDetailContainer")(ProjectDetailContainer)));
