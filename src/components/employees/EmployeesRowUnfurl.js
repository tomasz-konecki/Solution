import React, { Component } from 'react';
import { translate } from 'react-translate';
import DCMTWebApi from '../../api';
import ResultBlock from '../common/ResultBlock';
import ProjectSkill from './../projects/ProjectSkill';
import LoaderHorizontal from './../common/LoaderHorizontal';
import SeniorityBlock from './SeniorityBlock';
import CapacityBlock from './CapacityBlock';

class EmployeesRowUnfurl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toUnfurl: this.props.toUnfurl,
      errorBlock: {},
      skills: [],
      loadingSkills: true,
      changesMade: false,
      value: 0,
      seniorityLevel: 1,
      capacityLevel: 1,
      confirmed: false
    };

    this.handleSkillEdit = this.handleSkillEdit.bind(this);
    this.getYearsOfExperience = this.getYearsOfExperience.bind(this);
    this.handleSeniorityChange = this.handleSeniorityChange.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
    this.finishUp = this.finishUp.bind(this);
  }

  componentDidMount() {
    DCMTWebApi.getEmploSkills(this.state.toUnfurl.id)
      .then((emploSkills) => {
        this.setState({
          errorBlock: {
            result: emploSkills
          },
          skills: emploSkills.data.dtoObjects,
          loadingSkills: false
        });
      })
      .catch((error) => {
        this.setState({
          errorBlock: error,
          loadingSkills: false
        });
      });
  }

  finishUp() {
    this.setState({
      loadingSkills: true
    });
    let { skills } = this.state;
    let newSkills = [];
    skills.forEach((skill, index) => {
      if(skill.skillName === undefined){
        skill = {
          skillName: skill.name,
          skillId: skill.id
        };
      }
      newSkills.push(skill);
    });
    DCMTWebApi
      .addEmployee(
        this.state.toUnfurl.id,
        this.state.capacityLevel,
        this.state.seniorityLevel,
        newSkills
      )
      .then((confirmation) => {
        this.setState({
          errorBlock: {
            result: confirmation
          },
          loadingSkills: false
        });
      })
      .catch((error) => {
        this.setState({
          errorBlock: error,
          loadingSkills: false
        });
      });
  }

  handleSeniorityChange(seniorityLevel) {
    this.setState({
      seniorityLevel
    });
  }

  handleCapacityChange(capacityLevel) {
    this.setState({
      capacityLevel
    });
  }

  handleSkillEdit(updatedSkillObject, deletion = false) {
    let { skills } = this.state;
    skills.forEach((skill, index) => {
      if(skill.skillName === undefined){
        skill = {
          skillName: skill.name,
          skillId: skill.id
        };
      }
      if(skill.skillId === updatedSkillObject.skillId){
        if(deletion)
          skills.splice(index, 1);
        else
          skills[index].skillLevel = updatedSkillObject.skillLevel;
        this.setState({
          skills,
          changesMade: true
        });
      }
    });
  }

  handleRangeChange(skillObject) {
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

  getYearsOfExperience(index){
    if(this.state.skills[index].yearsOfExperience !== undefined)
      return this.state.skills[index].yearsOfExperience;
    else return 0;
  }

  confirm = () => {
    this.setState({
      confirmed: true
    });
    console.log(this.state);
  }

  cancel = () => {
    this.setState({
      confirmed: false
    });
  }

  mapSkills(skills, editable = false) {
    return skills.map((skillObject, index) => {
      return (
        <div className="col-sm-4" key={index}>
          <ProjectSkill skillEdited={this.handleSkillEdit} editable={!this.state.confirmed} skillObject={skillObject}/>
          <div className="form-group skill-yoe-block">
            Years of experience: {this.getYearsOfExperience(index)}
            <br/>
            {
              this.state.confirmed === false ?
                <input
                type="range"
                className="form-control-range"
                id="formControlRange"
                min="0"
                max="30"
                step="1"
                value={this.getYearsOfExperience(index)}
                onChange={this.handleRangeChange(skillObject)}
              />
              : null
            }
          </div>
          <hr/>
        </div>
      );
    });
  }

  render() {
    const { t } = this.props;
    return (
      <div className="row">
        <div className="col-sm-10">
          <div className="row">
            <div className="col-sm-6">
              <SeniorityBlock seniorityChanged={this.handleSeniorityChange} seniorityLevel={this.state.seniorityLevel} editable={!this.state.confirmed}/>
            </div>
            <div className="col-sm-6">
              <CapacityBlock capacityChanged={this.handleCapacityChange} capacityLevel={this.state.capacityLevel} editable={!this.state.confirmed}/>
            </div>
          </div>
          <hr/>
          {this.state.loadingSkills ? <LoaderHorizontal/> : null}
          <div className="row">
            {this.mapSkills(this.state.skills)}
          </div>
          <hr/>
        </div>
        <div className="col-sm-2 full-width-button">
          {
            this.state.confirmed === true ?
            <div>
              <button onClick={this.cancel} className="dcmt-button">{t("Cancel")}</button>
              <hr/>
              <button onClick={this.finishUp} className="dcmt-button button-success">{t("ActivateEmployee")}</button>
            </div>
            :
            <button onClick={this.confirm} className="dcmt-button">{t("Confirm")}</button>
          }
          <hr/>
          <ResultBlock
            errorBlock={this.state.errorBlock}
            errorOnly={false}
          />
        </div>
      </div>
    );
  }
}

export default translate("EmployeesRowUnfurl")(EmployeesRowUnfurl);
