import React from 'react'
import './employeSkills.scss';
import Skill from './skill';
import { getRandomColor } from '../../../../services/methods'
import Button from '../../../common/button/button';

const createSkillArchitecture = (skills, limit) => {
    if(!skills)
        return [];

    const skillsWithAddData = [];
    for(let key in skills){
        const width = (skills[key].level/limit)*100;
        skillsWithAddData.push({skill: skills[key], markupWidth: skills[key].level * 100/limit,
            color: getRandomColor(), width: width, startLevel: skills[key].level})
    }
    return skillsWithAddData;   
}


class EmployeeSkills extends React.Component{
    state = {
        skills: createSkillArchitecture(this.props.skills, 
            this.props.limit)
    }
    createSpans = arrayElementIndex => {
        const spans = [];
        for(let i = 0; i < this.props.limit; i++){
            spans.push(
            <span key={i} style={{width: `${this.state.skills[0].width}%`}}
                onClick={() => this.changeWidthOfSpan(i+1, arrayElementIndex)}>
            </span>);
        }
        return spans;
    }
    changeWidthOfSpan = (spanIndex, arrayElementIndex) => {
        const skills = [...this.state.skills];
        skills[arrayElementIndex].markupWidth = (100/this.props.limit)*spanIndex;
        skills[arrayElementIndex].skill.level = spanIndex;
        this.setState({skills: skills});
    }   
    shouldComponentUpdate(nextState){
      if(nextState.skills !== this.state.skills)
        return true;
      
      return false;
    }
    
    render(){
        const { skills } = this.state;
        return (
            <section className="employee-skills">
                <h2>Umiejętności</h2>
                <ul className="emp-skills-container">
                    {skills.length > 0 ?
                        skills.map((skill, index) => {
                        return (
                            <Skill 
                            experience={skill.skill.yearsOfExperience}
                            background={skill.color}
                            arrayElementIndex={index}
                            markupWidth={skill.markupWidth}
                            skillName={skill.skill.name} 
                            createSpans={this.createSpans} 
                            key={skill.skill.id}/>
                        );
                    }) : 
                    <div className="empty-skills">
                        Brak umiejętności
                        <i className="fa fa-fire"></i>
                    </div>
                    }
                </ul>
                
            </section>
        );
    }
}

export default EmployeeSkills;