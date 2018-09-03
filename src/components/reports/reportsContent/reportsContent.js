import React from "react";
import "./reportsContent.scss";
import Spinner from "../../common/LoaderCircular";
import Icon from "../../common/Icon";
const reportsContent = ({
  spinner,
  loadTeamsResult,
  baseList,
  addTeamToResultList,
  loadTeamsErrors
}) => (
  <React.Fragment>
    {spinner ? (
      <Spinner />
    ) : (
      <div className="reports-content-container">     
        <h1>Wszystkie teamy</h1>
        <div className="caffels-container">
          {baseList.length > 0 ? (
            baseList.map(i => {
              return (
                <div
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
                    <i className="fa fa-users" />
                    <b>{i.numberOfMemberInDB}</b>
                  </div>
                  {i.name}
                </div>
              );
            })
          ) : (
            <p className="server-error">Nie znaleziono wyników </p>
          )}
        </div>
      </div>
    )}

    {loadTeamsResult === false && (
      <p className="server-error">{loadTeamsErrors[0]}</p>
    )}
  </React.Fragment>
);

export default reportsContent;
