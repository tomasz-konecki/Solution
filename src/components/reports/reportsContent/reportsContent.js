import React from "react";
import "./reportsContent.scss";
import Spinner from '../../common/spinner/spinner';
const reportsContent = ({spinner, loadTeamsResult, baseList, addTeamToResultList, loadTeamsErrors}) => (
  <React.Fragment>
    {spinner ? 
      <Spinner />
      :
        <div className="reports-content-container">
          <div className="caffels-container">
            {baseList.length > 0 ? 
              baseList.map(i => {
                return (
                  <div
                    onClick={i.numberOfMemberInDB > 0 ?
                      () => addTeamToResultList(i.name) : 
                      null
                      }
                    key={i.name}
                    className={`caffel ${i.numberOfMemberInDB > 0 ? "caffel-on" : "caffel-off"}`}
                  >
                    {i.name}
                  </div>
                );
              })
             : 
              <p className="server-error">Nie znaleziono wyników </p>
            }
          </div>
        </div>
    }

      {loadTeamsResult === false && 
        <p className="server-error">{loadTeamsErrors[0]}</p>
      }
  </React.Fragment>
);

export default reportsContent;
