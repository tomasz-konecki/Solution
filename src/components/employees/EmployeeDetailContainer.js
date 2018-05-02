import React, { Component } from 'react';
import LoaderCircular from './../common/LoaderCircular';
import Icon from './../common/Icon';
import DCMTWebApi from '../../api';
import { withRouter } from 'react-router';
import DetailCascade from './DetailCascade';
import SkillRow from './../skills/SkillRow';
import CapacitySlider from './CapacitySlider';
import SenioritySlider from './SenioritySlider';

class EmployeeDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      confirmed: false,
      invalidated: false,
      employeeLoadedSuccessfully: false
    };
  }

  componentDidMount() {
    this.getEmployee();
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

  getEmployee() {
    this.setState({
      loading: true
    }, () => {
      DCMTWebApi.getEmployee(this.props.match.params.id)
      .then((result) => {
        console.log('EMPLOYEE', result.data.dtoObject);
        this.setState({
          errorBlock: {
            result
          },
          skills: result.data.dtoObject.skills,
          loading: false,
          employeeLoadedSuccessfully: true,
          employee: result.data.dtoObject,
          capacityLevel: this.capacityLevelToFraction(result.data.dtoObject.baseCapacity, true),
          seniorityLevel: this.seniorityLevelToString(result.data.dtoObject.seniority, true)
        });
      })
      .catch((error) => {
        this.setState({
          errorBlock: error,
          loading: false
        });
      });
    });
  }

  getEmploSkills() {
    DCMTWebApi.getEmploSkills(this.props.match.params.id)
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

  mapSkills(skills, editable = false) {
    return skills.map((skillObject, index) => {
      return (
        <SkillRow
          key={index}
          skill={skillObject}
          handleSkillEdit={this.handleSkillEdit}
          editable={false}
        />
      );
    });
  }

  pullDOM = () => {
    if(!this.state.employeeLoadedSuccessfully) return "Brak danych";
    const { employee } = this.state;
    return <div className="row">
      <div className="col-sm-4 employee-id-block">
        <Icon icon="address-card" iconSize="2x"/>
        <h1>{employee.firstName} {employee.lastName}</h1>
        {
          employee.hasAccount ?
            <h3 className="employee-active">Aktywny</h3>
          : <h3 className="employee-inactive">Nieaktywny</h3>
        }
        <hr className="sharp"/>
        <div className="employee-headway">
          <DetailCascade lKey={'Stanowisko'} rVal={employee.title} lColSize={4} rColSize={7} />
          <DetailCascade lKey={'Stopień'} rVal={employee.seniority} lColSize={4} rColSize={7} />
        </div>
        <hr className="sharp"/>
        <div className="employee-headway">
          <DetailCascade lKey={'Lokalizacja'} rVal={employee.localization} lColSize={4} rColSize={7} />
          <DetailCascade lKey={'Email'} rVal={employee.email} lColSize={4} rColSize={7} />
          <DetailCascade lKey={'Telefon'} rVal={employee.phoneNumber} lColSize={4} rColSize={7} defVal="<brak>"/>
        </div>
        <hr className="sharp"/>
        <div className="row employee-headway">
          <div className="col-sm-3">
            <SenioritySlider seniorityLevel={this.state.seniorityLevel} editable={false}/>
          </div>
          <div className="col-sm-9">
            <CapacitySlider
              capacityLevel={this.capacityLevelToFraction(employee.baseCapacity, true)}
              capacityLeft={this.capacityLevelToFraction(employee.capacityLeft, true)}
              editable={false}
            />
          </div>
        </div>
      </div>
      <div className="col-sm-7 employee-headway">
        {this.mapSkills(this.state.skills)}
      </div>
      <div className="col-sm-1 employee-headway full-width-button">
        <button className="dcmt-button">
          Edit
        </button>
      </div>
    </div>;
  };

  render() {
    return (
      <div className="content-container employee-detail-container">
        { this.state.loading ? <LoaderCircular/> : this.pullDOM() }
      </div>
    );
  }
}

export default withRouter(EmployeeDetailContainer);
