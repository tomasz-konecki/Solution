import React from "react";
import "./reportsContent.scss";
import Hoc from "../../../services/auxilary";
import Spinner from '../../common/spinner/spinner';
const reportsContent = ({spinner, showGDriveFolders, loadTeamsResult, baseList, addTeamToResultList, loadTeamsErrors}) => (
  <Hoc>
    {spinner ? (
      <Spinner />
    ) : loadTeamsResult ? (
      showGDriveFolders || (
        <div className="reports-content-container">
          <div className="caffels-container">
            {baseList.length > 0 ? (
              baseList.map(i => {
                return (
                  <div
                    onClick={() => addTeamToResultList(i.name)}
                    key={i.name}
                    className="caffel"
                  >
                    {i.name}
                  </div>
                );
              })
            ) : (
              <p className="server-error">Nie znaleziono wyników </p>
            )}
          </div>
        </div>
      )
    ) : (
      <p className="server-error">{loadTeamsErrors[0]}</p>
    )}
  </Hoc>
);

export default reportsContent;
