import React, { Component } from 'react'
import './skills.scss';
import ProgressPicker from '../progressPicker/progressPicker';
import { getRandomColor } from '../../../services/methods';
import SmallSpinner from '../spinner/small-spinner';
import Modal from "react-responsive-modal";
import Spinner from '../spinner/spinner';

class Skills extends Component{
    state = {
        items: [],
        isChanging: false,
        currentChangingIndex: null, 
        changedValue: null,
        addSkillsModal: false,
        isLoadingSkillsForModal: false,
        allSkills: [],
        newSkillsList: []
    }
    fetchSkillsOnStart = skills => {
        const newSkills = [];
        for(let i = 0; i < skills.length; i++){
            newSkills.push({startValue: skills[i].skillLevel, obj: skills[i], color: getRandomColor(), 
                loading: false, error: ""});
        }
        return newSkills;
    }
    componentDidMount(){
        this.setState({items: this.fetchSkillsOnStart(this.props.items)})
    }
    componentWillReceiveProps(nextProps){
      if(this.props.items !== nextProps.items){
        this.setState({isChanging: false, items: this.fetchSkillsOnStart(nextProps.items)});
      }
      else if(this.props.errors !== nextProps.errors)
        this.setState({isChanging: false});
      else if(nextProps.loadedSkills && nextProps.loadSkillsStatus){
          this.setState({allSkills: this.fetchSkillsOnStart(nextProps.loadedSkills), 
            isLoadingSkillsForModal: false});
      }
      else if(this.props.loadSkillsErrors !== nextProps.loadSkillsErrors)
        this.setState({isLoadingSkillsForModal: false});
    }
    
    changeSkill = (valueToChange, index, listName) => {
        const skill = valueToChange+1;
        const items = [...this.state[listName]];
        items[index].startValue = skill;
        
        this.setState({[listName]: items});
    }
    createProgressBtns = (number, color, startVal, index, listName) => {
        const btnsArray = [];
        const items  = [...this.state[listName]];
        for(let i = 0; i < number; i++){
            btnsArray.push(
            <span style={{backgroundColor: i+1 <= startVal ? `${color}` : null}} 
            onClick={e => this.changeSkill(i, index, listName)} key={i}>
                {i+1 === startVal ? <i>{startVal/5 * 100}%</i> : null}
            </span>);
        }
        return btnsArray;
    }
    saveChangedSkills = () => {
        this.setState({isChanging: true});
        this.props.changeProjectSkills(this.props.projectId, this.state.items);
    }
    getAllSkills = () => {
        if(this.props.loadedSkills.length === 0){
            this.setState({addSkillsModal: true, isLoadingSkillsForModal: true});
            this.props.getAllSkills();
        }
        else
            this.setState({addSkillsModal: true});
        
    }
    render(){
        const { isChanging } = this.state;
        const { addSkillsModal } = this.state;
        const { isLoadingSkillsForModal } = this.state;
        const { allSkills } = this.state;
        const { items } = this.state;

        const { loadSkillsStatus } = this.props;
        const { loadSkillsErrors } = this.props;
        return(
        <div className="progress-bars-container">
            <h3>{this.props.title}
                {this.props.status === false && 
                <span>{this.props.errors[0]}</span>}

                {isChanging && 
                    <SmallSpinner />
                }
                <i onClick={this.getAllSkills} 
                    className="fa fa-plus"></i>
            </h3>
            {items.map((i, index) => {
                return (
                    <div  
                    key={i.obj.skillId} className="progress-bar-container">
                        <b>{i.obj.skillName}</b>
                        <ProgressPicker 
                            createResult={this.createProgressBtns(5, i.color, i.startValue, index, "items")}
                        />
                        {i.startValue !== i.obj.skillLevel && 
                            <i className="fa fa-save"></i>
                        }
                    </div>
                )
            })}

            {this.state.items.length > 0 && 
                <button onClick={this.saveChangedSkills} className="option-btn green-btn btn-abs" >
                    Zapisz zmiany
                </button>
            }
            <Modal
                key={1}
                open={addSkillsModal}
                classNames={{ modal: "Modal Modal-add-owner" }}
                contentLabel="Edit project modal"
                onClose={() => this.setState({addSkillsModal: false})}>

                <header>
                    <h3 className="section-heading">Dodaj umiejętność do projektu </h3>
                </header>


                {isLoadingSkillsForModal && <Spinner />}
                <div className="modal-container">
                    {loadSkillsStatus !== null && 
                        loadSkillsStatus ? 
                        <div className="modal-progress-br-container">
                        {allSkills.map((skill, index) => {
                            return (
                            <div key={skill.obj.id}
                                className="progress-bar-container">
                                    <b>{skill.obj.name}</b>
                                    <ProgressPicker 
                                        createResult={this.createProgressBtns(5, skill.color, skill.startValue, index, "allSkills")}
                                    />
                                    <i className="fa fa-plus"></i>
                            </div> )
                            })}
                        
                        </div>
                        : 
                        <p className="server-error">{loadSkillsErrors[0]}</p>
                    }
                    {isLoadingSkillsForModal || 
                    <button onClick={this.addSkillToProject} className="option-btn green-btn">
                        Zatwierdź
                    </button>
                    }
                </div>
               
               
            </Modal>     
            
        </div>
        );
    }
}

export default Skills;