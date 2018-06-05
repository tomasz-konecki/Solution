import React, { Component } from 'react';
import WebApi from './../../api/index';
import IntermediateBlock from './../common/IntermediateBlock';
import SkillRow from './SkillRow';
import ResultBlock from './../common/ResultBlock';

class SkillsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      replyBlock: {}
    };
  }
  componentDidMount() {
    this.loadSkills();
  }

  loadSkills = () => {
    WebApi.skills.get.all()
      .then(reply => {
        this.setState({
          loaded: true,
          skills: reply.extractData(),
          replyBlock: reply
        });
      })
      .catch(e => {
        this.setState({
          loaded: true,
          replyBlock: e,
          message: e.getMostSignificantText()
        });
      });
  }

  skillEdit = (skillObject, deletion) => {
    if(deletion){
      this.setState({
        loaded: false
      }, () => WebApi.skills.delete(skillObject.skillId)
      .then(reply => {
        let skills = this.state.skills;
        delete skills[skillObject.skillId];
        this.setState({
          lastDeletedSkill: skillObject,
          message: `Pomyślnie usunięto umiejętność '${skillObject.skillName}'`
        }); //, () => this.loadSkills());
      })
      .catch(e => {
        let msg = e.getMostSignificantText();
        console.log(msg, e.diagnosis);
        this.setState({
          loaded: true,
          replyBlock: e,
          message: msg === "" ? e.diagnosis : msg
        });
      }));
    }
  }

  pullSkillsColumn = () => {
    return <div>
      <input style={{marginTop: '10px'}} className="form-control" type="text"/>
      <div className="scroll-container">
      {
        Object.entries(this.state.skills).map(([id, skillObject], index) => {
          skillObject.skillId = id;
          return <SkillRow
            key={index}
            skill={skillObject}
            handleSkillEdit={this.skillEdit}
            delo
          />;
        })
      }
      </div>
    </div>;
  }

  pullDOM = () => {
    return <div className="content-container skills-container form-group row">
      <div className="row">
        <div className="col-lg-3">
          <IntermediateBlock
            loaded={this.state.loaded}
            render={this.pullSkillsColumn}
            resultBlock={this.props.replyBlock}
          />
        </div>
        <div className="col-lg-9 internum">
          {this.state.message}
        </div>
      </div>
    </div>;
  }

  render() {
    return this.pullDOM();
  }
}

export default SkillsContainer;
