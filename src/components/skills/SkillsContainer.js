import React, { Component } from 'react';
import { translate } from 'react-translate';
import { sortStrings, getRandomColor } from '../../services/methods';
import { connect } from "react-redux";
import { getAllSkillsACreator } from '../../actions/skillsActions';
import SkillList from './skillList/skillList';
import Spinner from '../common/spinner/spinner';
import './SkillsContainer.scss';
import ServerError from '../common/serverError/serverError';
import { validateInput } from '../../services/validation';
import { addNewSkillACreator, addNewSkill } from '../../actions/skillsActions';
import SmallSpinner from '../common/spinner/small-spinner';
import CorrectOperation from '../common/correctOperation/correctOperation';

const createColorIcons = currentSkills => {
  const skillsWithColors = [];
  for(let key in currentSkills)
    skillsWithColors.push({skill: currentSkills[key], color: getRandomColor()});

  return skillsWithColors;
}

class SkillsContainer extends Component {
  state = {
    skills: null, isLoading: true, 
    searchValue: "", searchedSkills: [], 
    isAddingSkill: false, newSkillName: "", newSkillNameError: "", isAddingSkillSpinner: false,
    showNewAddingTemplate: false,
    newAddSkillColor: getRandomColor()
  }
  componentDidMount(){
    this.props.getAllSkillsACreator([]);
  }
  componentDidUpdate(){
    const { skills, isAddingSkillSpinner } = this.state;
    const { loadedSkills, loadSkillsStatus, addNewSkillStatus, addNewSkillErrors } = this.props;
    if(!skills || loadSkillsStatus === null) {
      const skillsWithColors = createColorIcons(loadedSkills);
      this.setState({skills: skillsWithColors, isLoading: false, 
        searchedSkills: skillsWithColors});
    }
    else if(isAddingSkillSpinner && addNewSkillStatus !== null){
      this.modifyDataAfterSkillAdding(addNewSkillStatus, addNewSkillErrors); 
    }
  }
  modifyDataAfterSkillAdding = (result, errors) => {
    if(result){
      const { newSkillName, searchValue, searchedSkills: oldSearchedSkills, newAddedCounter, newAddSkillColor } = this.state;
      const newSkill = {name: newSkillName, key: newSkillName};
      const newlyAdded = [{skill: newSkill, class: "recently-added", color: newAddSkillColor}];
      const actualSkills = [...this.state.skills];
      const concatedSkills = newlyAdded.concat(actualSkills);

      const searchedSkills = (searchValue === "" || oldSearchedSkills.length === 0) ? 
        concatedSkills : this.searchInSkills(concatedSkills, searchValue);

      this.setState({ searchedSkills: searchedSkills, isAddingSkillSpinner: false, 
        newSkillName: "", showNewAddingTemplate: false, isAddingSkill: false,
        skills: concatedSkills, newAddSkillColor: getRandomColor()}, () => {
          setTimeout(() => {
            this.props.addNewSkill(null, []);
          }, 1500);
        });
    }
    else{
      this.setState({isAddingSkillSpinner: false, newSkillNameError: errors[0]});
    }
  }

  onChangeInputSearch = e => {
    const lowerCasedValue = e.target.value.toLowerCase();
    const { skills } = this.state;

    this.setState({searchValue: lowerCasedValue, searchedSkills: this.searchInSkills(skills, lowerCasedValue)});
  }
  searchInSkills = (skills, searchValue) => {
    const searchedSkills = [];
    for(let key in skills)
      if(skills[key].skill.name.toLowerCase().search(searchValue) !== -1)
        searchedSkills.push(skills[key]);
    
    return searchedSkills;
  }

  initialAddingSkills = () => {
    this.setState({isAddingSkill: true});
  }

  closeAddingSkills = () => {
    this.setState({isAddingSkill: false, newSkillNameError: "", newSkillName: "", showNewAddingTemplate: false});
  }

  onChangeNewFolderName = e => {
    const { value } = e.target;
    this.setState({newSkillName: value, newSkillNameError: this.validate(value)});
  }
  validate = value => {
    const { skills } = this.state;
    for(let key in skills){
      if(skills[key].skill.name.toLowerCase() === value.toLowerCase())
        return "Ta umiejętność już istnieje";
    }

    return validateInput(value, false, 0, 120, null, "nazwa umiejętności");
  }
  addNewSkill = e => {
    if (e.key === "Enter") {
      const { newSkillName } = this.state;
      const newSkillNameError = this.validate(newSkillName);
      
      if(newSkillNameError){
        this.setState({newSkillNameError: newSkillNameError});
      }
      else{
        this.setState({isAddingSkillSpinner: true});
        this.props.addNewSkillACreator(e.target.value);
      }
    }
  }
  render(){
    const { isLoading, searchValue, searchedSkills, isAddingSkill, newSkillName, isAddingSkillSpinner,
      newSkillNameError, showNewAddingTemplate, newAddSkillColor } = this.state;
    const { loadSkillsStatus, loadSkillsErrors, addNewSkillStatus } = this.props;

    const iconType = (isAddingSkill ? 
      <i onClick={isAddingSkillSpinner ? null : this.closeAddingSkills} className="fa fa-times"></i> :
      <i onClick={this.initialAddingSkills} className="fa fa-plus"></i> 
      );
    
    return(
      <div className="skills-panel-container">
        {isLoading === true ? <Spinner /> : 

          loadSkillsStatus === false ? 
          <ServerError errorClass="whole-page-error"
          message={loadSkillsErrors[0]} />
          : 

          <React.Fragment>
            <div className="left-panel-container">
              {addNewSkillStatus && <CorrectOperation />}
              <header>
                <span>
                  Wszystkie umiejętności
                  {iconType}
                </span>
                <div className="searcher-container">
                  {isAddingSkill ? 
                    <input 
                    onFocus={() => this.setState({showNewAddingTemplate: true})}
                    className={newSkillNameError ? "invalid-name" : ""}
                    onKeyPress={isAddingSkillSpinner ? null : e => this.addNewSkill(e)}
                    type="text" value={newSkillName}
                    placeholder="wpisz nazwę nowej umiejętności" 
                    onChange={e => this.onChangeNewFolderName(e)}/> :

                    <input value={searchValue} 
                    onChange={e => this.onChangeInputSearch(e)}
                    type="text"
                    placeholder="wpisz nazwę umiejętności..."
                    />
                  }
                  <p className="valid-error">
                    <span>{newSkillNameError}</span>
                  </p>
                  {isAddingSkill ||
                    <i className="fa fa-search"></i>
                  }

                  {isAddingSkillSpinner && 
                    <SmallSpinner />
                  }
                </div>
              </header>
              
              <SkillList newAddSkillColor={newAddSkillColor}
              newSkillName={newSkillName} newSkillNameError={newSkillNameError} 
              skills={searchedSkills} showNewAddingTemplate={showNewAddingTemplate && newSkillName}/>
            </div>


            <div className="right-panel-container">

            </div>
          </React.Fragment>
        }
        
      </div>
    );
  }
  
}


const mapStateToProps = state => {
  return {
    loadedSkills: state.skillsReducer.loadedSkills,
    loadSkillsStatus: state.skillsReducer.loadSkillsStatus,
    loadSkillsErrors: state.skillsReducer.loadSkillsErrors,

    addNewSkillStatus: state.skillsReducer.addNewSkillStatus,
    addNewSkillErrors: state.skillsReducer.addNewSkillErrors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllSkillsACreator: (currentSkills) => dispatch(getAllSkillsACreator(currentSkills)),
    addNewSkillACreator: (name) => dispatch(addNewSkillACreator(name)),
    addNewSkill: (status, errors) => dispatch(addNewSkill(status, errors))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("SkillsContainer")(SkillsContainer));


