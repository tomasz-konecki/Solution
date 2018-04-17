import React, { Component } from 'react';
import ProjectSkill from './ProjectSkill';
import ProjectOwner from './ProjectOwner';

const mapSkills = (skills) => {
  return skills.map((skillObject, index) => {
    return <ProjectSkill key={index} skillObject={skillObject}/>;
  });
};

const mapOwners = (owners, ownerDelete, projectId) => {
  return owners.map((ownerName, index) => {
    return <ProjectOwner clickAction={(e) => ownerDelete(ownerName, projectId, e)} key={index} ownerName={ownerName}/>;
  });
};

const ProjectRowUnfurl = ({toUnfurl, handles}) => {
  return (
    <div>
      <div className="row">
        <span className="col-sm-9">Lista właścicieli: {mapOwners(toUnfurl.owners, handles.ownerDelete, toUnfurl.id)}</span>
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
