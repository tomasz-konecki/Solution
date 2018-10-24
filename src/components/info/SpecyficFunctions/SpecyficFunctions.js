import React from "react";
import "./SpecyficFunctions.scss";

export const SpecyficFunctions = ({ t }) => {
  return (
    <div id="specyfic-roles" className="content-container">
      <h2>{t("ProjectOwner")}</h2>
      <ul>
        <li>{t("Edit/Activate/Closet/DeleteProject")}</li>
        <li>{t("ShareProject")}</li>
        <li>{t("AddProjectOwners")}</li>
        <li>{t("AddSkillsRequired")}</li>
        <li>{t("DisplayProjectsList")}</li>
      </ul>
    </div>
  );
};

export default SpecyficFunctions;
