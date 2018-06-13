import React, { Component } from 'react';
import WebApi from './../../api/index';
import IntermediateBlock from './../common/IntermediateBlock';
import SkillRow from './SkillRow';
import ResultBlock from './../common/ResultBlock';
import { translate } from 'react-translate';

class SkillsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      replyBlock: {},
      search: ""
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
          message: `✖ ${e.getMostSignificantText()}`
        });
      });
  }

  removeMessage = () => {
    setTimeout(() => {
      this.setState({
        message: ""
      });
    }, 5000);
  }

  onSearchChange = (e) => {
    this.setState({
      search: e.target.value
    });
  }

  skillEdit = (skillObject, deletion) => {
    const { t } = this.props;
    if(deletion){
      this.setState({
        loaded: false
      }, () => WebApi.skills.delete(skillObject.skillId)
      .then(reply => {
        let skills = this.state.skills;
        delete skills[skillObject.skillId];
        this.setState({
          lastDeletedSkill: skillObject,
          message: `✔ ${t("SuccessfullyDeleted")} '${skillObject.skillName}'`,
          loaded: true
        }, () => this.loadSkills());
        this.removeMessage();
      })
      .catch(e => {
        let msg = e.getMostSignificantText();
        this.setState({
          loaded: true,
          replyBlock: e,
          message: `✖ ${msg === "" ? e.diagnosis : msg}`
        });
        this.removeMessage();
      }));
    }
  }

  pullSkillsColumn = () => {
    return <div>
      <input onChange={this.onSearchChange} style={{marginTop: '10px'}} className="form-control" type="text"/>
      <div className="scroll-container">
      {
        Object.entries(this.state.skills).map(([id, skillObject], index) => {
          if(this.state.search !== ""
          && skillObject.name.toLocaleLowerCase().indexOf(this.state.search.toLocaleLowerCase()) === -1) return null;
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
    const { t } = this.props;
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
          <h2>{t("Deletion")}</h2> <br/>
          <p>
            {t('Info1')} <br/>
            {t('Info2')}>
          </p>
          <hr/>
          {this.state.message}
        </div>
      </div>
    </div>;
  }

  render() {
    return this.pullDOM();
  }
}

export default translate("SkillsContainer")(SkillsContainer);
