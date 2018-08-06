import React from 'react'
import './employeSkills.scss';
import Skill from './skill';
import { getRandomColor } from '../../../../services/methods'
import Button from '../../../common/button/button';
import SmallSpinner from '../../../common/spinner/small-spinner';
import CorrectOperation from '../../../common/correctOperation/correctOperation';
import Modal from 'react-responsive-modal';
const minYearsOfExp = 1;
const maxYearsOfExp = 28;

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
            this.props.limit),
        isChangingSkills: false,
        numberOfChanges: 0
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
        this.setState({skills: skills, numberOfChanges: this.state.numberOfChanges + 1});
    }   
    shouldComponentUpdate(nextState){
      if(nextState.skills === this.state.skills || 
        nextState.isChangingSkills !== this.state.isChangingSkills)
        return true;
      
      return false;
    }
    componentWillReceiveProps(nextProps){
      if(this.props.changeSkillsErrors !== nextProps.changeSkillsErrors)
        this.setState({isChangingSkills: false});
    }
    
    downgradeYears = index => {
        const { skills, numberOfChanges } = this.state;
        
        if(skills[index].skill.yearsOfExperience > minYearsOfExp){
            const skills = [...this.state.skills];
            const currentYearsOfExp = skills[index].skill.yearsOfExperience;
            skills[index].skill.yearsOfExperience = currentYearsOfExp - 1;
            this.setState({skills: skills, numberOfChanges: numberOfChanges + 1});
        }
    }
    increaseYears = index => {
        const { skills, numberOfChanges } = this.state;
        if(skills[index].skill.yearsOfExperience < maxYearsOfExp){
            const skills = [...this.state.skills];
            const currentYearsOfExp = skills[index].skill.yearsOfExperience;
            skills[index].skill.yearsOfExperience = currentYearsOfExp + 1;
            this.setState({skills: skills, numberOfChanges: numberOfChanges + 1});
        }
    }
    saveSkills = () => {
        const { changeEmployeeSkillsACreator, employeeId } = this.props;
        const { skills } = this.state;
        this.setState({isChangingSkills: true});
        changeEmployeeSkillsACreator(employeeId, skills);
    }
   
    render(){
        const { skills, isChangingSkills } = this.state;
        const { changeSkillsStatus } = this.props;
        return (
            <section className="employee-skills">
                <h2>Umiejętności {isChangingSkills && <SmallSpinner />} {changeSkillsStatus === true && <CorrectOperation />}</h2>
                <ul className="emp-skills-container">
                    {skills.length > 0 ?
                        skills.map((skill, index) => {
                        return (
                            <Skill 
                            increaseYears={() => this.increaseYears(index)}
                            downgradeYears={() => this.downgradeYears(index)}
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
                        <i className="fa fa-plus"></i>
                        Brak umiejętności
                        <i className="fa fa-fire"></i>
                    </div>
                    }
                    {skills && 
                        skills.length > 0 && 
                        <Button onClick={this.saveSkills}
                        title="Zapisz zmiany" 
                        mainClass="option-btn green-btn" 
                        disable={isChangingSkills} />
                    }
                    
                </ul>
            </section>
        );
    }
}

export default EmployeeSkills;