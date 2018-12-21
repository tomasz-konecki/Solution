import React from 'react'

const skillList = ({skills, showNewAddingTemplate, newSkillName, newSkillNameError, newAddedCounter, newAddSkillColor}) => {
    let skillListMarkup = null;

    if(skills.length === 0){
        skillListMarkup = <p className="empty-list-sk">Brak wyników dla tego ciągu znaków</p>;
    }
    else{
       skillListMarkup = (
        <ul>
            {showNewAddingTemplate && !newSkillNameError &&
            <li className="new-adding-template">
                <span>{newSkillName}</span>
                <b style={{background: newAddSkillColor}}></b>
            </li>}
            {skills.map((skill, index) => (
                <li key={skill.skill.name}>
                    <span>{skill.skill.name}</span>
                    {skill.class && 
                    <i className={skill.class}>N</i>
                    }
                    <b style={{background: skill.color}}></b>
                </li>
            ))}
        </ul>
       ); 
    }

    return skillListMarkup
}

export default skillList;