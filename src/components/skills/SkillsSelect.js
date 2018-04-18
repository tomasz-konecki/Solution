import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as skillsActions from "../../actions/skillsActions";
import * as asyncActions from "../../actions/asyncActions";
import ProjectSkill from './../projects/ProjectSkill';

class SkillsSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadyAdded: {},
      newSkill: "",
      search: "",
      adding: false
    };

    this.props.alreadySelected.map((skill) => {
      this.state.alreadyAdded[skill.skillId] = true;
    });

    this.handleAddSkillClick = this.handleAddSkillClick.bind(this);
    this.handleNewSkillChange = this.handleNewSkillChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.props.skillsAction.loadSkills();
  }

  handleSkillSelect(skill) {
    return (event) => {
      const hasBeenAdded = this.props.skillSelected(skill);
      if(hasBeenAdded) {
        let { alreadyAdded } = this.state;
        alreadyAdded[skill.skillId] = true;

        this.setState({
          alreadyAdded
        });
      }
    };
  }

  handleNewSkillChange(event) {
    this.setState({newSkill: event.target.value});
  }

  handleSearchChange(event) {
    this.setState({search: event.target.value.toLowerCase()});
  }

  handleAddSkillClick() {
    this.setState({
      adding: true
    }, () => {
      this.props.skillsAction.addSkill(this.state.newSkill);
    });
  }

  render() {
    return <div className="row skills-select">
      <div className="skills-list col-sm-4">
      <input value={this.state.search} onChange={this.handleSearchChange} type="text" className="form-control form-control-sm skills-input-filter"/>
      {
        Object.entries(this.props.skills).map(([id, skill], index) => {
          console.log(skill.name.toLowerCase().indexOf(this.state.search), skill.name.toLowerCase(), this.state.search);
          if(this.state.search !== "" && skill.name.toLowerCase().indexOf(this.state.search) < 0) return null;
          const skillObject = {
            skillId: id - 0,
            skillName: skill.name,
            skillLevel: 1
          };
          return <div onClick={this.handleSkillSelect(skillObject)} key={index}>
            <ProjectSkill duplicate={this.state.alreadyAdded[skillObject.skillId]} cut editable={false} skillObject={skillObject} />
          </div>;
        })
      }
      </div>
      <div className="col-sm-7">
        Dodaj nowy:
        <br/>
        <br/>
        <input value={this.state.newSkill} onChange={this.handleNewSkillChange} type="text" className="form-control form-control-sm"/>
        <button onClick={this.handleAddSkillClick} className="dcmt-button button-success">Dodaj</button>
        { this.state.adding ?
        <div>
          <hr/>
          Dodawanie... {
            this.props.success === true ?
            "OK" : "Błąd " + this.props.success
           }
        </div> : null
        }
      </div>
    </div>;
  }
}

function mapStateToProps(state) {
  return {
    skills: state.skillsReducer.skills,
    success: state.skillsReducer.success,
    loading: state.asyncReducer.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    skillsAction: bindActionCreators(skillsActions, dispatch),
    async: bindActionCreators(asyncActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillsSelect);
