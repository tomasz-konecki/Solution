import React from 'react'
import './employeSkills.scss';
import Skill from './skill';
import { getRandomColor, contains } from '../../../../services/methods'
import Button from '../../../common/button/button';
import SmallSpinner from '../../../common/spinner/small-spinner';
import CorrectOperation from '../../../common/correctOperation/correctOperation';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { getAllSkillsForEmployee } from '../../../../actions/skillsActions';
import { addNewSkillsToEmployeeACreator, addNewSkillsToEmployee } from '../../../../actions/employeesActions';
import Spinner from '../../../common/spinner/spinner';
import SpinnerButton from '../../../form/spinner-btn/spinner-btn';
import EmptyContent from '../../../common/empty-content/empty-content';
import { translate } from "react-translate";

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
        changedIndexes: [],
        showAddNewSkillsModal: false,
        isLoadingAllSkills: false,
        copiedAllSkills: [],
        skillsToAdd: [],

        showSkillsToAdd: false,
        showSearchBar: false,
        searchValue: "",

        searchedSkills: [],
        isAddingNewSkills: false,
        didUserDeleteSkill: false
    }
    componentDidMount(){
        const { skills, getAllSkillsForEmployee } = this.props;
        getAllSkillsForEmployee(skills);
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
        const changedIndexes = [...this.state.changedIndexes];
        skills[arrayElementIndex].markupWidth = (100/this.props.limit)*spanIndex;
        skills[arrayElementIndex].skill.level = spanIndex;

        if(!contains(arrayElementIndex, changedIndexes))
            changedIndexes.push(arrayElementIndex);

        this.setState({skills: skills, changedIndexes: changedIndexes});
    }   
    shouldComponentUpdate(nextState){
      if(nextState.skills === this.state.skills || 
        nextState.isChangingSkills !== this.state.isChangingSkills)
        return true;
      
      return false;
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.changeSkillsStatus){
        this.setState({isChangingSkills: false, changedIndexes: [], didUserDeleteSkill: false});
      }
      else if(this.props.changeSkillsErrors !== nextProps.changeSkillsErrors)
        this.setState({isChangingSkills: false});
      else if(nextProps.skills !== this.props.skills){
        const newSkills = createSkillArchitecture(nextProps.skills, 
            nextProps.limit);
        this.setState({skills: newSkills, isAddingNewSkills: false});
      }
      else if(this.props.addNewSkillsErrors !== nextProps.addNewSkillsErrors){
            if(nextProps.addNewSkillsStatus){
                setTimeout(() => {
                    this.closeModal();
                }, 2000);
            }
            this.setState({isAddingNewSkills: false});
      }
      else if(this.props.loadSkillsErrors !== nextProps.loadSkillsErrors){
          let copiedAllSkills = [];
          if(nextProps.loadSkillsStatus)
            copiedAllSkills = this.copySkills(nextProps.loadedSkills)
          this.setState({isLoadingAllSkills: false, copiedAllSkills: copiedAllSkills});
      }

    }
    copySkills = skills => {
        const copiedAllSkills = [];
        for(let key in skills)
            copiedAllSkills.push(skills[key]);
        return copiedAllSkills;
    }
    downgradeYears = index => {
        const { skills } = this.state;
        this.manageSkillChange(skills[index].skill.yearsOfExperience > minYearsOfExp, false, index);
    }

    increaseYears = index => {
        const { skills } = this.state;
        this.manageSkillChange(skills[index].skill.yearsOfExperience < maxYearsOfExp, 
            true, index);
    }
    manageSkillChange = (shouldChange, shouldAdd, index) => {
        if(shouldChange){
            const skills = [...this.state.skills];
            const changedIndexes = [...this.state.changedIndexes];
            const currentYearsOfExp = skills[index].skill.yearsOfExperience;
            
            skills[index].skill.yearsOfExperience = shouldAdd ? currentYearsOfExp + 1 : 
                currentYearsOfExp - 1;

           
            if(!contains(index, changedIndexes)){
                changedIndexes.push(index);
            }
      
            this.setState({skills: skills, changedIndexes: changedIndexes});
        }
    }
    saveSkills = () => {
        const { changeEmployeeSkillsACreator, employeeId } = this.props;
        const { skills } = this.state;
        this.setState({isChangingSkills: true});
        changeEmployeeSkillsACreator(employeeId, skills);
    }
    openSkillsModal = () => {
        const { loadSkillsStatus, getAllSkillsForEmployee, skills } = this.props;
        const shouldLoadSkillsAgain = loadSkillsStatus === false ? true : false;
        this.setState({showAddNewSkillsModal: true, 
            isLoadingAllSkills: shouldLoadSkillsAgain});
        if(shouldLoadSkillsAgain)
            getAllSkillsForEmployee(skills);
    }

    addNewSkill = skillName => {
        const skillsToAdd = [...this.state.skillsToAdd];
        const copiedAllSkills = [...this.state.copiedAllSkills];
        const searchedSkills = [...this.state.searchedSkills];

        const skillToAdd = copiedAllSkills.findIndex(i => {
            return i.name === skillName
        });
        skillsToAdd.push(copiedAllSkills[skillToAdd]);
        
        const searchedSkill = searchedSkills.findIndex(i => {
            return i.name === skillName
        });
        searchedSkills.splice(searchedSkill, 1);
        copiedAllSkills.splice(skillToAdd, 1);
        this.setState({skillsToAdd: skillsToAdd, copiedAllSkills: copiedAllSkills,  
            searchedSkills});
    }
    changeSkillsState = (skillName, shouldAdd) => {
        if(shouldAdd)
            this.addNewSkill(skillName);
        else
            this.removeSkillFromAdded(skillName);
    }
    removeSkillFromAdded = skillName => {
        const skillsToAdd = [...this.state.skillsToAdd];
        const copiedAllSkills = [...this.state.copiedAllSkills];
        const skillToRemove = skillsToAdd.findIndex(i => {
            return i.name === skillName
        });
        copiedAllSkills.push(skillsToAdd[skillToRemove]);
        
        skillsToAdd.splice(skillToRemove, 1);
        const shouldPushIntoAddCart = skillsToAdd.length !== 0;

        this.setState({skillsToAdd: skillsToAdd, copiedAllSkills: copiedAllSkills,
            showSkillsToAdd: shouldPushIntoAddCart});
    }
    onChange = e => {
        const valueToSearch = e.target.value.toLowerCase();
        const { showSkillsToAdd } = this.state;
        const searchedSkills = [];
        if(showSkillsToAdd){
            const skillsToAdd = [...this.state.skillsToAdd];
            for(let key in skillsToAdd)
                if(skillsToAdd[key].name.toLowerCase().search(valueToSearch) !== -1)
                    searchedSkills.push(skillsToAdd[key]);
        }
        else{
            const copiedAllSkills = [...this.state.copiedAllSkills];
            for(let key in copiedAllSkills)
                if(copiedAllSkills[key].name.toLowerCase().search(valueToSearch) !== -1)
                    searchedSkills.push(copiedAllSkills[key]);
        }
        this.setState({searchValue: e.target.value, 
            searchedSkills: searchedSkills});
    }
    clearSearchData = () => {
        this.setState({showSearchBar: false, searchedSkills: [], searchValue: ""});
    }
    closeModal = () =>{
        this.setState({showSearchBar: false, searchedSkills: [], 
            searchValue: "", showAddNewSkillsModal: false, skillsToAdd: [], 
            showSkillsToAdd: false});
        this.props.addNewSkillsToEmployee(null, []);
    } 
    
    showSearchBar = () => {
        const { showSkillsToAdd, skillsToAdd, copiedAllSkills } = this.state;
        const whichArrayToCopy = showSkillsToAdd ? [...skillsToAdd] : [...copiedAllSkills];

        this.setState({showSearchBar: true, searchedSkills: whichArrayToCopy});
    }

    saveNewAddedSkills = () => {
        const { addNewSkillsToEmployeeACreator, employeeId } = this.props;
        const { skillsToAdd, skills } = this.state;
        this.setState({isAddingNewSkills: true});
        addNewSkillsToEmployeeACreator(skills, skillsToAdd, employeeId);
    }

    removeSkill = index => {
        const currentSkills = [...this.state.skills];
        currentSkills.splice(index, 1);

        this.setState({skills: currentSkills, didUserDeleteSkill: true});
    }
    componentWillUnmount(){ this.props.addNewSkillsToEmployee(null, []); }
    
    render(){
        const { skills, isChangingSkills, changedIndexes, 
            showAddNewSkillsModal, isLoadingAllSkills, skillsToAdd, 
            copiedAllSkills, showSkillsToAdd, showSearchBar, searchValue,
            searchedSkills, isAddingNewSkills, didUserDeleteSkill } = this.state;
        const { changeSkillsStatus, loadSkillsStatus, loadSkillsErrors, loadedSkills,
            addNewSkillsStatus, addNewSkillsErrors, employeeHasAccount, employeeDeleted, t } = this.props;

        const listNameToShow = showSearchBar ? "searchedSkills" : 
            showSkillsToAdd ? "skillsToAdd" : "copiedAllSkills";

        const iconForSkills = showSkillsToAdd ? <i className="fa fa-minus"></i> : 
            <i className="fa fa-plus"></i>;
        
        const status = employeeDeleted ? "Usunięty" : employeeHasAccount ? 
            "Aktywny" : "Nieaktywny";
        return (
            <section className="employee-skills">
                <h2> {t("Skills")}
                    <span>
                    {!changeSkillsStatus && !isChangingSkills && status === "Aktywny" && 
                        <i onClick={this.openSkillsModal} className="fa fa-plus"></i>
                    }
                    {isChangingSkills && <SmallSpinner />} 
                    {changeSkillsStatus === true && <CorrectOperation />}
                    </span>
                </h2>
                <ul className="emp-skills-container">
                    {skills.length > 0 ?
                        skills.map((skill, index) => {
                        return (
                            <Skill 
                            removeSkill={() => this.removeSkill(index)}
                            showSavePrompt={changedIndexes.length > 0 ? 
                                contains(index, changedIndexes) : false
                            }
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
                    <EmptyContent sizeClass="skills-size"
                    action={status !== "Nieaktywny" ? this.openSkillsModal : null} 
                    shouldShowTopIcon={status !== "Nieaktywny"}
                    content={t("NoSkills")}
                    operationIcon="fa fa-plus"
                    mainIcon="fa fa-fire"
                    />
                    }
                
                </ul>
                    <Modal key={1}
                    open={showAddNewSkillsModal}
                    classNames={{ modal: "Modal Modal-add-owner" }}
                    contentLabel="Add skills modal"
                    onClose={this.closeModal}
                    >
                        {isLoadingAllSkills ? <Spinner /> : loadSkillsStatus ? 
                        <div className="modal-content-container">
                            {showSearchBar ? 
                                <header>
                                    <h3 className="section-heading">
                                    {t("Search")}
                                    </h3>
                                    <form>
                                        <label>{t("Search")}</label>
                                        <input onChange={e => this.onChange(e)}
                                        value={searchValue}
                                        type="text" placeholder={showSkillsToAdd ? 
                                            t("SearchInAdded") : t("SearchInAll")} />
                                        <i onClick={this.clearSearchData} className="fa fa-times"></i>
                                    </form>    
                                </header> : 

                                <header>
                                <h3 className="section-heading">
                                {t("ManageSkills")}
                                </h3>
                                <nav>
                                    {this.state[listNameToShow].length !== 0 && 
                                    <button onClick={this.showSearchBar}>
                                        {t("Find")}
                                        <i className="fa fa-search"></i>
                                    </button>
                                    }
                                    
                                    <button onClick={
                                        () => this.setState({showSkillsToAdd: !showSkillsToAdd})}>
                                        {showSkillsToAdd ? t("ShowAll") : t("ShowAdded") }
                                    </button>
                                </nav>    
                                </header>
                            }
                            {this.state[listNameToShow].length === 0 ? 
                                <p className="no-data-to-show"> {t("NoDataToShow")} </p>
                                : 
                                <ul>
                                {this.state[listNameToShow].map(skill => {
                                    return (
                                        <li onClick={() => this.changeSkillsState(skill.name, !showSkillsToAdd)} 
                                        key={skill.name}>
                                            {skill.name}
                                            {iconForSkills}
                                        </li>
                                    );
                                    })}   
                                </ul> 
                            }

                            <SpinnerButton 
                            submitResult={{
                                status: addNewSkillsStatus,
                                content: addNewSkillsStatus ? t("SkillsAddedSuccessfull") :     
                                addNewSkillsErrors && addNewSkillsErrors[0]
                            }}
                            onClickHandler={this.saveNewAddedSkills}
                            isLoading={isAddingNewSkills}
                            btnTitle={t("ApproveChanges")}
                            />
                            <div className="counters">
                                {skillsToAdd.length > 0 && 
                                    <p><b>{t("NewSkills")}: </b><span>{skillsToAdd.length}</span></p>
                                }
                            </div>
                        </div>
                        : <p className="empty-data">{loadSkillsErrors[0]}</p>
                        }
                    
                    </Modal>
                    {(changedIndexes.length > 0 || didUserDeleteSkill) && 
                    <Button onClick={this.saveSkills}
                    title="Zapisz zmiany" 
                    mainClass="option-btn green-btn" 
                    disable={isChangingSkills} />
                    }
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        loadedSkills: state.skillsReducer.loadedSkills,
        loadSkillsStatus: state.skillsReducer.loadSkillsStatus,
        loadSkillsErrors: state.skillsReducer.loadSkillsErrors,

        addNewSkillsStatus: state.employeesReducer.addNewSkillsStatus,
        addNewSkillsErrors: state.employeesReducer.addNewSkillsErrors
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        getAllSkillsForEmployee: (currentAddedSkills) => dispatch(getAllSkillsForEmployee(currentAddedSkills)),
        addNewSkillsToEmployeeACreator: (oldSkills, newSkills, employeeId) => dispatch(addNewSkillsToEmployeeACreator(oldSkills, newSkills, employeeId)),
        addNewSkillsToEmployee: (status, errors) => dispatch(addNewSkillsToEmployee(status, errors))
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(translate("EmployeeSkills")(EmployeeSkills));


