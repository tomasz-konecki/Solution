import React, { Component } from 'react'
import './skills.scss';
import ProgressPicker from '../progressPicker/progressPicker';
import { getRandomColor } from '../../../services/methods';
import SmallSpinner from '../spinner/small-spinner';
class Skills extends Component{
    state = {
        items: [],
        isChanging: false,
        currentChangingIndex: null, 
        changedValue: null
        
    }
    fetchSkillsOnStart = skills => {
        const newSkills = [];
        for(let i = 0; i < skills.length; i++){
            newSkills.push({startValue: skills[i].coveredAtLevel, obj: skills[i], color: getRandomColor(), 
                loading: false, error: ""});
        }
        return newSkills;
    }
    componentDidMount(){
        this.setState({items: this.fetchSkillsOnStart(this.props.items)})
    }
    changeSkill = (valueToChange, index) => {
        const skill = valueToChange+1;
        const items = [...this.state.items];
        items[index].startValue = skill;
        
        this.setState({isChanging: true, items: items});
    }
    createProgressBtns = (number, color, startVal, index) => {
        const btnsArray = [];
        for(let i = 0; i < number; i++){
            btnsArray.push(<span style={{backgroundColor: i+1 <= startVal ? `${color}` : null}} 
            onClick={e => this.changeSkill(i, index)} 
                key={i}>
                {i+1 === startVal ? <i>{startVal/5 * 100}%</i> : null}
            </span>);
        }
        return btnsArray;
    }
    render(){
        return(
        <div className="progress-bars-container">
            <h3>{this.props.title}
                {this.props.status === false && 
                <span>{this.props.errors[0]}</span>}
            </h3>
            {this.state.items.map((i, index) => {
                return (
                    <div  
                    key={i.obj.skillId} className="progress-bar-container">
                        <b>{i.obj.skillName}</b>
                        <ProgressPicker 
                            createResult={this.createProgressBtns(5, i.color, i.startValue, index)}
                        />
                    </div>
                )
            })}
            <button className="option-btn green-btn">
                Zapisz zmiany
            </button>
        </div>
        );
    }
}

export default Skills;