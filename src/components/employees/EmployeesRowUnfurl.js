import React, { Component } from 'react';
import { translate } from 'react-translate';
import DCMTWebApi from '../../api';
import ResultBlock from '../common/ResultBlock';
import ProjectSkill from './../projects/ProjectSkill';
import LoaderHorizontal from './../common/LoaderHorizontal';

class EmployeesRowUnfurl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toUnfurl: this.props.toUnfurl,
      errorBlock: {},
      skills: [],
      loadingSkills: true,
      changesMade: false,
      value: 0
    };

    this.handleSkillEdit = this.handleSkillEdit.bind(this);
    this.getYearsOfExperience = this.getYearsOfExperience.bind(this);
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
        }, () => console.log(this.state.skills));
      }
    });
  }

  handleRangeChange(skillObject) {
    return (event) => {
      console.log(skillObject, event.target.value);
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

  mapSkills(skills, editable = false) {
    return skills.map((skillObject, index) => {
      return (
        <div className="col-sm-4" key={index}>
          <ProjectSkill skillEdited={this.handleSkillEdit} editable skillObject={skillObject}/>
          <div className="form-group">
            Years of experience: {this.getYearsOfExperience(index)}
            <br/>
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
            {this.mapSkills(this.state.skills)}
          </div>
          {this.state.loadingSkills ? <LoaderHorizontal/> : null}
          <hr/>
          <ResultBlock
            errorBlock={this.errorBlock}
            errorOnly={false}
          />
        </div>
        <div className="col-sm-2">
          <button className="dcmt-button button-success">{t("ActivateEmployee")}</button>
        </div>
      </div>
    );
  }
}

export default translate("EmployeesRowUnfurl")(EmployeesRowUnfurl);
