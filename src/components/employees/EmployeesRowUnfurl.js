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
      confirmed: false,
      invalidated: false
    };

    this.handleSkillEdit = this.handleSkillEdit.bind(this);
    this.getYearsOfExperience = this.getYearsOfExperience.bind(this);
    this.handleSeniorityChange = this.handleSeniorityChange.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
    this.getEmploSkills = this.getEmploSkills.bind(this);
    this.getEmployee = this.getEmployee.bind(this);
    this.finishUp = this.finishUp.bind(this);
  }

  componentDidMount() {
    if(this.state.toUnfurl.hasAccount) this.getEmployee(this.state.toUnfurl.id);
    else this.getEmploSkills();
  }

  capacityLevelToFraction(level, reverse = false) {
    if(reverse) switch(level){
      case 0.2: return 1;
      case 0.25: return 2;
      case 0.5: return 3;
      case 0.75: return 4;
      case 1: return 5;
    }
    switch(level){
      case 1: return 0.2;
      case 2: return 0.25;
      case 3: return 0.5;
      case 4: return 0.75;
      case 5: return 1;
    }
  }

  seniorityLevelToString(level, reverse = false) {
    if(reverse) switch(level){
      case "Junior": return 1;
      case "Pro": return 2;
      case "Senior": return 3;
      case "Lead": return 4;
    }
    switch(level){
      case 1: return "Junior";
      case 2: return "Pro";
      case 3: return "Senior";
      case 4: return "Lead";
    }
  }

  getEmploSkills() {
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

  getEmployee(id) {
    DCMTWebApi.getEmployee(this.state.toUnfurl.id)
      .then((result) => {
        this.setState({
          errorBlock: {
            result
          },
          skills: result.data.dtoObject.skills,
          loadingSkills: false,
          confirmed: true,
          employee: result.data.dtoObject,
          capacityLevel: this.capacityLevelToFraction(result.data.dtoObject.baseCapacity, true),
          seniorityLevel: this.seniorityLevelToString(result.data.dtoObject.seniority, true)
        });
      })
      .catch((error) => {
        this.setState({
          errorBlock: error,
          loadingSkills: false,
          confirmed: true,
          invalidated: true
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
          skillId: skill.id,
          skillLevel: skill.level,
          yearsOfExperience: skill.yearsOfExperience
        };
      }
      newSkills.push(skill);
    });
    DCMTWebApi
      .addEmployee(
        this.state.toUnfurl.id,
        this.capacityLevelToFraction(this.state.capacityLevel),
        this.seniorityLevelToString(this.state.seniorityLevel),
        newSkills
      )
      .then((confirmation) => {
        this.setState({
          errorBlock: {
            result: confirmation
          },
          loadingSkills: false
        }, () => {
          this.props.handles.refresh();
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
            this.state.confirmed === true && (!this.state.invalidated) ?
            <div>
              <button onClick={this.cancel} className="dcmt-button">{t("Cancel")}</button>
              <hr/>
              <button onClick={this.finishUp} className="dcmt-button button-success">{t("ActivateEmployee")}</button>
            </div>
            :
            this.state.invalidated ?
            "Brak danych"
            : <button onClick={this.confirm} className="dcmt-button">{t("Confirm")}</button>
          }
          <hr/>
          <ResultBlock
            errorBlock={this.state.errorBlock}
            errorOnly={false}
            successMessage="Aktywowano"
          />
        </div>
      </div>
    );
  }
}

export default translate("EmployeesRowUnfurl")(EmployeesRowUnfurl);
