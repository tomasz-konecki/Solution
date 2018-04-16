import React, { Component } from 'react';
import ProjectSkill from './ProjectSkill';

const mapSkills = (skills) => {
  return skills.map((skillObject, index) => {
    return <ProjectSkill key={index} skillObject={skillObject}/>;
  });
};

const ProjectRowUnfurl = ({toUnfurl}) => {
  return (
    <div>
      <div className="row">
        <span className="col-sm-9">Lista właścicieli: <b>{toUnfurl.owners.join(', ')}</b></span>
        <span className="col-sm-3">ID Projektu: <b>{toUnfurl.id}</b></span>
      </div>
      <hr/>
      <div className="row">
        <span className="col-sm-12">Opis: <b>{toUnfurl.description}</b></span>
      </div>
      <hr/>
      <div className="row">
        <span className="col-sm-6">
          Umiejętności: <br/>
          {mapSkills(toUnfurl.skills)}
        </span>
      </div>
    </div>
  );
};

export default ProjectRowUnfurl;
