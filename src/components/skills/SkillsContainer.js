import React, { Component } from 'react';
import WebApi from './../../api/index';
import IntermediateBlock from './../common/IntermediateBlock';
import SkillRow from './SkillRow';

class SkillsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      replyBlock: {}
    };
  }
  componentDidMount() {
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
          replyBlock: e
        });
      });
  }

  pullDOM = () => {
    return <div className="content-container skills-container">
      {
        Object.entries(this.state.skills).map(([_i, skillObject], index) => {
          return <SkillRow
            key={index}
            skill={skillObject}
            delo={true}
          />;
        })
      }
    </div>;
  }

  render() {
    return <IntermediateBlock
      loaded={this.state.loaded}
      render={this.pullDOM}
      resultBlock={this.props.replyBlock}
      _className="content-container"
    />;
  }
}

export default SkillsContainer;
