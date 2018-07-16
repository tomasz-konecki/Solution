import React from "react";
import ClientNameInput from "./ClientNameInput";
import "../../scss/components/clients/ClientsList.scss";

const ClientsList = ({
  clients,
  options,
  editingInput,
  handleGetValueFromInput,
  t,
  sortBy,
  clientNameClickedHandler
}) => {
  const listOfClients = clients.map((item, index) => {
    let name =
      editingInput === index ? (
        <ClientNameInput
          value={item.name}
          handleGetValueFromInput={handleGetValueFromInput}
        />
      ) : (
        item.name
      );
    return (
      <tr key={index}>
        <td>
          <span
            onClick={() =>
              clientNameClickedHandler(
                item.id,
                item.name,
                item.clouds,
                index,
                t
              )
            }
          >
            {name}
          </span>
        </td>
        <td className="client-options">
          {options(item.id, item.isDeleted, item.name, index, t)}
        </td>
      </tr>
    );
  });
  return (
    <table className="client-list-table">
      <thead>
        <tr>
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
};

export default ClientsList;
