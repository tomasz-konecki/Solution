import React, { Component } from 'react';
import { translate } from 'react-translate';
import WebApi from '../../api';
import ResultBlock from '../common/ResultBlock';
import ProjectSkill from './../projects/ProjectSkill';
import LoaderHorizontal from './../common/LoaderHorizontal';
import SeniorityBlock from './SeniorityBlock';
import CapacityBlock from './CapacityBlock';
import Modal from 'react-responsive-modal';
import SkillsSelect from '../skills/SkillsSelect';
import SkillRow from './../skills/SkillRow';
import SenioritySlider from './SenioritySlider';
import CapacitySlider from './CapacitySlider';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

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
      seniorityLevel: undefined,
      capacityLevel: undefined,
      confirmed: false,
      invalidated: false,
      employee: {},
      edit: false,
      showModal: false
    };

    this.getEmploSkills = this.getEmploSkills.bind(this);
    this.getEmployee = this.getEmployee.bind(this);
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
    WebApi.employees.get.emplo.skills(this.state.toUnfurl.id)
      .then((emploSkills) => {
        this.setState({
          errorBlock: emploSkills,
          skills: emploSkills.extractData(),
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
    WebApi.employees.get.byEmployee(this.state.toUnfurl.id)
      .then((result) => {
        let extract = result.extractData();
        this.setState({
          errorBlock: result,
          skills: extract.skills,
          loadingSkills: false,
          confirmed: true,
          employee: extract,
          capacityLevel: extract.baseCapacity,
          capacityLeft: extract.capacityLeft,
          seniorityLevel: this.seniorityLevelToString(extract.seniority, true)
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

  getYearsOfExperience(index){
    if(this.state.skills[index].yearsOfExperience !== undefined)
      return this.state.skills[index].yearsOfExperience;
    else return 0;
  }

  mapSkills(skills, editable = false) {
    return skills.map((skillObject, index) => {
      return (
        <SkillRow
          key={index}
          skill={skillObject}
          handleSkillEdit={() => {}}
          editable={false}
        />
      );
    });
  }

  goToEmployeeMoreDetails = (id) => {
    return (event) => {
      this.props.dispatch(push(`/main/employees/${id}`));
    };
  }

  render() {
    const { t } = this.props;
    return (
      <div className="row">
        <div className="col-sm-10">
          {this.state.loadingSkills ? <LoaderHorizontal/> : null}
          <div className="row">
            <div className="col-sm-7">
            {
              this.state.skills !== undefined ?
              this.state.skills.length > 0 ? this.mapSkills(this.state.skills)
              : "Brak umiejętności na koncie Emplo"
              : "Brak danych"
            }
            </div>
            <div className="col-sm-5">
            {
              this.state.seniorityLevel !== undefined ? <div className="row">
                <div className="col-sm-4">
                  <SenioritySlider seniorityLevel={this.state.seniorityLevel} editable={false}/>
                </div>
                <div className="col-sm-8">
                  <CapacitySlider capacityLeft={this.state.capacityLevel} capacityLevel={this.state.capacityLevel} editable={false}/>
                </div>
              </div>
              : "Brak danych"
            }
            </div>
          </div>
          <hr/>
        </div>
        <div className="col-sm-2 full-width-button">
          <button onClick={this.goToEmployeeMoreDetails(this.state.toUnfurl.id)} className="dcmt-button">Więcej</button>
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

export default connect()(translate("EmployeesRowUnfurl")(EmployeesRowUnfurl));
