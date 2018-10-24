import React from "react";
import "./reportsContent.scss";
import { translate } from 'react-translate';
import Icon from "../../common/Icon";
const reportsContent = ({ loadTeamsResult, baseList, addTeamToResultList, loadTeamsErrors, t }) => (
    <div className="reports-content-container">     
      <h1>{t("AllTeams")}</h1>
      <div className="caffels-container">
        {baseList.length > 0 ? (
          baseList.map(i => {
            return (
              <div title={i.name}
                onClick={
                  i.numberOfMemberInDB > 0
                    ? () => addTeamToResultList(i.name)
                    : null
                }
                key={i.name}
                className={`caffel ${
                  i.numberOfMemberInDB > 0 ? "caffel-on" : "caffel-off"
                }`}
              >
                <div>
                  <i title={t("NumberOfEmployees")} className="fa fa-users" />
                  <b>{i.numberOfMemberInDB}</b>
                </div>
                <span>
                  {i.name.length > 45 ? i.name.slice(0, 45) + "..." : i.name}
                </span>
              </div>
            );
          })
        ) : (
          <p className="server-error">{t("NotFoundResults")} </p>
        )}
        {loadTeamsResult === false && 
          <p className="server-error">{loadTeamsErrors[0]}</p>
        }
      </div>
    </div>
);

export default translate("ReportsContent")(reportsContent);
