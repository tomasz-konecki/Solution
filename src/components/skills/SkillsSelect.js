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
      alreadyAdded: {}
    };

    this.props.alreadySelected.map((skill) => {
      this.state.alreadyAdded[skill.skillId] = true;
    });
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

  render() {
    return <div className="col-sm-4">
    {
      Object.entries(this.props.skills).map(([id, skill], index) => {
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
    </div>;
  }
}

function mapStateToProps(state) {
  return {
    skills: state.skillsReducer.skills,
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
