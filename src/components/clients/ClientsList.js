import React from "react";

import "../../scss/components/clients/ClientsList.scss";

const ClientsList = ({
  loading,
  clients,
  options,
  t,
  sortBy,
  clientNameClickedHandler
}) => {
  const listOfClients = clients.map((item, index) => {
    return (
      <tr key={index}>
        <td onClick={() => clientNameClickedHandler(item, index)}>
          <span>{item.name}</span>
        </td>
        <td className="client-options">{options(item, index)}</td>
      </tr>
    );
  });

  const content = (
    <table className="client-list-table">
      <thead>
        <tr className="client-list-table-header">
          <th>
            <button
              className="clients-sorting-button"
              onClick={() => sortBy("name")}
            >
              {t("Name")}
            </button>
          </th>
          <th>{t("Options")}</th>
        </tr>
      </thead>
      <tbody>{listOfClients}</tbody>
    </table>
  );
  return <React.Fragment>{content}</React.Fragment>;
};

export default ClientsList;
